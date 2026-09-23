import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { POST as sendLeadMessage } from './messages/route';
import { db } from '@/db';
import { leads, leadEvents, partners } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { canContactPartner } from '@/lib/partner-quality';
export async function GET() {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 try {
  const leadRows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const eventRows = leadRows.length ? await db.select().from(leadEvents).orderBy(desc(leadEvents.createdAt)) : [];
  const eventsByLead = new Map<string, typeof eventRows>();
  for (const event of eventRows) eventsByLead.set(event.leadId, [...(eventsByLead.get(event.leadId) || []), event]);
  const partnerRows = await db.select().from(partners).orderBy(partners.name);
  return NextResponse.json({ leads: leadRows.map(lead => ({ ...lead, events: eventsByLead.get(lead.id) || [] })), partners: partnerRows.map(partner=>({...partner,contactAllowed:canContactPartner(partner)})) });
 } catch (error) {
  console.error('[admin/leads] read failed:', error instanceof Error ? error.message : 'unknown');
  return NextResponse.json({ error: 'La base des demandes est temporairement indisponible.' }, { status: 503 });
 }
}
export async function PATCH(req: Request) {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 try {
  const body = await req.json();
  const { id, status, partnerId, rollbackEventId, remindPartner, updatedAt } = body || {};
  if (remindPartner && id) return sendLeadMessage(new Request(req.url, {method:'POST',headers:req.headers,body:JSON.stringify({id,recipient:'partner',message:'Bonjour, nous revenons vers vous au sujet de cette demande Al-Wasil. Merci de nous confirmer sa prise en charge et les prochaines étapes.'})}));
  const allowed = ['new','qualified','assigned','accepted','quoted','won','lost','expired'];
  const sql = neon(process.env.DATABASE_URL!);
  let leadId = id, nextStatus = status, nextPartner: string | null | undefined = undefined;
  let eventName = 'status_changed';
  if (rollbackEventId) {
   if (!/^[0-9a-f-]{36}$/i.test(String(rollbackEventId))) return NextResponse.json({error:'Action invalide'},{status:400});
   const [event] = await sql`SELECT * FROM lead_events WHERE id=${rollbackEventId}::uuid`;
   if (!event || !['status_changed','assigned'].includes(event.event) || !allowed.includes(event.payload?.previousStatus)) return NextResponse.json({error:'Retour arrière non disponible'},{status:422});
   const [latest] = await sql`SELECT id FROM lead_events WHERE lead_id=${event.lead_id}::uuid AND event IN ('status_changed','assigned','action_rolled_back') ORDER BY created_at DESC,id DESC LIMIT 1`;
   if (latest?.id !== event.id) return NextResponse.json({error:'Une action plus récente existe. Recharge le ticket.'},{status:409});
   leadId=event.lead_id;nextStatus=event.payload.previousStatus;nextPartner=event.payload.previousPartnerId || null;eventName='action_rolled_back';
  }
  if (typeof leadId!=='string'||!/^[0-9a-f-]{36}$/i.test(leadId)) return NextResponse.json({error:'Ticket invalide'},{status:400});
  const [current] = await sql`SELECT * FROM leads WHERE id=${leadId}::uuid`;
  if (!current) return NextResponse.json({error:'Ticket introuvable'},{status:404});
  if (!updatedAt || new Date(current.updated_at).toISOString() !== updatedAt) return NextResponse.json({error:'Le ticket a changé. Recharge avant de modifier.'},{status:409});
  if (current.anonymized_at) return NextResponse.json({error:'Ticket anonymisé : identité non restaurable'},{status:422});
  if (partnerId) {nextPartner=String(partnerId);nextStatus='assigned';eventName='assigned';}
  if (nextPartner) {
   const [partner]=await sql`SELECT * FROM partners WHERE id::text=${nextPartner}`;
   if (!partner || !canContactPartner({status:partner.status,email:partner.email,phone:partner.phone,sourceUrl:partner.source_url,verifiedAt:partner.verified_at})) return NextResponse.json({error:'Agence non vérifiée'},{status:422});
  }
  if (!allowed.includes(nextStatus)) return NextResponse.json({error:'Statut invalide'},{status:400});
  if (nextPartner === undefined) nextPartner=current.partner_id;
  const payload={previousStatus:current.status,previousPartnerId:current.partner_id,status:nextStatus,partnerId:nextPartner,...(rollbackEventId?{revertedEventId:rollbackEventId}:{})};
  const changed=await sql`WITH changed AS (
    UPDATE leads SET status=${nextStatus}::lead_status,partner_id=${nextPartner},updated_at=now()
    WHERE id=${leadId}::uuid AND updated_at=${updatedAt}::timestamptz RETURNING id
  ) INSERT INTO lead_events(lead_id,event,actor,payload)
    SELECT id,${eventName},'admin',${JSON.stringify(payload)}::jsonb FROM changed RETURNING lead_id`;
  return NextResponse.json({ok:changed.length===1},{status:changed.length?200:409});
 } catch { return NextResponse.json({error:'Modification impossible. Vérifier le ticket et réessayer.'},{status:503}); }
}
