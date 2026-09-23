import { db } from '@/db';
import { items, partners } from '@/db/schema';
import { assessHajjOfferReadiness } from '@/lib/hajj-offer-quality';
import { and, eq } from 'drizzle-orm';
import { withoutEmDashes } from '@/lib/typography';

import type { Event } from '@/data/events';
import type { Institut } from '@/data/institutes';
import type { Librairie } from '@/data/librairies';
import type { JobOffer, TalentProfile } from '@/data/jobs';
import type {
  PraticienPsy,
  PraticienHijama,
  PraticienMedical,
  PraticienRoqya,
} from '@/data/sante';
import type {
  Cagnotte,
  Initiative,
  VisiteMalade,
  VoyageHumanitaire,
  Association,
} from '@/data/solidarity';
import type { HajjAgence, HajjPackage } from '@/data/hajj';

type Category = 'event' | 'job' | 'solidarity' | 'institute' | 'health' | 'library' | 'pool' | 'hajj';

// Le contenu original (tapé selon les types de src/data/*.ts) est conservé
// intact dans metadata.raw à la migration - on le relit tel quel ici pour
// que les composants existants n'aient rien à changer côté shape de données.
// Volume actuel < 200 lignes : filtrer le subType en JS plutôt qu'en SQL
// jsonb reste largement suffisant, à revoir si le volume grossit fortement.
export async function getRaw<T>(category: Category, subType: string): Promise<T[]> {
  try { const rows = await db
    .select({ id: items.id, metadata: items.metadata, title: items.title, description: items.description, city: items.city, department: items.department, sourceUrl: items.sourceUrl })
    .from(items)
    .where(and(eq(items.category, category), eq(items.status, 'approved'), eq(items.isSpam, false)));

  return rows
    .filter((r) => {
      const metadata = (r.metadata as Record<string, unknown> | null) || {};
      if (metadata.requiresEnrichment === true) return false;
      const raw = (metadata.raw && typeof metadata.raw === 'object' ? metadata.raw : {}) as Record<string, unknown>;
      const storedType = metadata.subType;
      // La page Apprentissage présente aussi les mosquées, mais leur thème
      // dépend du type réel de la fiche, pas de la catégorie SQL historique.
      if (category === 'institute' && subType === 'institut') return storedType === 'institut' || storedType === 'mosquee' || raw.type === 'mosquee';
      return storedType === subType;
    })
    .map((r) => {
      const metadata = (r.metadata || {}) as Record<string, unknown>;
      const raw = (metadata.raw && typeof metadata.raw === 'object' ? metadata.raw : {}) as Record<string, unknown>;
      // Les imports peuvent conserver certains champs dans la colonne items
      // plutôt que dans metadata.raw. On les fusionne sans écraser les détails
      // déjà enrichis dans la fiche originale.
      const publicRaw = Object.fromEntries(Object.entries(raw).filter(([key]) => !/^(metadata|source|sourceUrl|provenance|telegram_original|requires_enrichment|qualityScore|qualityBreakdown|verificationStatus|confidence|submittedBy|moderation)$/i.test(key)));
      return withoutEmDashes({
        ...publicRaw,
        id: r.id,
        title: raw.title || r.title,
        description: raw.description || r.description,
        city: raw.city || r.city,
        department: raw.department || r.department,
        ...(category === 'hajj' ? { sourceUrl: raw.sourceUrl || r.sourceUrl } : {}),
      } as T);
    }); } catch {
    return [];
  }
}


export async function getEvents() {
  const rows = (await getRaw<Event>('event', 'event')).filter((event) => event.id !== 'ici-dj-lyss-2026');
  return rows;
}
export const getInstituts = () => getRaw<Institut>('institute', 'institut');
export const getLibrairies = () => getRaw<Librairie>('library', 'librairie');
export const getJobOffers = () => getRaw<JobOffer>('job', 'job_offer');
export const getTalentProfiles = () => getRaw<TalentProfile>('job', 'talent_profile');
export const getPsyProfiles = () => getRaw<PraticienPsy>('health', 'psy');
export const getHijamaProfiles = () => getRaw<PraticienHijama>('health', 'hijama');
export const getMedicalProfiles = () => getRaw<PraticienMedical>('health', 'medical');
export const getRoqyaProfiles = () => getRaw<PraticienRoqya>('health', 'roqya');
export const getCagnottes = () => getRaw<Cagnotte>('solidarity', 'cagnotte');
export async function getInitiatives() {
  // A past date is not evidence of a new occurrence; never generate one from prose.
  return getRaw<Initiative>('solidarity', 'initiative');
}
export const getVisiteMalades = () => getRaw<VisiteMalade>('solidarity', 'visite_malade');
export const getVoyagesHumanitaires = () =>
  getRaw<VoyageHumanitaire>('solidarity', 'voyage_humanitaire');
