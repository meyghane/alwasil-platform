import { getCagnottesActives, getCagnottes } from '@/lib/sheets';
import { NextRequest } from 'next/server';

export const revalidate = 3600; // cache 1h

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const all = searchParams.get('all') === 'true'; // inclure terminées
 const dept = searchParams.get('dept');
 const categorie = searchParams.get('categorie');

 try {
 let cagnottes = all ? await getCagnottes() : await getCagnottesActives();

 if (dept && dept !== 'Tout') {
 cagnottes = cagnottes.filter(c => c.departement === dept);
 }
 if (categorie) {
 cagnottes = cagnottes.filter(c => c.categorie === categorie);
 }

 return Response.json({ count: cagnottes.length, data: cagnottes });
 } catch (e) {
 console.error('[api/cagnottes]', e);
 return Response.json({ error: 'Erreur chargement cagnottes' }, { status: 500 });
 }
}
