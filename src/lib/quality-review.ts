import { and, eq, isNull, lte, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';
import { candidateLinks, candidatePhones, duplicateReasons } from './data-quality';
import { checkPublicLink } from './check-public-link';

export async function recordAutomationError(stage: string, code: string, itemId: string | null = null) {
  // Controlled codes only: never store credentials, raw API errors or personal data.
  try { await db.execute(sql`INSERT INTO automation_errors(stage, code, item_id) VALUES (${stage}, ${code}, ${itemId}::uuid)`); }
  catch { console.error('[automation-journal] persistence unavailable', stage, code); }
}

export async function reviewDueItems() {
  const now = new Date();
  const due = await db.select().from(items).where(and(
    or(eq(items.status, 'approved'), eq(items.status, 'pending')),
    or(isNull(items.nextReviewAt), lte(items.nextReviewAt, now)),
  )).orderBy(sql`${items.nextReviewAt} ASC NULLS FIRST`, items.id).limit(5);
  const summary = { checked: 0, flagged: 0 };
  for (const item of due) {
    try {
      const candidates = await db.select().from(items).where(and(eq(items.category, item.category), sql`${items.id} <> ${item.id}`));
      const duplicates = candidates.map(other => ({ id: other.id, reasons: duplicateReasons(item, other) })).filter(d => d.reasons.length > 0).slice(0,20);
      const raw = (item.metadata?.raw ?? item.metadata ?? {}) as Record<string, unknown>;
      const rawPhones = [raw.phone, raw.telephone, raw.tel, raw.mobile, raw.whatsapp].filter(Boolean);
      const invalidPhone = rawPhones.length > 0 && candidatePhones(item).length === 0;
      const links = candidateLinks(item);
      const linkChecks = Object.fromEntries(await Promise.all(links.map(async link => [link, await checkPublicLink(link)])));
      const link = links.length === 0 ? 'missing' : Object.values(linkChecks).every(value => value === 'reachable') ? 'reachable' : Object.values(linkChecks).some(value => value === 'broken') ? 'broken' : 'unavailable';
      const flagged = invalidPhone || duplicates.length > 0 || link !== 'reachable';
      const interval = flagged ? 1 : ['event','solidarity'].includes(item.category) ? 7 : 30;
      await db.update(items).set({
        metadata: sql`coalesce(${items.metadata}, '{}'::jsonb) || ${JSON.stringify({ quality: { checkedAt: now.toISOString(), link, links: linkChecks, invalidPhone, duplicates } })}::jsonb`,
        nextReviewAt: new Date(now.getTime() + interval * 86400000),
        // Automatic technical checks never certify the truth of the listing.
      }).where(eq(items.id, item.id));
      if (flagged) { summary.flagged++; await recordAutomationError('quality', 'review_required', item.id); }
      summary.checked++;
    } catch { await recordAutomationError('quality', 'item_check_failed', item.id); }
  }
  return summary;
}
