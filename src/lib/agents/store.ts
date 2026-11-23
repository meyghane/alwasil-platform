import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import type { Source, RecordData, Assessment, RunReport, AgentCategory } from './contracts';
import { duplicateEvidence } from './policy';
const client = () => neon(process.env.DATABASE_URL!);
const categories: Record<string,string> = { mosquee: 'institute', institut: 'institute', evenement: 'event', association: 'solidarity', librairie: 'library', piscine: 'pool', hajj: 'hajj', cagnotte: 'solidarity', sante: 'health', justice: 'justice', emploi: 'job' };
const subTypes: Record<string,string> = { evenement: 'event', hajj: 'package', justice: 'legal_resource', emploi: 'job_offer' };
const sourceCategory: Record<string,AgentCategory> = {
  mosquee: 'mosquee', mosque: 'mosquee', institut: 'institut', institute: 'institut',
  evenement: 'evenement', event: 'evenement', association: 'association', solidarity: 'association',
  librairie: 'librairie', library: 'librairie', piscine: 'piscine', pool: 'piscine',
  hajj: 'hajj', cagnotte: 'cagnotte', sante: 'sante', health: 'sante',
  justice: 'justice', emploi: 'emploi', job: 'emploi',
};
export async function registeredSources(): Promise<Source[]> {
  const rows = await client()`SELECT id,url,category,departments,trust,official,evidence,enabled FROM agent_sources`;
  return rows.flatMap(row => {
    const category = sourceCategory[String(row.category).toLowerCase()];
    return category ? [{ ...row, category } as Source] : [];
  });
}
export async function rememberQualifiedSource(source: Source, department: string): Promise<string | null> {
  const sql = client();
  const departments = department ? [department] : [];
  const rows = await sql`WITH prior AS (
      SELECT * FROM agent_sources WHERE url=${source.url} FOR UPDATE
    ), changed AS (
      INSERT INTO agent_sources(url,domain,category,departments,trust,official,evidence,enabled,authorized_at)
      VALUES (${source.url},${new URL(source.url).hostname},${source.category},${departments},'trusted',true,${source.evidence},true,now())
      ON CONFLICT(url) DO UPDATE SET domain=excluded.domain,departments=(
        SELECT ARRAY(SELECT DISTINCT unnest(agent_sources.departments || excluded.departments))
      ),trust='trusted',official=true,
        evidence=excluded.evidence,enabled=true,authorized_at=now(),updated_at=now()
      WHERE agent_sources.trust <> 'blocked' AND agent_sources.category=excluded.category
      RETURNING *
    )
    INSERT INTO agent_source_history(source_id,actor,before_snapshot,after_snapshot)
    SELECT changed.id,'agent:official-source-qualification',to_jsonb(prior),to_jsonb(changed)
    FROM changed LEFT JOIN prior ON prior.id=changed.id
    RETURNING source_id`;
  return rows[0]?.source_id ? String(rows[0].source_id) : null;
}
export async function recordSourceCheck(id: string, errorCode: string | null) {
  await client()`UPDATE agent_sources SET last_checked_at=now(),run_count=run_count+1,error_count=error_count+CASE WHEN ${errorCode}::text IS NULL THEN 0 ELSE 1 END,last_error_code=${errorCode} WHERE id=${id}::uuid`;
}
export async function saveAgentRecord(record: RecordData, assessment: Assessment, sql = client()) {
  const existing = await sql`SELECT id,status,title,city,metadata FROM items WHERE category=${categories[record.category]}::category AND status IN ('pending','approved','expired')`;
  const duplicate = existing.find(row => {
    const prior = row.metadata?.agentRecord as RecordData | undefined;
    if (prior) return duplicateEvidence(record, prior).length > 0;
    const raw = row.metadata?.raw || {};
    return String(raw.name || raw.title || row.title || '').toLowerCase() === record.title.toLowerCase() && String(raw.city || row.city || '').toLowerCase() === record.city.toLowerCase();
  });
  let verifiedHajjPartner: { id: string; name: string; email: string; source_url: string; verified_at: Date | string } | undefined;
  if (record.category === 'hajj') {
    const offer = record.hajjOffer;
    if (!offer || !/^[0-9a-f-]{36}$/i.test(offer.partnerId)) return { id: '', duplicate: false, published: false, blocked: 'offre conservée privée : aucun partner_id réel fourni' };
    const rows = await sql`SELECT id,name,email,source_url,verified_at FROM partners WHERE id=${offer.partnerId}::uuid AND status='verified' LIMIT 1`;
    verifiedHajjPartner = rows[0] as typeof verifiedHajjPartner;
    const normalizeEntity = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    let sameOfficialSite = false;
    try { sameOfficialSite = !!verifiedHajjPartner?.source_url && new URL(verifiedHajjPartner.source_url).origin === new URL(record.provenance.url).origin; } catch { /* Missing or malformed source keeps the offer private. */ }
    if (!verifiedHajjPartner || !verifiedHajjPartner.email || !verifiedHajjPartner.verified_at || !sameOfficialSite || normalizeEntity(verifiedHajjPartner.name) !== normalizeEntity(offer.agencyName)) {
      return { id: '', duplicate: false, published: false, blocked: 'offre conservée privée : correspondance agence/partner_id vérifié non établie' };
    }
  }
  const identity = createHash('sha256').update([record.category,record.title.toLowerCase(),record.city.toLowerCase(),record.date || ''].join('|')).digest('hex');
  const status = assessment.decision === 'automatic' ? 'approved' : 'pending';
  const itemSubtype = record.category === 'sante' ? record.healthSubtype : subTypes[record.category] || record.category;
  const raw = { ...record, name: record.title, type: record.category === 'piscine' ? record.poolType || 'piscine' : itemSubtype || record.category, horaires: record.hours.join('\n'), lastVerifiedAt: record.verifiedAt, confirmed: record.category === 'piscine' && assessment.decision === 'automatic', confidence: assessment.confidence, sourceUrl: record.provenance.url,
    ...(record.category === 'cagnotte' ? {
      isActive: record.campaignStatus === 'active', campaignStatus: record.campaignStatus,
      ...(record.campaignRaised !== undefined ? { raised: record.campaignRaised } : {}),
      ...(record.campaignGoal !== undefined ? { goal: record.campaignGoal } : {}),
      ...(record.campaignBackers !== undefined ? { backers: record.campaignBackers } : {}),
      ...(record.campaignCurrency ? { currency: record.campaignCurrency } : {}),
      ...((record.campaignRaised !== undefined || record.campaignGoal !== undefined || record.campaignBackers !== undefined) ? { statsCheckedAt: record.campaignStatsCheckedAt || record.provenance.fetchedAt } : {}),
    } : {}),
    ...(record.category === 'hajj' && record.hajjOffer && verifiedHajjPartner ? {
      name: record.title, agency: verifiedHajjPartner.name, partnerId: verifiedHajjPartner.id,
      agencyContactVerified: true, sourceUrl: record.provenance.url,
      city: record.hajjOffer.agencyCity, departure: record.hajjOffer.dates,
      departCities: [record.hajjOffer.departureCity], price: record.hajjOffer.price,
      duration: record.hajjOffer.duration, dates: record.hajjOffer.dates,
      type: record.hajjOffer.type, includes: record.hajjOffer.includes,
      excludes: record.hajjOffer.excludes || [], airline: record.hajjOffer.airline,
      hotelMakkah: record.hajjOffer.hotelMakkah, hotelMadinah: record.hajjOffer.hotelMadinah,
      description: record.hajjOffer.description,
    } : {}) };
  const metadata = { subType: itemSubtype || record.category, raw, agentRecord: record, agentIdentity: identity, autoPublished: status === 'approved', confidence: assessment.confidence, publicationReasons: assessment.reasons, requiresEnrichment: status !== 'approved', publishedAt: status === 'approved' ? new Date().toISOString() : null };
  if (duplicate) {
    const sameAgentRecord = duplicate.metadata?.agentIdentity === identity;
    if (sameAgentRecord && assessment.decision === 'automatic' && duplicate.status === 'pending') {
      const resumed = await sql`WITH prior AS (
          SELECT * FROM items WHERE id=${duplicate.id}::uuid AND status='pending' FOR UPDATE
        ), changed AS (
          UPDATE items SET status='approved',title=${record.title},description=${record.description},city=${record.city},department=${record.department},date_start=${record.date || null}::timestamptz,source_url=${record.provenance.url},tags=${record.tags},metadata=prior.metadata || ${JSON.stringify(metadata)}::jsonb,last_verified_at=now(),next_review_at=now()+interval '30 days',updated_at=now()
          FROM prior WHERE items.id=prior.id RETURNING items.*
        ), logged AS (
          INSERT INTO agent_item_history(item_id,action,actor,before_snapshot,after_snapshot,reasons)
          SELECT changed.id,'auto_republished','agent:publication',to_jsonb(prior),to_jsonb(changed),${JSON.stringify(assessment.reasons)}::jsonb FROM changed JOIN prior ON prior.id=changed.id
        ) SELECT id FROM changed`;
      if (resumed[0]?.id) return { id: String(resumed[0].id), duplicate: false, published: true, updated: true };
    }
    return { id: String(duplicate.id), duplicate: true, published: false };
  }
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
  const status = report.errors.length || report.published === 0 ? 'attention' : 'complete';
  await client()`UPDATE agent_runs SET status=${status},report=${JSON.stringify(report)}::jsonb,completed_at=now() WHERE id=${report.id}::uuid`;
}
export async function claimRun(key: string) {
  const rows = await client()`INSERT INTO agent_runs(run_key) VALUES (${key}) ON CONFLICT DO NOTHING RETURNING id`;
  return rows[0]?.id ? String(rows[0].id) : null;
}
export async function existingRun(key: string) {
  const [run] = await client()`SELECT status FROM agent_runs WHERE run_key=${key}`;
  return run?.status || 'unknown';
}
export async function lastDiscoveryCursor(): Promise<number | undefined> {
  const [row] = await client()`SELECT report->'cursor' AS cursor FROM agent_runs WHERE report->'cursor'->>'next' IS NOT NULL ORDER BY completed_at DESC NULLS LAST LIMIT 1`;
  const next = Number(row?.cursor?.next);
  return Number.isInteger(next) && next >= 0 ? next : undefined;
}
