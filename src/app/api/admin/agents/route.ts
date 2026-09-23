import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { adminActionAllowed } from '@/lib/agents/security';
import { assessRecord, correctiveState, mergeComplementary, duplicateEvidence } from '@/lib/agents/policy';
import { AUTO_CATEGORIES, type RecordData, type Source } from '@/lib/agents/contracts';
import { rollbackInvisible } from '@/lib/agents/store';

const refresh = () => { for (const path of ['/', '/education', '/lieux-priere', '/api/mosques', '/events', '/solidarity', '/piscines', '/librairies']) revalidatePath(path); };
export async function GET() {
  if (!await isAdminLoggedIn()) return Response.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const [runs,sources,records,deliveries] = await Promise.all([
      sql`SELECT id,status,report,started_at FROM agent_runs ORDER BY started_at DESC LIMIT 15`,
      sql`SELECT * FROM agent_sources ORDER BY updated_at DESC`,
      sql`SELECT id,title,status,updated_at,metadata->>'confidence' AS confidence,metadata->'publicationReasons' AS reasons,metadata->>'autoPublished' AS automatic,source_url FROM items WHERE metadata ? 'agentRecord' ORDER BY updated_at DESC LIMIT 100`,
      sql`SELECT notification_type,result,created_at,completed_at FROM telegram_deliveries WHERE result<>'sent' ORDER BY created_at DESC LIMIT 20`,
    ]);
    return Response.json({ runs,sources,records,deliveries });
  } catch { return Response.json({ error: 'Journal des agents indisponible.' }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!await isAdminLoggedIn()) return Response.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const action = String(body.action || '');
    if (!adminActionAllowed(true, action)) return Response.json({ error: 'Action invalide' }, { status: 400 });
    const sql = neon(process.env.DATABASE_URL!);
    if (action === 'source') {
      const url = new URL(String(body.url));
      const category = String(body.category);
      const trust = String(body.trust || 'pending');
      const evidence = String(body.evidence || '').trim();
      if (url.protocol !== 'https:' || url.username || url.password || !['pending','trusted','blocked'].includes(trust) || !(AUTO_CATEGORIES as readonly string[]).includes(category) || (trust === 'trusted' && evidence.length < 30)) return Response.json({ error: 'Source invalide ou preuve officielle insuffisante.' }, { status: 422 });
      const departments = Array.isArray(body.departments) ? body.departments.map(String).filter(d => /^(?:\d{2,3}|2A|2B)$/.test(d)) : [];
      if (!departments.length) return Response.json({ error: 'Départements requis.' }, { status: 422 });
      await sql`WITH prior AS (SELECT * FROM agent_sources WHERE url=${url.href}), changed AS (
        INSERT INTO agent_sources(url,category,departments,trust,official,evidence) VALUES (${url.href},${category},${departments},${trust},${trust === 'trusted'},${evidence})
        ON CONFLICT(url) DO UPDATE SET trust=excluded.trust,official=excluded.official,evidence=excluded.evidence,category=excluded.category,departments=excluded.departments,updated_at=now() RETURNING *
      ) INSERT INTO agent_source_history(source_id,actor,before_snapshot,after_snapshot)
        SELECT changed.id,'admin',to_jsonb(prior),to_jsonb(changed) FROM changed LEFT JOIN prior ON changed.id=prior.id`;
      return Response.json({ ok: true });
    }
    const id = String(body.id || '');
    if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: 'Identifiant invalide' }, { status: 400 });
    const [item] = await sql`SELECT * FROM items WHERE id=${id}::uuid`;
    if (!item || !item.metadata?.agentRecord) return Response.json({ error: 'Fiche agent introuvable' }, { status: 404 });
    if (String(body.updatedAt || '') !== new Date(item.updated_at).toISOString()) return Response.json({ error: 'La fiche a changé. Recharge la liste.' }, { status: 409 });
    const record = item.metadata.agentRecord as RecordData;
    const [source] = await sql`SELECT * FROM agent_sources WHERE id=${record.provenance.sourceId}::uuid`;
    const eligible = source ? assessRecord(record, source as Source).decision === 'automatic' : false;
    let status: string; let metadata = item.metadata;
    if (action === 'merge') {
      const otherId = String(body.otherId || '');
      if (!/^[0-9a-f-]{36}$/i.test(otherId) || otherId === id) return Response.json({ error: 'Deux fiches distinctes requises.' }, { status: 422 });
      const [other] = await sql`SELECT * FROM items WHERE id=${otherId}::uuid`;
      const incoming = other?.metadata?.agentRecord as RecordData | undefined;
      if (!incoming || !duplicateEvidence(record,incoming).length) return Response.json({ error: 'Correspondance non démontrée.' }, { status: 422 });
      const merged = mergeComplementary(record,incoming);
      if (merged.conflicts.length) return Response.json({ error: 'Contradictions à corriger avant fusion.', conflicts: merged.conflicts }, { status: 422 });
      metadata = { ...metadata, agentRecord: merged.merged, raw: { ...metadata.raw, ...merged.merged }, autoPublished: false, mergedFrom: otherId };
      // Both records and their snapshots change atomically.
      const changed = await sql`WITH prior AS (SELECT * FROM items WHERE (id=${id}::uuid AND updated_at=${new Date(item.updated_at).toISOString()}::timestamptz) OR (id=${otherId}::uuid AND updated_at=${new Date(other.updated_at).toISOString()}::timestamptz) FOR UPDATE), changed AS (
        UPDATE items SET status=CASE WHEN items.id=${id}::uuid THEN 'pending'::status ELSE 'expired'::status END,
          metadata=CASE WHEN items.id=${id}::uuid THEN ${JSON.stringify(metadata)}::jsonb ELSE items.metadata END,updated_at=now()
        FROM prior WHERE items.id=prior.id AND (SELECT count(*) FROM prior)=2 RETURNING items.*
      ) INSERT INTO agent_item_history(item_id,action,actor,before_snapshot,after_snapshot)
        SELECT changed.id,'merge','admin',to_jsonb(prior),to_jsonb(changed) FROM changed JOIN prior USING(id) RETURNING item_id`;
      refresh(); return Response.json({ ok: changed.length === 2 }, { status: changed.length === 2 ? 200 : 409 });
    }
    if (action === 'rollback') {
      const [history] = await sql`SELECT before_snapshot FROM agent_item_history WHERE item_id=${id}::uuid AND rollback_until>=now() ORDER BY created_at DESC LIMIT 1`;
      if (!history) return Response.json({ error: 'Fenêtre de retour arrière expirée ; archiver ou revérifier la fiche.' }, { status: 422 });
      status = correctiveState(action,item.status,eligible,history.before_snapshot?.status || 'pending');
      metadata = history.before_snapshot?.metadata || { ...metadata,autoPublished:false };
    } else status = correctiveState(action,item.status,eligible);
    if (status === 'approved') {
      const restoredRecord = metadata.agentRecord as RecordData;
      if (!source || assessRecord(restoredRecord, source as Source).decision !== 'automatic') status = 'pending';
      else metadata = { ...metadata, requiresEnrichment: false };
    }
    const changed = await sql`WITH prior AS (SELECT * FROM items WHERE id=${id}::uuid AND updated_at=${new Date(item.updated_at).toISOString()}::timestamptz FOR UPDATE), changed AS (
      UPDATE items SET status=${status}::status,metadata=${JSON.stringify(metadata)}::jsonb,updated_at=now() FROM prior WHERE items.id=prior.id RETURNING items.*
    ) INSERT INTO agent_item_history(item_id,action,actor,before_snapshot,after_snapshot)
      SELECT changed.id,${action},'admin',to_jsonb(prior),to_jsonb(changed) FROM changed JOIN prior USING(id) RETURNING item_id`;
    refresh(); revalidatePath(`/api/public/items/${id}`);
    if (changed.length && status === 'approved') {
      let visible = false;
      try {
        const response = await fetch(`https://al-wasil.fr/api/public/items/${id}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
        visible = response.ok && (await response.json()).id === id;
      } catch { /* A failed check is never a publication confirmation. */ }
      if (!visible) {
        await rollbackInvisible(id); refresh(); revalidatePath(`/api/public/items/${id}`);
        return Response.json({ ok: false, status: 'pending', error: 'Publication échouée : visibilité non confirmée. Fiche remise en attente.' }, { status: 502 });
      }
    }
    return Response.json({ ok: changed.length === 1, status }, { status: changed.length ? 200 : 409 });
  } catch { return Response.json({ error: 'Action impossible. Vérifier les données et le journal.' }, { status: 503 }); }
}
