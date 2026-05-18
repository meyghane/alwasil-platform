// GET /api/mosques
// Retourne toutes les mosquées ou filtre par dept/cours
// Cache Next.js 1h, revalidation automatique

import { getMosquees, getMosqueesWithCourses } from '@/lib/sheets';
import { NextRequest } from 'next/server';

export const revalidate = 3600; // cache 1h

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const coursesOnly = searchParams.get('courses') === 'true';
 const dept = searchParams.get('dept');
 const territoire = searchParams.get('territoire');

 try {
 let mosques = coursesOnly
 ? await getMosqueesWithCourses()
 : await getMosquees();

 if (dept && dept !== 'Tout') {
 mosques = mosques.filter(m => m.departement === dept);
 }
 if (territoire) {
 mosques = mosques.filter(m => m.territoire === territoire);
 }

 return Response.json({
 count: mosques.length,
 data: mosques,
 });
 } catch (e) {
 return Response.json({ error: 'Erreur chargement mosquées' }, { status: 500 });
 }
}
