// GET /api/evenements
// Retourne les événements futurs depuis Google Sheets
// Cache Next.js 1h

import { getEvenementsAVenir } from '@/lib/sheets';
import { NextRequest } from 'next/server';

export const revalidate = 3600; // cache 1h

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dept = searchParams.get('dept');
  const categorie = searchParams.get('categorie');
  const includePast = searchParams.get('past') === 'true';

  try {
    let events = await getEvenementsAVenir();

    if (dept && dept !== 'Tout') {
      events = events.filter(e => e.departement === dept);
    }
    if (categorie && categorie !== 'all') {
      events = events.filter(e => e.categorie === categorie);
    }

    return Response.json({
      count: events.length,
      data: events,
    });
  } catch (e) {
    return Response.json({ error: 'Erreur chargement événements' }, { status: 500 });
  }
}
