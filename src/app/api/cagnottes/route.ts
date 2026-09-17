import { NextRequest } from 'next/server';
import { getCagnottes } from '@/lib/db-queries';
import { toLegacyCagnotte } from '@/lib/public-api-adapters';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === 'true';
  const dept = req.nextUrl.searchParams.get('dept');
  const category = req.nextUrl.searchParams.get('categorie');
  try {
    const data = (await getCagnottes())
      .map(toLegacyCagnotte)
      .filter(cagnotte => all || cagnotte.is_active)
      .filter(cagnotte => !dept || dept === 'Tout' || cagnotte.departement === dept)
      .filter(cagnotte => !category || cagnotte.categorie === category);
    return Response.json({ count: data.length, data });
  } catch {
    return Response.json({ error: 'Erreur chargement cagnottes' }, { status: 503 });
  }
}
