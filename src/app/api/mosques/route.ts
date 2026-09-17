// GET /api/mosques
// Retourne toutes les mosquées ou filtre par dept/cours
// Cache Next.js 1h, revalidation automatique

import { getMosquees, type Mosquee } from '@/lib/sheets';
import { db } from '@/db';
import { items } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { normalizeText } from '@/lib/data-quality';
import { NextRequest } from 'next/server';

export const revalidate = 3600; // cache 1h

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const coursesOnly = searchParams.get('courses') === 'true';
 const dept = searchParams.get('dept');
 const territoire = searchParams.get('territoire');

 try {
 const legacy = await getMosquees();
 const approved = await db.select({ id: items.id, metadata: items.metadata, title: items.title, city: items.city, department: items.department })
   .from(items).where(and(eq(items.category, 'institute'), eq(items.status, 'approved')));
 const fromNeon: Mosquee[] = approved.filter(row => {
   const raw = row.metadata?.raw as Record<string, unknown> | undefined;
   return raw?.type === 'mosquee';
 }).map(row => {
   const raw = (row.metadata?.raw || {}) as Record<string, unknown>;
   const courses = Array.isArray(raw.courses) ? raw.courses.filter((item): item is string => typeof item === 'string') : [];
   const audience = Array.isArray(raw.audience) ? raw.audience.filter((item): item is string => typeof item === 'string') : [];
   return {
     id_osm: row.id, nom: String(raw.name || row.title), adresse: String(raw.address || ''), ville: row.city || '',
     code_postal: String(raw.postalCode || ''), departement: row.department || '', territoire: String(raw.territoire || ''),
     latitude: 0, longitude: 0, website: String(raw.website || ''), telephone: String(raw.phone || ''),
     horaires: String(raw.horaires || ''), instagram: '', facebook: '', has_courses: courses.length > 0,
     cours_types: courses, cours_audience: audience, cours_format: 'presentiel',
     cours_description: String(raw.description || ''), cours_verified: raw.verified === true,
   };
 });
 const seen = new Set(fromNeon.map(row => `${normalizeText(row.nom)}:${normalizeText(row.ville)}`));
 let mosques = [...fromNeon, ...legacy.filter(row => !seen.has(`${normalizeText(row.nom)}:${normalizeText(row.ville)}`))];
 if (coursesOnly) mosques = mosques.filter(m => m.has_courses);

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
