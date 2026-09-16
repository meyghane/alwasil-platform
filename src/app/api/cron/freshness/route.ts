import { NextRequest, NextResponse } from 'next/server';
import { and, eq, lt, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { recordAutomationError, reviewDueItems } from '@/lib/quality-review';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!expected || provided !== expected) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
  const now = new Date();
  const expired = await db.update(items).set({ status: 'expired', updatedAt: now }).where(and(eq(items.category, 'event'), eq(items.status, 'approved'), sql`coalesce(${items.dateEnd}, ${items.dateStart} + interval '1 day') < ${now}`)).returning({ id: items.id });
  const quality = await reviewDueItems();
  const reviewDue = await db.select({ id: items.id, category: items.category }).from(items).where(and(eq(items.status, 'approved'), isNotNull(items.nextReviewAt), lt(items.nextReviewAt, now)));
  return NextResponse.json({ ok: true, expiredEvents: expired.length, reviewDue: reviewDue.length, quality, ranAt: now.toISOString() });
  } catch {
    await recordAutomationError('freshness', 'run_failed');
    return NextResponse.json({ error: 'Contrôle indisponible : consulter le journal.' }, { status: 503 });
  }
}
