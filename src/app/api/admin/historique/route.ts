import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { items, moderationLog } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const rows = await db.select({ log: moderationLog, title: items.title, category: items.category, currentStatus: items.status }).from(moderationLog).leftJoin(items, eq(items.id, moderationLog.itemId)).orderBy(desc(moderationLog.actedAt)).limit(500);
  return NextResponse.json({ history: rows.map(row => ({ ...row.log, title: row.title, category: row.category, currentStatus: row.currentStatus })) });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await req.json().catch(() => ({})) as { logId?: string };
  if (!body.logId) return NextResponse.json({ error: 'Journal introuvable' }, { status: 400 });
  const [entry] = await db.select().from(moderationLog).where(eq(moderationLog.id, body.logId)).limit(1);
  if (!entry?.previousStatus) return NextResponse.json({ error: 'Cette ancienne action ne peut pas encore être annulée.' }, { status: 400 });
  const [current] = await db.select({ id: items.id, status: items.status }).from(items).where(eq(items.id, entry.itemId)).limit(1);
  if (!current || current.status === entry.previousStatus) return NextResponse.json({ error: 'La fiche est déjà dans son ancien statut.' }, { status: 409 });
  await db.update(items).set({ status: entry.previousStatus as 'pending' | 'approved' | 'rejected' | 'expired', updatedAt: new Date() }).where(eq(items.id, entry.itemId));
  await db.insert(moderationLog).values({ itemId: entry.itemId, action: 'edited', previousStatus: current.status, newStatus: entry.previousStatus, actor: 'admin:annulation' });
  return NextResponse.json({ ok: true });
}
