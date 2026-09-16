import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try { return NextResponse.json({ reports: await db.select().from(reports).orderBy(desc(reports.createdAt)) }); }
  catch { return NextResponse.json({ reports: [] }); }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !['open', 'resolved', 'archived'].includes(status)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
  try { await db.update(reports).set({ status, updatedAt: new Date() }).where(eq(reports.id, id)); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }); }
}
