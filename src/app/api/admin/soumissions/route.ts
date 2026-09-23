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
import { findSchoolHolidayPeriod, holidayLabel } from '@/lib/school-holidays';
import { assessHajjOfferReadiness } from '@/lib/hajj-offer-quality';
import { publicationIssues } from '@/lib/publication';
import { enrichMosque } from '@/lib/mosque-enrichment';

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
 const neonSoumissions = automatic.map((item) => {
 const raw = (item.metadata?.raw || {}) as Record<string, unknown>;
 const searchable = `${item.title} ${item.description || ''}`.toLocaleLowerCase('fr-FR');
 const hasCourse = (Array.isArray(raw.courses) && raw.courses.length > 0) || /cours|formation|enseignement|coran|tajwid|arabe|hifz|mémorisation|memorisation/.test(searchable);
 const isMosque = item.category === 'institute' && !hasCourse && (item.metadata?.subType === 'mosquee' || raw.type === 'mosquee' || /mosquée|mosquee|masjid|lieu de prière|lieu de priere|salle de prière|salle de priere/.test(searchable));
 const text = `${item.title} ${item.description || ''}`;
 const asText = (key: string) => typeof raw[key] === 'string' ? raw[key] as string : undefined;
 const asList = (key: string) => Array.isArray(raw[key]) ? (raw[key] as unknown[]).filter(value => typeof value === 'string').join('\n') : asText(key);
 return {
 id: item.id,
 categorie: isMosque ? 'mosquee' : item.category,
 destinationTab: 'Neon · items',
 status: item.status === 'approved' ? 'en ligne' : item.status === 'expired' ? 'archivé' : item.status === 'rejected' ? 'pas en ligne' : 'à vérifier',
 soumis_le: item.createdAt.toISOString(),
 soumis_par: item.source,
 name: item.title,
 titre: item.title,
 ville: item.city || undefined,
 description: item.description || undefined,
 url_source: item.sourceUrl || undefined,
 date_evenement: typeof raw.date === 'string' ? raw.date : undefined,
 lieu: typeof raw.location === 'string' ? raw.location : undefined,
 adresse: typeof raw.address === 'string' ? raw.address : undefined,
 organisateur: typeof raw.organizer === 'string' ? raw.organizer : undefined,
 heure: typeof raw.timeStart === 'string' ? raw.timeStart : undefined,
 departement: item.department || undefined,
 prix: asText('price') || asText('prix') || asText('pricePerPerson'),
 prix_double: asText('priceDouble'),
 prix_triple: asText('priceTriple'),
 prix_quad: asText('priceQuad'),
 prix_single: asText('priceSingle'),
 duree: asText('duration') || asText('duree_jours'),
 depart: asText('departure') || (text.match(/départ(?:\s+depuis)?\s+([^,.;]+)/i)?.[1]?.trim()),
 hotel_makkah: asText('hotelMakkah'),
 hotel_madinah: asText('hotelMadinah'),
 distance_haram: asText('distanceMasjidHaram'),
 distance_nabawi: asText('distanceMasjidNabawi'),
 compagnie: asText('airline'),
 places: asText('places'),
 places_restantes: asText('placesRestantes'),
 promotion: asText('promo'),
 inclusions: asList('includes'),
 exclusions: asList('excludes'),
 documents_requis: asList('requiredDocuments'),
 source_system: 'neon',
 requires_campaign_check: item.category === 'solidarity' && item.metadata?.subType === 'cagnotte' ? 'oui' : undefined,
 requires_enrichment: item.metadata?.requiresEnrichment === true ? 'oui' : undefined,
 }; });
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
   const enteredDate = value('date', 10);
   const holiday = findSchoolHolidayPeriod(`${title} ${value('description', 3000)}`);
   const date = enteredDate || holiday?.start || '';
   if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) {
     return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
   }
   const url = value('sourceUrl', 1000);
   if (url && !/^https:\/\/[^\s]+$/i.test(url)) return NextResponse.json({ error: 'Lien HTTPS invalide' }, { status: 400 });
   const raw = (current.metadata?.raw || {}) as Record<string, unknown>;
   const isMosque = current.category === 'institute' && (current.metadata?.subType === 'mosquee' || raw.type === 'mosquee');
   let researched = null;
   if (isMosque && (current.metadata?.requiresEnrichment === true || title.toLocaleLowerCase('fr-FR') === 'mosquée')) {
     researched = await enrichMosque({ ...raw, title, city: value('city', 120), department: value('department', 3), address: value('address', 300) });
   }
   const city = value('city', 120);
   const department = value('department', 3);
   const organizer = value('organizer', 160);
   const timeStart = value('timeStart', 20);
   const description = value('description', 3000);
   const enrichedDescription = holiday && !description.toLocaleLowerCase('fr-FR').includes(holiday.start) ? `${description}\n\nPériode repérée : ${holidayLabel(holiday)}.` : description;
   const isHajjOffer = /\b(omra|hajj|hadj)\b/i.test(`${title} ${enrichedDescription}`) || current.category === 'hajj';
   const nextCategory = isHajjOffer ? 'hajj' : current.category;
   const list = (key: string): string[] | undefined => {
     if (typeof edits[key] !== 'string') return undefined;
     return edits[key].split(/\r?\n/).map((entry: string) => entry.trim()).filter(Boolean).slice(0, 40);
   };
   const numeric = (key: string): number | undefined => {
     const entered = value(key, 32).replace(',', '.');
     if (!entered) return undefined;
     const parsed = Number(entered.replace(/[^0-9.]/g, ''));
     return Number.isFinite(parsed) ? parsed : undefined;
   };
   const optional = (key: string, max = 240): string | undefined => {
     const entered = value(key, max);
     return entered || (typeof raw[key] === 'string' ? raw[key] as string : undefined);
   };
   const finalTitle = researched?.title || title;
   const finalDescription = researched?.description || enrichedDescription;
   const rawUpdated: Record<string, unknown> = { ...raw, id: raw.id || current.id, title: finalTitle, name: finalTitle,
     description: finalDescription, city: researched?.city || city, department: researched?.department || department, date, organizer, timeStart,
     location: researched?.location || optional('location'), address: researched?.address || optional('address'), website: researched?.website || url || raw.website, phone: researched?.phone || raw.phone, registrationUrl: url || raw.registrationUrl,
     provenance: researched?.sources || raw.provenance };
   const hajjTextFields: Record<string, string | undefined> = {
     departure: optional('departure'), duration: optional('duration', 80), airline: optional('airline', 120),
     hotelMakkah: optional('hotelMakkah', 180), hotelMadinah: optional('hotelMadinah', 180),
     distanceMasjidHaram: optional('distanceHaram', 80), distanceMasjidNabawi: optional('distanceNabawi', 80),
     promo: optional('promo', 300),
   };
   for (const [key, entered] of Object.entries(hajjTextFields)) if (entered) rawUpdated[key] = entered;
   const numericFields: Record<string, string> = { price: 'price', priceDouble: 'priceDouble', priceTriple: 'priceTriple', priceQuad: 'priceQuad', priceSingle: 'priceSingle', places: 'places', placesRestantes: 'placesRemaining' };
   for (const [rawKey, editKey] of Object.entries(numericFields)) { const entered = numeric(editKey); if (entered !== undefined) rawUpdated[rawKey] = entered; }
   for (const [rawKey, editKey] of [['includes', 'includes'], ['excludes', 'excludes'], ['requiredDocuments', 'requiredDocuments']]) { const entered = list(editKey); if (entered?.length) rawUpdated[rawKey] = entered; }
   if (isHajjOffer) rawUpdated.subType = 'package';
   const priceAvailable = numeric('price') !== undefined || raw.price !== undefined || raw.prix !== undefined || raw.pricePerPerson !== undefined;
   const complete = nextCategory === 'event' ? !!(date && city && department && organizer && timeStart)
     : nextCategory === 'hajj' ? assessHajjOfferReadiness(rawUpdated).eligible
     : !!(city && department);
   const enrichmentMissing = researched?.missing || [];
   const mosqueComplete = !isMosque || (!!finalTitle && finalTitle.toLocaleLowerCase('fr-FR') !== 'mosquée' && !!rawUpdated.address && !!(researched?.sources?.length || url || raw.website));
   const metadata = withoutEmDashes({ ...current.metadata, subType: isHajjOffer ? 'package' : current.metadata?.subType, raw: rawUpdated,
     enrichment: researched ? { checkedAt: new Date().toISOString(), sources: researched.sources, missing: enrichmentMissing } : current.metadata?.enrichment,
     requiresEnrichment: isMosque ? !mosqueComplete : edits.verifiedDetails === true ? !complete : current.metadata?.requiresEnrichment });
   await db.update(items).set({ category: nextCategory, title: finalTitle, description: finalDescription, city: String(rawUpdated.city || city) || null, department: String(rawUpdated.department || department) || null,
     sourceUrl: url || null, dateStart: date ? new Date(`${date}T12:00:00Z`) : null,
     metadata, updatedAt: new Date() }).where(eq(items.id, id));
   revalidatePath('/hajj');
   revalidatePath('/events');
   await db.insert(moderationLog).values({ itemId: id, action: 'edited', previousStatus: current.status, newStatus: current.status, actor: (await isAdminLoggedIn()) ? 'admin:site' : 'moderator:site' });
   return NextResponse.json({ ok: true, needsMoreDetails: metadata.requiresEnrichment === true, missing: enrichmentMissing });
 }

 if (!id || !status) {
 return NextResponse.json({ error: 'id et status requis' }, { status: 400 });
 }

 if (!['en ligne', 'pas en ligne', 'à vérifier', 'archivé', 'expiré'].includes(status)) {
 return NextResponse.json({ error: 'Status invalide' }, { status: 400 });
 }

 const neonItem = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)
   ? await db.select({ id: items.id, category: items.category, title: items.title, description: items.description, city: items.city, department: items.department, sourceUrl: items.sourceUrl, metadata: items.metadata, status: items.status, dateStart: items.dateStart }).from(items).where(eq(items.id, id)).limit(1)
   : [];
 if (neonItem.length > 0) {
 if (status === 'en ligne') {
   const missing = publicationIssues(neonItem[0]);
   if (missing.length) return NextResponse.json({ error: 'Fiche à compléter avant publication.', missing }, { status: 422 });
 }
 if (status === 'en ligne' && neonItem[0].metadata?.requiresEnrichment === true && neonItem[0].category === 'institute') {
   const raw = (neonItem[0].metadata?.raw || {}) as Record<string, unknown>;
   const researched = await enrichMosque({ ...raw, title: neonItem[0].title, city: neonItem[0].city, department: neonItem[0].department });
   if (researched) {
     const finalTitle = researched.title || neonItem[0].title;
     const finalDescription = researched.description || neonItem[0].description;
     const complete = !!researched.title && researched.title.toLocaleLowerCase('fr-FR') !== 'mosquée' && !!researched.address && !!researched.sources?.length;
     const nextMetadata = { ...neonItem[0].metadata, raw: { ...raw, title: finalTitle, name: finalTitle, description: finalDescription, address: researched.address, location: researched.location, website: researched.website, phone: researched.phone, provenance: researched.sources }, enrichment: { checkedAt: new Date().toISOString(), sources: researched.sources, missing: researched.missing }, requiresEnrichment: !complete };
     await db.update(items).set({ title: finalTitle, description: finalDescription, city: researched.city || neonItem[0].city, department: researched.department || neonItem[0].department, sourceUrl: researched.website || neonItem[0].sourceUrl, metadata: nextMetadata, updatedAt: new Date() }).where(eq(items.id, id));
     neonItem[0].metadata = nextMetadata;
     neonItem[0].title = finalTitle;
     neonItem[0].description = finalDescription;
     if (!complete) return NextResponse.json({ error: `Enrichissement effectué, validation suspendue. Données manquantes : ${researched.missing.join(', ') || 'informations vérifiables'}.`, missing: researched.missing }, { status: 422 });
   }
 }
 if (status === 'en ligne' && neonItem[0].metadata?.requiresEnrichment === true) return NextResponse.json({ error: 'Enrichissement indisponible : la fiche reste à revérifier, sans publication.', missing: ['enrichissement web vérifiable'] }, { status: 422 });
 const campaign = neonItem[0].category === 'solidarity' && neonItem[0].metadata?.subType === 'cagnotte';
 if (campaign && status === 'en ligne' && verifiedCampaign !== true) return NextResponse.json({ error: 'Vérifiez la collecte et confirmez avant publication.' }, { status: 400 });
 const now = new Date();
 const metadata = campaign && status === 'en ligne' ? { ...neonItem[0].metadata, raw: { ...(neonItem[0].metadata?.raw as Record<string, unknown> || {}), verified: true } } : neonItem[0].metadata;
 const nextStatus = status === 'en ligne' ? 'approved' : status === 'à vérifier' ? 'pending' : status === 'archivé' || status === 'expiré' ? 'expired' : 'rejected';
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
 if (category === 'institute') { revalidatePath('/api/mosques'); revalidatePath('/lieux-priere'); }
 return NextResponse.json({ ok: true, id, status, source: 'neon' });
 }

 return NextResponse.json({ error: 'Fiche absente de Neon. Importer en attente avant modération.' }, { status: 422 });
}
