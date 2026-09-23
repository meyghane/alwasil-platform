import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import type { Source, RecordData, Assessment, RunReport } from './contracts';
import { duplicateEvidence } from './policy';
const client = () => neon(process.env.DATABASE_URL!);
const categories: Record<string,string> = { mosquee: 'institute', institut: 'institute', evenement: 'event', association: 'solidarity', librairie: 'library', piscine: 'pool', hajj: 'hajj', cagnotte: 'solidarity', sante: 'health', emploi: 'job' };
const subTypes: Record<string,string> = { evenement: 'event', hajj: 'package', emploi: 'job_offer' };
export async function registeredSources(): Promise<Source[]> {
  return await client()`SELECT id,url,category,departments,trust,official,evidence,enabled FROM agent_sources` as Source[];
}
export async function recordSourceCheck(id: string, errorCode: string | null) {
  await client()`UPDATE agent_sources SET last_checked_at=now(),run_count=run_count+1,error_count=error_count+CASE WHEN ${errorCode}::text IS NULL THEN 0 ELSE 1 END,last_error_code=${errorCode} WHERE id=${id}::uuid`;
}
export async function saveAgentRecord(record: RecordData, assessment: Assessment, sql = client()) {
  const existing = await sql`SELECT id,title,city,metadata FROM items WHERE category=${categories[record.category]}::category AND status IN ('pending','approved')`;
  const duplicate = existing.find(row => {
    const prior = row.metadata?.agentRecord as RecordData | undefined;
    if (prior) return duplicateEvidence(record, prior).length > 0;
    const raw = row.metadata?.raw || {};
    return String(raw.name || raw.title || row.title || '').toLowerCase() === record.title.toLowerCase() && String(raw.city || row.city || '').toLowerCase() === record.city.toLowerCase();
  });
  if (duplicate) return { id: String(duplicate.id), duplicate: true, published: false };
  const identity = createHash('sha256').update([record.category,record.title.toLowerCase(),record.city.toLowerCase(),record.date || ''].join('|')).digest('hex');
  const status = assessment.decision === 'automatic' ? 'approved' : 'pending';
  const raw = { ...record, name: record.title, type: subTypes[record.category] || record.category, horaires: record.hours.join('\n'), lastVerifiedAt: record.verifiedAt, confidence: assessment.confidence, sourceUrl: record.provenance.url };
  const metadata = { subType: subTypes[record.category] || record.category, raw, agentRecord: record, agentIdentity: identity, autoPublished: status === 'approved', confidence: assessment.confidence, publicationReasons: assessment.reasons, requiresEnrichment: status !== 'approved', publishedAt: status === 'approved' ? new Date().toISOString() : null };
  const rows = await sql`WITH inserted AS (
    INSERT INTO items(category,status,title,description,city,department,date_start,source,source_url,tags,metadata,last_verified_at,next_review_at)
    VALUES (${categories[record.category]}::category,${status}::status,${record.title},${record.description},${record.city},${record.department},${record.date || null}::timestamptz,
      'agent-pipeline',${record.provenance.url},${record.tags},${JSON.stringify(metadata)}::jsonb,now(),now()+interval '30 days')
    ON CONFLICT DO NOTHING RETURNING *
  ), logged AS (
    INSERT INTO agent_item_history(item_id,action,actor,after_snapshot,reasons)
    SELECT id,${status === 'approved' ? 'auto_published' : 'deferred'},'agent:publication',to_jsonb(inserted),${JSON.stringify(assessment.reasons)}::jsonb FROM inserted
  ) SELECT id FROM inserted`;
  return { id: String(rows[0]?.id || ''), duplicate: rows.length === 0, published: rows.length > 0 && status === 'approved' };
}
export async function rollbackInvisible(id: string, sql = client()) {
  await sql`WITH prior AS (SELECT * FROM items WHERE id=${id}::uuid AND status='approved' FOR UPDATE), changed AS (
    UPDATE items SET status='pending',metadata=items.metadata || '{"autoPublished":false}'::jsonb,updated_at=now() FROM prior WHERE items.id=prior.id RETURNING items.*
  ) INSERT INTO agent_item_history(item_id,action,actor,before_snapshot,after_snapshot,reasons)
    SELECT changed.id,'publication_failed','agent:publication',to_jsonb(prior),to_jsonb(changed),'["public_visibility_failed"]'::jsonb FROM changed JOIN prior ON changed.id=prior.id`;
}
export async function saveAgentReport(report: RunReport) {
  await client()`UPDATE agent_runs SET status=${report.errors.length ? 'attention' : 'complete'},report=${JSON.stringify(report)}::jsonb,completed_at=now() WHERE id=${report.id}::uuid`;
}
export async function claimRun(key: string) {
  const rows = await client()`INSERT INTO agent_runs(run_key) VALUES (${key}) ON CONFLICT DO NOTHING RETURNING id`;
  return rows[0]?.id ? String(rows[0].id) : null;
}
export async function existingRun(key: string) {
  const [run] = await client()`SELECT status FROM agent_runs WHERE run_key=${key}`;
  return run?.status || 'unknown';
}
