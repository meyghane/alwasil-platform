// POST /api/revalidate
// Appelé par Make.com quand un événement passe "en ligne" dans le Sheet
// → invalide le cache Next.js → les nouvelles cartes apparaissent immédiatement
//
// Header requis: x-revalidate-secret: <REVALIDATE_SECRET>
// Ajoute REVALIDATE_SECRET dans .env.local + Vercel Environment Variables

import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
 const secret = req.headers.get('x-revalidate-secret');
 const cronAuthorization = req.headers.get('authorization');

 const authorizedByRevalidateSecret = Boolean(process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET);
 const authorizedByCronSecret = Boolean(process.env.CRON_SECRET && cronAuthorization === `Bearer ${process.env.CRON_SECRET}`);
 if (!authorizedByRevalidateSecret && !authorizedByCronSecret) {
 return Response.json({ error: 'Unauthorized' }, { status: 401 });
 }

 const body = await req.json().catch(() => ({}));
 const paths = (body.paths as string[]) ?? ['/events', '/'];

 const allowedPath = (path: string) => /^\/(?:$|api\/[a-z0-9/_-]+|[a-z0-9/_-]+)$/.test(path) && !path.includes('..');
 if (!Array.isArray(paths) || paths.some(path => typeof path !== 'string' || !allowedPath(path))) {
 return Response.json({ error: 'Invalid paths' }, { status: 400 });
 }

 for (const path of paths) {
 revalidatePath(path);
 }

 return Response.json({
 revalidated: true,
 paths,
 timestamp: new Date().toISOString(),
 });
}
