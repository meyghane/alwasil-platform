// GET /api/auto/cleanup
// Marque comme expirés les événements approuvés dont la date est passée.
// Appelé par Vercel Cron chaque nuit à 3h (voir vercel.json).

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { and, eq, lt } from 'drizzle-orm';
import { db } from '@/db';
import { formSubmissions, items } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = req.headers.get('authorization');
  const isCron = !!cronSecret && authorization === `Bearer ${cronSecret}`;
  if (!isCron && !(await isAdminLoggedIn())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const now = new Date();

  const formRetentionCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const deletedFormSubmissions = await db.delete(formSubmissions).where(lt(formSubmissions.createdAt, formRetentionCutoff)).returning({ id: formSubmissions.id });

  const expired = await db
    .update(items)
    .set({ status: 'expired', updatedAt: now })
    .where(and(eq(items.category, 'event'), eq(items.status, 'approved'), lt(items.dateStart, now)))
    .returning({ id: items.id });

  if (expired.length > 0) {
    revalidatePath('/events');
    revalidatePath('/');
  }

  return NextResponse.json({ ok: true, today: now.toISOString().split('T')[0], expired: expired.length, deletedFormSubmissions: deletedFormSubmissions.length });
}
