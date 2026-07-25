// Écriture directe en base Postgres (Neon) — remplace utils/sheets.ts (Apps Script/Google Sheets)
import { eq, and, gte } from 'drizzle-orm';
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
    console.error('[db] Insert error:', e);
    return null;
  }
}
