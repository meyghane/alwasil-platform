// GET /api/admin/soumissions → liste toutes les soumissions depuis Apps Script
// PATCH /api/admin/soumissions → met à jour le status d'une soumission

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
import { db } from '@/db';
import { items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

async function isAuthorized() {
 return (await isAdminLoggedIn()) || !!(await getUserSession());
}

// Lire depuis le Sheet "Soumissions"
export async function GET() {
 if (!(await isAuthorized())) {
 return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 }

 try {
 const automatic = await db.select().from(items).where(eq(items.status, 'pending'));
 const neonSoumissions = automatic.map((item) => ({
 id: item.id,
 categorie: item.category,
 destinationTab: 'Neon · items',
 status: 'à vérifier',
 soumis_le: item.createdAt.toISOString(),
 soumis_par: item.source,
 name: item.title,
 titre: item.title,
 ville: item.city || undefined,
 description: item.description || undefined,
 url_source: item.sourceUrl || undefined,
 source_system: 'neon',
 requires_campaign_check: item.category === 'solidarity' && item.metadata?.subType === 'cagnotte' ? 'oui' : undefined,
 }));
 let legacy: Record<string, unknown>[] = [];
 if (APPS_SCRIPT_URL) {
   try {
     const res = await fetch(`${APPS_SCRIPT_URL}?action=list`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
     if (res.ok) {
       const data = await res.json() as { soumissions?: Record<string, unknown>[] };
       legacy = (Array.isArray(data.soumissions) ? data.soumissions : []).map(item => Object.fromEntries(Object.entries(item).map(([key, value]) => [key.toLowerCase(), value])));
     }
   } catch { /* Les fiches Neon restent visibles si Sheets ne répond pas. */ }
 }
 return NextResponse.json({ soumissions: [...neonSoumissions, ...legacy], source: 'neon+legacy' });
 } catch {
 return NextResponse.json({ soumissions: [], error: 'Neon indisponible' }, { status: 503 });
 }
}

// Mettre à jour le status d'une soumission
export async function PATCH(req: NextRequest) {
 if (!(await isAuthorized())) {
 return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 }

 const { id, status, verifiedCampaign } = await req.json();

 if (!id || !status) {
 return NextResponse.json({ error: 'id et status requis' }, { status: 400 });
 }

 if (!['en ligne', 'pas en ligne', 'à vérifier', 'expiré'].includes(status)) {
 return NextResponse.json({ error: 'Status invalide' }, { status: 400 });
 }

 const neonItem = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)
   ? await db.select({ id: items.id, category: items.category, metadata: items.metadata }).from(items).where(eq(items.id, id)).limit(1)
   : [];
 if (neonItem.length > 0) {
 const campaign = neonItem[0].category === 'solidarity' && neonItem[0].metadata?.subType === 'cagnotte';
 if (campaign && status === 'en ligne' && verifiedCampaign !== true) return NextResponse.json({ error: 'Vérifiez la collecte et confirmez avant publication.' }, { status: 400 });
 const now = new Date();
 const metadata = campaign && status === 'en ligne' ? { ...neonItem[0].metadata, raw: { ...(neonItem[0].metadata?.raw as Record<string, unknown> || {}), verified: true } } : neonItem[0].metadata;
 await db.update(items).set({ status: status === 'en ligne' ? 'approved' : 'rejected', updatedAt: now, metadata, ...(status === 'en ligne' ? { lastVerifiedAt: now, nextReviewAt: new Date(now.getTime() + 30 * 86400000) } : {}) }).where(eq(items.id, id));
 revalidatePath('/');
 revalidatePath(campaign ? '/solidarity' : neonItem[0].category === 'event' ? '/events' : '/');
 return NextResponse.json({ ok: true, id, status, source: 'neon' });
 }

 try {
 // Met à jour via Apps Script
 const res = await fetch(APPS_SCRIPT_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 action: 'updateStatus',
 id,
 status,
 }),
 });

 if (!res.ok) {
 return NextResponse.json({ error: 'Erreur Apps Script' }, { status: 500 });
 }

 // Si "en ligne" → invalider le cache du site
 if (status === 'en ligne') {
 try {
 await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://alwasil-platform.vercel.app'}/api/revalidate`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-revalidate-secret': process.env.REVALIDATE_SECRET || '',
 },
 body: JSON.stringify({ paths: ['/', '/events', '/education', '/piscines', '/jobs', '/solidarity'] }),
 });
 } catch {
 // Revalidation non critique
 }
 }

 return NextResponse.json({ ok: true, id, status });
 } catch {
 return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
 }
}
