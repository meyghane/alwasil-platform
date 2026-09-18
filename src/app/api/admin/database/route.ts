import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import { items, moderationLog } from '@/db/schema';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { withoutEmDashes } from '@/lib/typography';

export async function GET(req: NextRequest) {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const query = req.nextUrl.searchParams.get('q')?.trim().slice(0, 120);
  const category = req.nextUrl.searchParams.get('category');
  const status = req.nextUrl.searchParams.get('status');
  const conditions = [];
  if (query) conditions.push(or(ilike(items.title, `%${query}%`), ilike(items.city, `%${query}%`), ilike(items.source, `%${query}%`)));
  if (category) conditions.push(eq(items.category, category as typeof items.category.enumValues[number]));
  if (status) conditions.push(eq(items.status, status as typeof items.status.enumValues[number]));
  try {
    const rows = await db.select().from(items).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(items.updatedAt)).limit(200);
    const history = await db.select().from(moderationLog).orderBy(desc(moderationLog.actedAt)).limit(500);
    return NextResponse.json({ items: withoutEmDashes(rows), history: withoutEmDashes(history) });
  } catch { return NextResponse.json({ error: 'Base indisponible' }, { status: 503 }); }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  let body: { id?: string; action?: string; edits?: Record<string, unknown> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  const id = body.id;
  const action = body.action;
  if (!id || !['archive', 'delete', 'reverify', 'edit'].includes(action || '')) return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  try {
    const [item] = await db.select({ id: items.id, status: items.status }).from(items).where(eq(items.id, id)).limit(1);
    if (!item) return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    const actor = 'admin';
    if (action === 'edit') {
      const edits = body.edits ?? {};
      const title = typeof edits.title === 'string' ? withoutEmDashes(edits.title.trim().slice(0, 240)) : undefined;
      const description = typeof edits.description === 'string' ? withoutEmDashes(edits.description.trim().slice(0, 4000)) : undefined;
      const city = typeof edits.city === 'string' ? withoutEmDashes(edits.city.trim().slice(0, 120)) : undefined;
      const sourceUrl = typeof edits.sourceUrl === 'string' ? edits.sourceUrl.trim().slice(0, 1000) : undefined;
      if (!title) return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 });
      if (sourceUrl && !/^https:\/\/[^\s]+$/i.test(sourceUrl)) return NextResponse.json({ error: 'Lien HTTPS invalide' }, { status: 400 });
      await db.update(items).set({ title, description, city, sourceUrl: sourceUrl || null, updatedAt: new Date() }).where(eq(items.id, id));
      await db.insert(moderationLog).values({ itemId: id, action: 'edited', actor });
    } else if (action === 'delete') {
      await db.insert(moderationLog).values({ itemId: id, action: 'deleted', actor });
      // Suppression logique : la fiche disparaît du site, mais l'historique reste intact.
      await db.update(items).set({ status: 'expired', updatedAt: new Date(), metadata: { deleted: true, deletedAt: new Date().toISOString() } }).where(eq(items.id, id));
    } else if (action === 'archive') {
      await db.update(items).set({ status: 'expired', updatedAt: new Date(), metadata: { archived: true } }).where(eq(items.id, id));
      await db.insert(moderationLog).values({ itemId: id, action: 'archived', actor });
    } else {
      await db.update(items).set({ nextReviewAt: new Date(), updatedAt: new Date() }).where(eq(items.id, id));
      await db.insert(moderationLog).values({ itemId: id, action: 'reverification_requested', actor });
    }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Action impossible' }, { status: 500 }); }
}
