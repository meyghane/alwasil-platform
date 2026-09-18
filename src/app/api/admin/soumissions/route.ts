// GET /api/admin/soumissions → liste toutes les soumissions depuis Apps Script
// PATCH /api/admin/soumissions → met à jour le status d'une soumission

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
import { db } from '@/db';
import { items, moderationLog } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { withoutEmDashes } from '@/lib/typography';

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
 const automatic = await db.select().from(items).where(inArray(items.status, ['pending', 'approved', 'rejected', 'expired']));
 const neonSoumissions = automatic.map((item) => ({
 id: item.id,
 categorie: item.category,
 destinationTab: 'Neon · items',
 status: item.status === 'approved' ? 'en ligne' : item.status === 'expired' ? 'archivé' : item.status === 'rejected' ? 'pas en ligne' : 'à vérifier',
 soumis_le: item.createdAt.toISOString(),
 soumis_par: item.source,
 name: item.title,
 titre: item.title,
 ville: item.city || undefined,
 description: item.description || undefined,
 url_source: item.sourceUrl || undefined,
 date_evenement: typeof (item.metadata?.raw as Record<string, unknown> | undefined)?.date === 'string' ? String((item.metadata?.raw as Record<string, unknown>).date) : undefined,
 lieu: typeof (item.metadata?.raw as Record<string, unknown> | undefined)?.location === 'string' ? String((item.metadata?.raw as Record<string, unknown>).location) : undefined,
 adresse: typeof (item.metadata?.raw as Record<string, unknown> | undefined)?.address === 'string' ? String((item.metadata?.raw as Record<string, unknown>).address) : undefined,
 organisateur: typeof (item.metadata?.raw as Record<string, unknown> | undefined)?.organizer === 'string' ? String((item.metadata?.raw as Record<string, unknown>).organizer) : undefined,
 heure: typeof (item.metadata?.raw as Record<string, unknown> | undefined)?.timeStart === 'string' ? String((item.metadata?.raw as Record<string, unknown>).timeStart) : undefined,
 departement: item.department || undefined,
 source_system: 'neon',
 requires_campaign_check: item.category === 'solidarity' && item.metadata?.subType === 'cagnotte' ? 'oui' : undefined,
 requires_enrichment: item.metadata?.requiresEnrichment === true ? 'oui' : undefined,
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
 return NextResponse.json({ soumissions: withoutEmDashes([...neonSoumissions, ...legacy]), source: 'neon+legacy' });
 } catch {
 return NextResponse.json({ soumissions: [], error: 'Neon indisponible' }, { status: 503 });
 }
}

// Mettre à jour le status d'une soumission
export async function PATCH(req: NextRequest) {
 if (!(await isAuthorized())) {
 return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 }

 const { id, status, verifiedCampaign, edits } = await req.json();

 if (id && edits && typeof edits === 'object' && !Array.isArray(edits)) {
   if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Administrateur requis pour corriger cette fiche' }, { status: 403 });
   const [current] = await db.select().from(items).where(eq(items.id, id)).limit(1);
   if (!current || !['pending', 'approved', 'expired'].includes(current.status)) return NextResponse.json({ error: 'Fiche introuvable ou non modifiable' }, { status: 404 });
   const value = (key: string, max: number): string => typeof edits[key] === 'string' ? withoutEmDashes(edits[key].trim().slice(0, max)) : '';
   const title = value('title', 240);
   if (!title) return NextResponse.json({ error: 'Un titre est nécessaire' }, { status: 400 });
   const date = value('date', 10);
   if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) {
     return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
   }
   const url = value('sourceUrl', 1000);
   if (url && !/^https:\/\/[^\s]+$/i.test(url)) return NextResponse.json({ error: 'Lien HTTPS invalide' }, { status: 400 });
   const raw = (current.metadata?.raw || {}) as Record<string, unknown>;
   const city = value('city', 120);
   const department = value('department', 3);
   const organizer = value('organizer', 160);
   const timeStart = value('timeStart', 20);
   const complete = current.category === 'event' ? !!(date && city && department && organizer && timeStart)
     : !!(city && department);
   const metadata = withoutEmDashes({ ...current.metadata, raw: { ...raw, id: raw.id || current.id, title, name: title,
     description: value('description', 3000), city, department, date, organizer, timeStart,
     location: value('location', 240), address: value('address', 240), website: url, registrationUrl: url },
     requiresEnrichment: edits.verifiedDetails === true ? !complete : current.metadata?.requiresEnrichment });
   await db.update(items).set({ title, description: value('description', 3000), city, department,
     sourceUrl: url || null, dateStart: date ? new Date(`${date}T12:00:00Z`) : null,
     metadata, updatedAt: new Date() }).where(eq(items.id, id));
   return NextResponse.json({ ok: true, needsMoreDetails: metadata.requiresEnrichment === true });
 }

 if (!id || !status) {
 return NextResponse.json({ error: 'id et status requis' }, { status: 400 });
 }

 if (!['en ligne', 'pas en ligne', 'à vérifier', 'archivé', 'expiré'].includes(status)) {
 return NextResponse.json({ error: 'Status invalide' }, { status: 400 });
 }

 const neonItem = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)
   ? await db.select({ id: items.id, category: items.category, title: items.title, description: items.description, metadata: items.metadata, status: items.status }).from(items).where(eq(items.id, id)).limit(1)
   : [];
 if (neonItem.length > 0) {
 if (status === 'en ligne' && neonItem[0].metadata?.requiresEnrichment === true) return NextResponse.json({ error: 'Cette fiche rapide doit être complétée et vérifiée avant publication.' }, { status: 400 });
 const campaign = neonItem[0].category === 'solidarity' && neonItem[0].metadata?.subType === 'cagnotte';
 if (campaign && status === 'en ligne' && verifiedCampaign !== true) return NextResponse.json({ error: 'Vérifiez la collecte et confirmez avant publication.' }, { status: 400 });
 const now = new Date();
 const metadata = campaign && status === 'en ligne' ? { ...neonItem[0].metadata, raw: { ...(neonItem[0].metadata?.raw as Record<string, unknown> || {}), verified: true } } : neonItem[0].metadata;
 const nextStatus = status === 'en ligne' ? 'approved' : status === 'archivé' || status === 'expiré' ? 'expired' : 'rejected';
 await db.update(items).set({ status: nextStatus, updatedAt: now,
   title: withoutEmDashes(neonItem[0].title), description: withoutEmDashes(neonItem[0].description),
   metadata: withoutEmDashes(metadata),
   ...(status === 'en ligne' ? { lastVerifiedAt: now, nextReviewAt: new Date(now.getTime() + 30 * 86400000) } : {}) }).where(eq(items.id, id));
 await db.insert(moderationLog).values({ itemId: id, action: status === 'en ligne' ? 'approved' : nextStatus === 'expired' ? 'archived' : 'rejected', previousStatus: neonItem[0].status, newStatus: nextStatus, actor: (await isAdminLoggedIn()) ? 'admin:site' : 'moderator:site' }).catch(error => console.error('[admin] moderation log write failed:', error));
 revalidatePath('/');
 const category = neonItem[0].category;
 const publicPage = category === 'event' ? '/events'
   : category === 'institute' ? '/education'
   : category === 'solidarity' ? '/solidarity'
   : category === 'job' ? '/jobs'
   : category === 'library' ? '/librairies'
   : category === 'pool' ? '/piscines'
   : category === 'health' ? '/sante'
   : category === 'hajj' ? '/hajj' : '/';
 revalidatePath(publicPage);
 if (category === 'institute') revalidatePath('/api/mosques');
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
