import { NextResponse } from 'next/server';
import { desc, sql } from 'drizzle-orm';
import { db } from '@/db';
import { audienceEvents } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const [pages, slots, recent] = await Promise.all([
    db.select({ path: audienceEvents.path, views: sql<number>`count(*)` }).from(audienceEvents).groupBy(audienceEvents.path).orderBy(desc(sql`count(*)`)).limit(30),
    db.select({ slot: audienceEvents.slot, views: sql<number>`count(*)` }).from(audienceEvents).where(sql`${audienceEvents.slot} is not null`).groupBy(audienceEvents.slot).orderBy(desc(sql`count(*)`)).limit(30),
    db.select({ createdAt: audienceEvents.createdAt, path: audienceEvents.path, eventType: audienceEvents.eventType }).from(audienceEvents).orderBy(desc(audienceEvents.createdAt)).limit(20),
  ]);
  return NextResponse.json({ pages, slots, recent });
}
