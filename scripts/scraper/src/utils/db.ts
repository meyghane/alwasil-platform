// Écriture directe en base Postgres (Neon) — remplace utils/sheets.ts (Apps Script/Google Sheets)
import { randomUUID } from 'node:crypto';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db';
import { items } from '../db/schema';

export async function getExistingEventKeys(): Promise<Set<string>> {
  const rows = await db
    .select({ title: items.title, city: items.city, dateStart: items.dateStart })
    .from(items)
    .where(eq(items.category, 'event'));
  return new Set(rows.map((r) => `${r.title.trim().toLowerCase()}|${(r.city || '').trim().toLowerCase()}|${r.dateStart?.toISOString().slice(0, 10) || ''}`));
}

export async function getDepartmentCounts(): Promise<Record<string, number>> {
  const result = await db.execute(sql`SELECT department, count(*)::int AS total FROM items WHERE category = 'event' AND status IN ('pending','approved') AND date_start >= now() AND department IS NOT NULL GROUP BY department`);
  return Object.fromEntries(result.rows.map(row => [String(row.department), Number(row.total)]));
}

export async function getExistingCagnotteUrls(): Promise<Set<string>> {
  const rows = await db.select({ sourceUrl: items.sourceUrl }).from(items).where(eq(items.category, 'solidarity'));
  return new Set(rows.flatMap(row => {
    if (!row.sourceUrl) return [];
    try { const url = new URL(row.sourceUrl); return [`${url.origin}${url.pathname.replace(/\/$/, '')}`]; }
    catch { return []; }
  }));
}

export type NewCagnotteRow = { title: string; organizer: string; category: string; country: string; description: string; sourceUrl: string };
const CAGNOTTE_CATEGORIES = new Set(['palestine', 'afrique', 'mosquee', 'famille', 'education', 'eau-puits', 'orphelins', 'urgence']);

export async function insertCagnotte(row: NewCagnotteRow): Promise<string | null> {
  const previous = await db.select({ id: items.id }).from(items).where(and(eq(items.category, 'solidarity'), eq(items.sourceUrl, row.sourceUrl))).limit(1);
  if (previous.length) return null;
  const category = CAGNOTTE_CATEGORIES.has(row.category) ? row.category : 'urgence';
  const platform = new URL(row.sourceUrl).hostname.includes('helloasso') ? 'helloasso' : 'launchgood';
  const [inserted] = await db.insert(items).values({
    category: 'solidarity', status: 'pending', title: row.title, description: row.description,
    source: 'gemini-scraper', sourceUrl: row.sourceUrl, tags: [category], isSpam: false,
    metadata: { subType: 'cagnotte', raw: {
      id: `scraped-${randomUUID()}`, title: row.title, organizer: row.organizer,
      platform, url: row.sourceUrl, description: row.description, category,
      currency: 'EUR', imageKeyword: 'solidarité', country: row.country,
      verified: false,
    } },
  }).returning({ id: items.id });
  return inserted?.id ?? null;
}

export type CategoryUsage = { modelCalls: number; tokensUsed: number; itemsFound: number; itemsInserted: number; quotaErrors: number };

export async function getTodayUsage(category: string): Promise<CategoryUsage> {
  const result = await db.execute(sql`SELECT coalesce(sum(model_calls),0)::int AS calls, coalesce(sum(tokens_used),0)::int AS tokens, coalesce(sum(quota_errors),0)::int AS quota_errors FROM scrape_category_usage WHERE category = ${category} AND created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris'`);
  return { modelCalls: Number(result.rows[0]?.calls ?? 0), tokensUsed: Number(result.rows[0]?.tokens ?? 0), itemsFound: 0, itemsInserted: 0, quotaErrors: Number(result.rows[0]?.quota_errors ?? 0) };
}

export async function hadAnyQuotaErrorToday(): Promise<boolean> {
  const result = await db.execute(sql`SELECT EXISTS (SELECT 1 FROM scrape_category_usage WHERE quota_errors > 0 AND created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris') AS exhausted`);
  return result.rows[0]?.exhausted === true;
}

export async function saveUsage(runId: string, category: string, usage: CategoryUsage): Promise<void> {
  await db.execute(sql`INSERT INTO scrape_category_usage(run_id,category,model_calls,tokens_used,items_found,items_inserted,quota_errors) VALUES (${runId},${category},${usage.modelCalls},${usage.tokensUsed},${usage.itemsFound},${usage.itemsInserted},${usage.quotaErrors})`);
}

export type NewEventRow = {
  title: string;
  description: string;
  city: string | null;
  department: string | null;
  dateStart: Date | null;
  sourceUrl: string | null;
  tags: string[];
  raw: Record<string, unknown>;
};

export async function insertEvent(row: NewEventRow): Promise<string | null> {
  try {
    // Same title/date/city is an exact repeat; contacts alone are not unique events.
    const previous = await db.select({ id: items.id }).from(items).where(and(
      eq(items.category, 'event'),
      sql`lower(trim(${items.title})) = lower(trim(${row.title}))`,
      sql`lower(coalesce(${items.city}, '')) = lower(${row.city ?? ''})`,
      sql`${items.dateStart} IS NOT DISTINCT FROM ${row.dateStart}`,
    )).limit(1);
    if (previous.length) return null;
    const [inserted] = await db
      .insert(items)
      .values({
        category: 'event',
        status: 'pending',
        title: row.title,
        description: row.description,
        city: row.city,
        department: row.department,
        region: 'idf',
        dateStart: row.dateStart,
        source: 'gemini-scraper',
        sourceUrl: row.sourceUrl,
        tags: row.tags,
        isSpam: false,
        metadata: { subType: 'event', raw: row.raw },
      })
      .returning({ id: items.id });
    return inserted?.id ?? null;
  } catch (e) {
    await logAutomationError('insert_failed');
    console.error('[db] Insert error:', e);
    return null;
  }
}

export async function logAutomationError(code: string): Promise<void> {
  try { await db.execute(sql`INSERT INTO automation_errors(stage, code) VALUES ('scraper', ${code})`); }
  catch { console.error('[journal] unavailable'); }
}
