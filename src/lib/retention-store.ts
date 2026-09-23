import { neon } from '@neondatabase/serverless';
import { retentionCutoffs, retentionApproved } from './privacy-retention';
export async function runRetention(apply = false, now = new Date()) {
  const sql = neon(process.env.DATABASE_URL!);
  const cutoff = retentionCutoffs(now);
  const [counts] = await sql`SELECT
    (SELECT count(*)::int FROM leads WHERE created_at<${cutoff.leads.toISOString()}::timestamptz AND anonymized_at IS NULL) AS leads,
    (SELECT count(*)::int FROM form_submissions WHERE created_at<${cutoff.submissions.toISOString()}::timestamptz AND status<>'anonymized') AS submissions`;
  if (!apply || !retentionApproved(process.env)) return { mode: 'dry_run', counts, requiresApproval: true };
  // Subject payloads and email identifiers must not preserve a back door to the identity.
  await sql.transaction([
    sql`UPDATE lead_events SET payload='{}'::jsonb WHERE lead_id IN (SELECT id FROM leads WHERE created_at<${cutoff.leads.toISOString()}::timestamptz AND anonymized_at IS NULL)`,
    sql`UPDATE lead_email_deliveries SET provider_id=NULL,dedupe_key='anonymized:' || lead_id::text || ':' || md5(dedupe_key) WHERE lead_id IN (SELECT id FROM leads WHERE created_at<${cutoff.leads.toISOString()}::timestamptz AND anonymized_at IS NULL)`,
    sql`UPDATE leads SET name='Demande anonymisée',email='',phone=NULL,qualification='{}'::jsonb,source=NULL,utm='{}'::jsonb,consent_follow_up=false,status='expired',anonymized_at=now(),updated_at=now() WHERE created_at<${cutoff.leads.toISOString()}::timestamptz AND anonymized_at IS NULL`,
    sql`UPDATE form_submissions SET fingerprint='anonymized:' || id::text,ip_hash='',page=NULL,campaign=NULL,referrer=NULL,utm='{}'::jsonb,error_code=NULL,status='anonymized' WHERE created_at<${cutoff.submissions.toISOString()}::timestamptz AND status<>'anonymized'`,
    sql`INSERT INTO retention_runs(mode,lead_count,submission_count) VALUES ('applied',${counts.leads},${counts.submissions})`,
  ]);
  return { mode: 'applied', counts, requiresApproval: false };
}
