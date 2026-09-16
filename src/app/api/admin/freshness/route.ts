import { NextRequest, NextResponse } from 'next/server';
import { and, eq, isNull, lte, or, sql } from 'drizzle-orm';
import { db } from '@/db'; import { items } from '@/db/schema'; import { isAdminLoggedIn } from '@/lib/admin-auth';
export async function GET() {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 try {
 const due = await db.select({ id: items.id, title: items.title, category: items.category, nextReviewAt: items.nextReviewAt, lastVerifiedAt: items.lastVerifiedAt, source: items.source, metadata: items.metadata }).from(items).where(and(or(eq(items.status, 'approved'), eq(items.status, 'pending')), or(isNull(items.nextReviewAt), lte(items.nextReviewAt, new Date()), sql`${items.metadata}->'quality'->>'invalidPhone' = 'true'`, sql`${items.metadata}->'quality'->>'link' <> 'reachable'`, sql`jsonb_array_length(coalesce(${items.metadata}->'quality'->'duplicates', '[]'::jsonb)) > 0`))).limit(500);
 return NextResponse.json({ due });
 } catch { return NextResponse.json({ error: 'Impossible de charger les fiches.' }, { status: 503 }); }
}

export async function PATCH(req: NextRequest) {
 if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 const body = await req.json() as { id?: string; action?: 'verify'|'dismiss-duplicates'|'reject' };
 if (!body.id || !body.action) return NextResponse.json({ error: 'Requête incomplète' }, { status: 400 });
 const [item] = await db.select({ id: items.id, metadata: items.metadata }).from(items).where(eq(items.id, body.id)).limit(1);
 if (!item) return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
 const now = new Date();
 if (body.action === 'verify') {
  await db.update(items).set({ lastVerifiedAt: now, nextReviewAt: new Date(now.getTime() + 30 * 86400000), updatedAt: now }).where(eq(items.id, body.id));
 } else if (body.action === 'reject') {
  await db.update(items).set({ status: 'rejected', updatedAt: now }).where(eq(items.id, body.id));
 } else {
  const metadata = item.metadata ?? {};
  const quality = (metadata.quality ?? {}) as Record<string, unknown>;
  await db.update(items).set({ metadata: { ...metadata, quality: { ...quality, duplicates: [], duplicateResolution: 'dismissed', resolvedAt: now.toISOString() } }, updatedAt: now }).where(eq(items.id, body.id));
 }
 return NextResponse.json({ ok: true, id: body.id, action: body.action });
}
