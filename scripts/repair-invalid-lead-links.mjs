import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
try {
  if (!process.argv.includes('--apply')) {
    const rows = await sql`select count(*)::int as invalid_links from leads l where partner_id is not null and not exists (select 1 from partners p where p.id::text=l.partner_id)`;
    console.log(JSON.stringify(rows[0]));
  } else {
    const rows = await sql`WITH repaired AS (
      UPDATE leads l SET qualification=coalesce(l.qualification,'{}'::jsonb) || jsonb_build_object('previousInvalidPartnerId',l.partner_id),
        partner_id=null, updated_at=now()
      WHERE l.partner_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM partners p WHERE p.id::text=l.partner_id)
      RETURNING l.id
    ), history AS (
      INSERT INTO lead_events (lead_id,event,actor,payload)
      SELECT id,'invalid_partner_link_removed','production_audit',jsonb_build_object('reason','unresolved_partner','previousValuePreservedInQualification',true) FROM repaired RETURNING id
    ) SELECT count(*)::int as repaired FROM history`;
    console.log(JSON.stringify(rows[0]));
  }
} catch { console.error('Réparation des rattachements échouée ; détails masqués.'); process.exitCode=1; }
