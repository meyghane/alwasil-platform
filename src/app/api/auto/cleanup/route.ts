// GET /api/auto/cleanup
// Marque comme expirés les événements approuvés dont la date est passée.
// Appelé par Vercel Cron chaque nuit à 3h (voir vercel.json).

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { and, eq, lt } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';

export async function GET(_req: NextRequest) {
  const now = new Date();

  const expired = await db
    .update(items)
    .set({ status: 'expired', updatedAt: now })
    .where(and(eq(items.category, 'event'), eq(items.status, 'approved'), lt(items.dateStart, now)))
    .returning({ id: items.id });

  if (expired.length > 0) {
    revalidatePath('/events');
    revalidatePath('/');
  }

  return NextResponse.json({ ok: true, today: now.toISOString().split('T')[0], expired: expired.length });
}