export const getAssociations = () => getRaw<Association>('solidarity', 'association');
export async function getHajjAgences() {
  return getRaw<HajjAgence>('hajj', 'agence');
}
export async function getHajjPackages() {
  try {
    const rows = await getRaw<Record<string, unknown>>('hajj', 'package');
    const verifiedPartners = await db.select().from(partners).where(eq(partners.status, 'verified'));
    return rows.filter(raw => assessHajjOfferReadiness(raw).eligible && raw.agencyContactVerified === true && verifiedPartners.some(partner => partner.id === (raw.partnerId || raw.partner_id) && partner.email && partner.sourceUrl && partner.verifiedAt)).map((raw, index) => {
      const title = String(raw.name || raw.title || `Offre Hajj/Omra ${index + 1}`);
      const typeText = `${title} ${String(raw.type || '')}`.toLocaleLowerCase('fr-FR');
      const type = typeText.includes('hajj') ? 'hajj' : typeText.includes('ramadan') ? 'omra-ramadan' : 'omra-hors-saison';
      const city = String(raw.city || raw.ville || '');
      const rawPrice = Number(raw.price ?? raw.prix ?? raw.prix_a_partir ?? 0);
      const rawDuration = Number(raw.duration ?? raw.duree_jours);
      const includes = Array.isArray(raw.includes) ? raw.includes.map(String) : Array.isArray(raw.inclusions) ? raw.inclusions.map(String) : Array.isArray(raw.inclus) ? raw.inclus.map(String) : ['Voir les conditions auprès de l’agence'];
      const excludes = Array.isArray(raw.excludes) ? raw.excludes.map(String) : Array.isArray(raw.exclusions) ? raw.exclusions.map(String) : Array.isArray(raw.exclus) ? raw.exclus.map(String) : [];
      const externalReviews = Array.isArray(raw.externalReviews) ? raw.externalReviews.filter((review): review is Record<string, unknown> => Boolean(review && typeof review === 'object')).map(review => ({ source: String(review.source || review.url || 'Source externe'), rating: Number.isFinite(Number(review.rating)) ? Number(review.rating) : undefined, reviewCount: Number.isFinite(Number(review.reviewCount)) ? Number(review.reviewCount) : undefined, summary: typeof review.summary === 'string' ? review.summary : undefined, collectedAt: String(review.collectedAt || review.collected_at || '') })).filter(review => review.collectedAt) : undefined;
      return {
        id: String(raw.id || `db-hajj-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`),
        // Ne jamais afficher un faux identifiant d'agence. Le nom reste une
        // référence interne temporaire tant qu'un partner_id réel n'existe pas.
        agenceId: String(raw.partnerId || raw.partner_id),
        type,
        name: title,
        stars: ([3, 4, 5].includes(Number(raw.stars)) ? Number(raw.stars) : undefined) as 3 | 4 | 5 | undefined,
        duration: rawDuration,
        departCities: Array.isArray(raw.departCities) ? raw.departCities.map(String) as Array<'Paris' | 'Lyon' | 'Marseille' | 'Bordeaux' | 'Lille' | 'Nantes' | 'Strasbourg'> : [city] as Array<'Paris' | 'Lyon' | 'Marseille' | 'Bordeaux' | 'Lille' | 'Nantes' | 'Strasbourg'>,
        price: Number.isFinite(rawPrice) ? rawPrice : 0,
        includes,
        excludes,
        description: String(raw.description || 'Offre référencée par Al-Wasil. Les conditions sont présentées dans cette fiche et précisées lors de la demande de devis.'),
        departure: String(raw.departure || raw.depart || ''),
        priceDouble: Number(raw.priceDouble ?? raw.prix_double) || undefined,
        priceTriple: Number(raw.priceTriple ?? raw.prix_triple) || undefined,
        priceQuad: Number(raw.priceQuad ?? raw.prix_quad ?? raw.priceQuadruple) || undefined,
        priceSingle: Number(raw.priceSingle ?? raw.prix_single ?? raw.priceIndividuelle) || undefined,
        distanceMasjidHaram: Number(raw.distanceMasjidHaram ?? raw.distance_haram) || undefined,
        distanceMasjidNabawi: Number(raw.distanceMasjidNabawi ?? raw.distance_nabawi) || undefined,
        places: Number(raw.places) || undefined,
        placesRestantes: Number(raw.placesRestantes ?? raw.places_restantes) || undefined,
        promo: typeof raw.promo === 'string' ? raw.promo : undefined,
        featured: raw.featured === true,
        hotelMakkah: typeof raw.hotelMakkah === 'string' ? raw.hotelMakkah : typeof raw.hotel_makkah === 'string' ? raw.hotel_makkah : undefined,
        hotelMadinah: typeof raw.hotelMadinah === 'string' ? raw.hotelMadinah : typeof raw.hotel_madinah === 'string' ? raw.hotel_madinah : undefined,
        sourceUrl: typeof raw.sourceUrl === 'string' ? raw.sourceUrl : typeof raw.url_source === 'string' ? raw.url_source : typeof raw.website === 'string' ? raw.website : undefined,
        airline: typeof raw.airline === 'string' ? raw.airline : typeof raw.compagnie === 'string' ? raw.compagnie : undefined,
        requiredDocuments: Array.isArray(raw.requiredDocuments) ? raw.requiredDocuments.map(String) : Array.isArray(raw.required_documents) ? raw.required_documents.map(String) : Array.isArray(raw.documentsRequis) ? raw.documentsRequis.map(String) : Array.isArray(raw.documents_requis) ? raw.documents_requis.map(String) : undefined,
        lastVerifiedAt: typeof raw.lastVerifiedAt === 'string' ? raw.lastVerifiedAt : typeof raw.derniere_verification === 'string' ? raw.derniere_verification : undefined,
        seasonYear: Number(raw.seasonYear || raw.season || 0) || undefined,
        externalReviews,
      } satisfies HajjPackage;
    });
  }
  catch { return []; }
}
