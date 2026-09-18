import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads, leadEvents, leadAssignments, partners } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
type LeadStatus = NonNullable<typeof leads.$inferInsert.status>;
export async function GET() {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 try {
  const leadRows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const eventRows = leadRows.length ? await db.select().from(leadEvents).orderBy(desc(leadEvents.createdAt)) : [];
  const eventsByLead = new Map<string, typeof eventRows>();
  for (const event of eventRows) eventsByLead.set(event.leadId, [...(eventsByLead.get(event.leadId) || []), event]);
  const partnerRows = await db.select({ id: partners.id, name: partners.name, email: partners.email, status: partners.status }).from(partners).orderBy(partners.name);
  return NextResponse.json({ leads: leadRows.map(lead => ({ ...lead, events: eventsByLead.get(lead.id) || [] })), partners: partnerRows });
 } catch (error) {
  console.error('[admin/leads] read failed:', error instanceof Error ? error.message : 'unknown');
  return NextResponse.json({ error: 'La base des demandes est temporairement indisponible.' }, { status: 503 });
 }
}
export async function PATCH(req: Request) {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 const session = await getUserSession();
 const actor = session ? `${session.role}:${session.email}` : 'admin:legacy';
 const { id, status, partnerId, rollbackEventId, remindPartner } = await req.json();
 const allowed = ['new','qualified','assigned','accepted','quoted','won','lost','expired'];
 if (remindPartner && id) {
  const [lead] = await db.select().from(leads).where(eq(leads.id, String(id))).limit(1);
  const partner = lead?.partnerId ? (await db.select().from(partners).where(eq(partners.id, lead.partnerId)).limit(1))[0] : null;
  if (!lead || !partner) return NextResponse.json({ error: 'Aucune agence attribuée à ce ticket.' }, { status: 400 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const qualification = (lead.qualification || {}) as Record<string, unknown>;
  const result = await resend.emails.send({
   from: process.env.RESEND_FROM_EMAIL || 'Al-Wasil <onboarding@resend.dev>',
   to: [partner.email], replyTo: lead.email,
   subject: `[Relance Al-Wasil] Demande ${lead.travelType} - ${lead.name}`,
   text: `Bonjour,\n\nNous revenons vers vous au sujet de la demande ${lead.travelType} de ${lead.name}.\n\nBudget : ${String(qualification.budget || 'non précisé')}\nDépart : ${String(qualification.depart || qualification.ville_depart || 'non précisé')}\nVoyageurs : ${String(qualification.voyageurs || qualification.nombre || 'non précisé')}\n\nMerci de nous indiquer si vous pouvez proposer une formule et ses conditions.\n\nCordialement,\nMégane - Al-Wasil`,
  });
  if (result.error) return NextResponse.json({ error: 'La relance email n’a pas pu être envoyée.' }, { status: 502 });
  await db.insert(leadEvents).values({ leadId: lead.id, event: 'partner_reminded', actor, payload: { partnerId: partner.id, email: partner.email } });
  return NextResponse.json({ ok: true, reminded: true });
 }
 if (rollbackEventId) {
  const [event] = await db.select().from(leadEvents).where(eq(leadEvents.id, String(rollbackEventId))).limit(1);
  const payload = (event?.payload || {}) as Record<string, unknown>;
  const previousStatus = typeof payload.previousStatus === 'string' ? payload.previousStatus : '';
  const actionStatusText = typeof payload.status === 'string' ? payload.status : '';
  if (!event || event.event !== 'status_changed' || !allowed.includes(previousStatus) || !allowed.includes(actionStatusText)) {
   return NextResponse.json({ error: 'Cette action ne peut pas être annulée.' }, { status: 400 });
  }
  const actionStatus = actionStatusText as LeadStatus;
  const [lead] = await db.update(leads).set({ status: previousStatus as LeadStatus, updatedAt: new Date() }).where(and(eq(leads.id, event.leadId), eq(leads.status, actionStatus))).returning({ id: leads.id });
  if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
  await db.insert(leadEvents).values({ leadId: event.leadId, event: 'action_rolled_back', actor, payload: { revertedEventId: event.id, restoredStatus: previousStatus } });
  return NextResponse.json({ ok: true, restoredStatus: previousStatus });
 }
 if (!id || (!allowed.includes(status) && !partnerId)) return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
 if (partnerId) {
  const [partner] = await db.select({ id: partners.id }).from(partners).where(eq(partners.id, String(partnerId))).limit(1);
  if (!partner) return NextResponse.json({ error: 'Agence introuvable' }, { status: 404 });
  const [assigned] = await db.update(leads).set({ partnerId: String(partnerId), status: 'assigned', updatedAt: new Date() }).where(eq(leads.id, id)).returning({ id: leads.id });
  if (!assigned) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
  await db.insert(leadEvents).values({ leadId: id, event: 'assigned', actor, payload: { partnerId: String(partnerId) } });
  return NextResponse.json({ ok: true, assigned: true });
 }
 const [current] = await db.select({ id: leads.id, status: leads.status }).from(leads).where(eq(leads.id, id)).limit(1);
 if (!current) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
 const [lead] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning({ id: leads.id });
 if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
 await db.insert(leadEvents).values({ leadId: id, event: 'status_changed', actor, payload: { status, previousStatus: current.status } });
 return NextResponse.json({ ok: true });
}
