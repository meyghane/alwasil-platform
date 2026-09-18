import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { leads, leadEvents, leadAssignments } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';
export async function GET() {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 try {
  const leadRows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const eventRows = leadRows.length ? await db.select().from(leadEvents).orderBy(desc(leadEvents.createdAt)) : [];
  const eventsByLead = new Map<string, typeof eventRows>();
  for (const event of eventRows) eventsByLead.set(event.leadId, [...(eventsByLead.get(event.leadId) || []), event]);
  return NextResponse.json({ leads: leadRows.map(lead => ({ ...lead, events: eventsByLead.get(lead.id) || [] })) });
 } catch (error) {
  console.error('[admin/leads] read failed:', error instanceof Error ? error.message : 'unknown');
  return NextResponse.json({ error: 'La base des demandes est temporairement indisponible.' }, { status: 503 });
 }
}
export async function PATCH(req: Request) {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 const { id, status, partnerId } = await req.json();
 const allowed = ['new','qualified','assigned','accepted','quoted','won','lost','expired'];
 if (!id || (!allowed.includes(status) && !partnerId)) return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
 if (partnerId) {
  await db.update(leads).set({ partnerId: String(partnerId), status: 'assigned', updatedAt: new Date() }).where(eq(leads.id, id));
  await db.insert(leadEvents).values({ leadId: id, event: 'assigned', actor: 'admin', payload: { partnerId: String(partnerId) } });
  return NextResponse.json({ ok: true, assigned: true });
 }
 const [lead] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning({ id: leads.id });
 if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
 await db.insert(leadEvents).values({ leadId: id, event: `status_changed:${status}`, actor: 'admin' });
 return NextResponse.json({ ok: true });
}
