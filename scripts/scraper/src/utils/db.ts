// Écriture directe en base Postgres (Neon) — remplace utils/sheets.ts (Apps Script/Google Sheets)
import { eq, and, gte, sql } from 'drizzle-orm';
import { db } from '../db';
import { items } from '../db/schema';

export async function checkAlreadyRanToday(): Promise<boolean> {
  if (process.env.FORCE_RUN === 'true') return false;

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const rows = await db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.source, 'gemini-scraper'), gte(items.createdAt, startOfToday)))
    .limit(1);

  const ranToday = rows.length > 0;
  if (ranToday) console.log(`[db] Already ran today, skipping.`);
  return ranToday;
}

export async function getExistingEventTitles(): Promise<Set<string>> {
  const rows = await db
    .select({ title: items.title })
    .from(items)
    .where(eq(items.category, 'event'));
  return new Set(rows.map((r) => r.title.toLowerCase()));
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
