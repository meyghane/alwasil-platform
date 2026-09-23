import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';

const sql = neon(process.env.DATABASE_URL);
const migrations = ['0005_reports.sql', '0008_moderation_history.sql', '0009_moderation_undo.sql', '0010_audience_events.sql', '0011_lead_ticket_reference.sql', '0012_telegram_delivery.sql', '0013_partner_verification.sql', '0014_agents.sql', '0015_source_registry.sql', '0016_crm_privacy.sql'];
try {
  if (process.argv.includes('--apply')) {
    // Explicit additive migrations only. Do not use schema push on a shared DB.
    for (const file of migrations) {
      const source = await readFile(new URL(`../src/db/migrations/${file}`, import.meta.url), 'utf8');
      for (const statement of source.split(';').map(s => s.trim()).filter(s => s && !/^(BEGIN|COMMIT)$/i.test(s))) await sql.query(statement);
      console.log(JSON.stringify({ migration: file, applied: true }));
    }
  }
  const requirements = { moderation_log: ['previous_status','new_status'], reports: ['id'], audience_events: ['id'], telegram_deliveries: ['dedupe_key','result','error_code'], partners: ['source_url','verified_at','website','agreement_status'], leads: ['ticket_reference','anonymized_at'], lead_email_deliveries: ['dedupe_key','result','provider_id'], retention_runs: ['mode','lead_count','submission_count'], agent_sources: ['id','trust','domain','adapter','authorized_at','last_checked_at','run_count','error_count','last_error_code'], agent_runs: ['id','run_key'], agent_item_history: ['before_snapshot','rollback_until'], agent_source_history: ['before_snapshot','after_snapshot'] };
  const columns = await sql`select table_name,column_name from information_schema.columns where table_schema='public'`;
  const missing = Object.entries(requirements).flatMap(([table, fields]) => fields.filter(field => !columns.some(c => c.table_name === table && c.column_name === field)).map(field => `${table}.${field}`));
  const counts = await sql`select (select count(*)::int from partners) as partners, (select count(*)::int from offers) as offers, (select count(*)::int from leads) as leads, (select count(*)::int from leads where ticket_reference is null) as missing_tickets, (select count(*)::int from leads l where partner_id is not null and not exists (select 1 from partners p where p.id::text=l.partner_id)) as invalid_partner_links`;
  console.log(JSON.stringify({ missingSchema: missing, crm: counts[0] }));
  if (!missing.length) {
    const [coverage] = await sql`SELECT (SELECT count(*)::int FROM agent_sources) AS agent_sources, (SELECT count(*)::int FROM agent_runs) AS agent_runs, (SELECT count(*)::int FROM items WHERE category='hajj' AND status='pending') AS hajj_pending, (SELECT count(*)::int FROM items WHERE category='hajj' AND status='expired') AS hajj_archived`;
    console.log(JSON.stringify({ coverage }));
  }
  if (missing.length) process.exitCode = 1;
} catch { console.error('Vérification/migration échouée ; détails confidentiels masqués.'); process.exitCode = 1; }
