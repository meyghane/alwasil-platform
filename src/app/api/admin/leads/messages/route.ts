import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { canContactPartner } from '@/lib/partner-quality';

export async function GET(request: Request) {
  if (!await isAdminLoggedIn()) return Response.json({error:'Non autorisé'},{status:401});
  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return Response.json({error:'Identifiant invalide'},{status:400});
  try {
    const sql=neon(process.env.DATABASE_URL!);
    const messages=await sql`SELECT recipient_type,result,error_code,created_at,completed_at FROM lead_email_deliveries WHERE lead_id=${id}::uuid ORDER BY created_at DESC LIMIT 50`;
    return Response.json({messages});
  } catch { return Response.json({error:'Journal indisponible'},{status:503}); }
}
export async function POST(request: Request) {
  if (!await isAdminLoggedIn()) return Response.json({error:'Non autorisé'},{status:401});
  let body;
  try { body=await request.json(); } catch { return Response.json({error:'Message invalide'},{status:400}); }
  const {id,recipient,message}=body || {};
  if (typeof id!=='string' || !/^[0-9a-f-]{36}$/i.test(id) || !['client','partner'].includes(recipient) || typeof message!=='string' || message.trim().length<10 || message.length>4000) return Response.json({error:'Message invalide'},{status:400});
  const sql=neon(process.env.DATABASE_URL!);
  try {
    const [lead]=await sql`SELECT * FROM leads WHERE id=${id}::uuid`;
    if (!lead || lead.anonymized_at || lead.status==='expired' || !lead.consent_follow_up) return Response.json({error:'Demande active et consentement requis'},{status:422});
    let to=lead.email;
    if (recipient==='partner') {
      const [partner]=await sql`SELECT * FROM partners WHERE id::text=${lead.partner_id || ''}`;
      if (!partner || !canContactPartner({status:partner.status,email:partner.email,phone:partner.phone,sourceUrl:partner.source_url,verifiedAt:partner.verified_at})) return Response.json({error:'Agence vérifiée requise'},{status:422});
      to=partner.email;
    }
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return Response.json({error:'Expéditeur et clé Resend à configurer'},{status:503});
    const key=createHash('sha256').update([id,recipient,to,message.trim(),new Date().toISOString().slice(0,10)].join('|')).digest('hex');
    const claimed=await sql`INSERT INTO lead_email_deliveries(dedupe_key,lead_id,recipient_type) VALUES (${key},${id}::uuid,${recipient}) ON CONFLICT DO NOTHING RETURNING dedupe_key`;
    if (!claimed.length) return Response.json({error:'Ce message a déjà été traité ou sa livraison reste incertaine. Consulter le journal.'},{status:409});
    try {
      const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':key},signal:AbortSignal.timeout(10000),body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to:[to],subject:`Votre demande Al-Wasil ${lead.ticket_reference}`,text:message.trim()})});
      if (!response.ok) {
        await sql`UPDATE lead_email_deliveries SET result='failed',error_code=${`provider_http_${response.status}`},completed_at=now() WHERE dedupe_key=${key}`;
        return Response.json({error:'Envoi refusé par le fournisseur. Voir le journal.'},{status:502});
      }
      const data=await response.json();
      if (!data.id) throw new Error('no_id');
      await sql.transaction([
        sql`UPDATE lead_email_deliveries SET result='accepted',provider_id=${String(data.id)},completed_at=now() WHERE dedupe_key=${key}`,
        sql`INSERT INTO lead_events(lead_id,event,actor,payload) VALUES (${id}::uuid,'email_accepted','admin',${JSON.stringify({recipientType:recipient})}::jsonb)`,
      ]);
      return Response.json({ok:true,status:'accepted',notice:'Accepté par Resend ; livraison au destinataire non encore confirmée.'});
    } catch {
      await sql`UPDATE lead_email_deliveries SET result='uncertain',error_code='delivery_unconfirmed',completed_at=now() WHERE dedupe_key=${key}`;
      return Response.json({error:'Livraison incertaine : vérifier le journal, ne pas renvoyer automatiquement.'},{status:502});
    }
  } catch { return Response.json({error:'Service momentanément indisponible'},{status:503}); }
}
