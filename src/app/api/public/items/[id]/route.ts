import { db } from '@/db';
import { items } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getRaw, getHajjPackages } from '@/lib/db-queries';
import { publicationIssues } from '@/lib/publication';
import { getPublicPools } from '@/lib/public-places';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: 'Introuvable' }, { status: 404 });
  try {
    const [item] = await db.select().from(items).where(and(eq(items.id, id), eq(items.status, 'approved'), eq(items.isSpam, false))).limit(1);
    if (!item || publicationIssues(item).length) return Response.json({ error: 'Introuvable' }, { status: 404 });
    const rows = item.category === 'hajj' ? await getHajjPackages(true) : item.category === 'pool' ? await getPublicPools(true) : await getRaw<{ id: string }>(item.category, String(item.metadata?.subType || ''), true);
    if (!rows.some(row => row.id === id)) return Response.json({ error: 'Introuvable' }, { status: 404 });
    const subType = String(item.metadata?.subType || '');
    const categoryPath = item.category === 'event' ? '/events' : item.category === 'institute'
      ? (subType === 'mosquee' ? '/lieux-priere' : '/education')
      : item.category === 'library' ? '/librairies' : item.category === 'solidarity' ? '/solidarity'
      : item.category === 'pool' ? '/piscines' : item.category === 'hajj' ? '/hajj' : item.category === 'justice' ? '/justice' : '';
    const publicCategoryPath = item.category === 'health' ? '/sante' : categoryPath;
    return Response.json({ id: item.id, title: item.title, categoryPath: publicCategoryPath }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Indisponible' }, { status: 503 }); }
}
