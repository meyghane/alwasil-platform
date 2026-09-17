import { NextRequest } from 'next/server';
import { getEvents } from '@/lib/db-queries';
import { toLegacyEvent } from '@/lib/public-api-adapters';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const dept = req.nextUrl.searchParams.get('dept');
  const category = req.nextUrl.searchParams.get('categorie');
  const includePast = req.nextUrl.searchParams.get('past') === 'true';
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = (await getEvents())
      .filter(event => includePast || event.date >= today)
      .filter(event => !dept || dept === 'Tout' || event.department === dept)
      .filter(event => !category || category === 'all' || event.category === category)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(toLegacyEvent);
    return Response.json({ count: data.length, data });
  } catch {
    return Response.json({ error: 'Erreur chargement événements' }, { status: 503 });
  }
}
