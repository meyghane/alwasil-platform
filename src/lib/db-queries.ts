import { db } from '@/db';
import { items } from '@/db/schema';
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
import { hajjAgences as staticHajjAgences, hajjPackages as staticHajjPackages } from '@/data/hajj';
import { allEvents, CURRENT_VERIFIED_EVENT_IDS } from '@/data/events'; import { allInstituts } from '@/data/institutes'; import { librairies } from '@/data/librairies'; import { jobOffers, talentProfiles } from '@/data/jobs'; import { psyProfiles, hijamaProfiles, medicalProfiles, roqyaProfiles } from '@/data/sante'; import { cagnottes, initiatives, visiteMalades, voyagesHumanitaires, associations } from '@/data/solidarity';

type Category = 'event' | 'job' | 'solidarity' | 'institute' | 'health' | 'library' | 'pool' | 'hajj';

// Le contenu original (tapé selon les types de src/data/*.ts) est conservé
// intact dans metadata.raw à la migration - on le relit tel quel ici pour
// que les composants existants n'aient rien à changer côté shape de données.
// Volume actuel < 200 lignes : filtrer le subType en JS plutôt qu'en SQL
// jsonb reste largement suffisant, à revoir si le volume grossit fortement.
async function getRaw<T>(category: Category, subType: string): Promise<T[]> {
  try { const rows = await db
    .select({ metadata: items.metadata, title: items.title, description: items.description, city: items.city, sourceUrl: items.sourceUrl })
    .from(items)
    .where(and(eq(items.category, category), eq(items.status, 'approved')));

  return rows
    .filter((r) => (r.metadata as Record<string, unknown> | null)?.subType === subType)
    .map((r) => {
      const metadata = (r.metadata || {}) as Record<string, unknown>;
      const raw = (metadata.raw && typeof metadata.raw === 'object' ? metadata.raw : {}) as Record<string, unknown>;
      // Les imports peuvent conserver certains champs dans la colonne items
      // plutôt que dans metadata.raw. On les fusionne sans écraser les détails
      // déjà enrichis dans la fiche originale.
      return withoutEmDashes({
        ...r,
        ...raw,
        title: raw.title || r.title,
        description: raw.description || r.description,
        city: raw.city || r.city,
        sourceUrl: raw.sourceUrl || r.sourceUrl,
      } as T);
    }); } catch {
    const fallback: Record<string, unknown[]> = { 'event:event': allEvents, 'institute:institut': allInstituts, 'library:librairie': librairies, 'job:job_offer': jobOffers, 'job:talent_profile': talentProfiles, 'health:psy': psyProfiles, 'health:hijama': hijamaProfiles, 'health:medical': medicalProfiles, 'health:roqya': roqyaProfiles, 'solidarity:cagnotte': cagnottes, 'solidarity:initiative': initiatives, 'solidarity:visite_malade': visiteMalades, 'solidarity:voyage_humanitaire': voyagesHumanitaires, 'solidarity:association': associations };
    return (fallback[`${category}:${subType}`] ?? []) as T[];
  }
}

function refreshRecurringInitiatives<T extends { recurring?: boolean; nextDate?: string; description?: string; tags?: string[] }>(itemsList: T[]): T[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return itemsList.map(item => {
    if (!item.recurring || !item.nextDate) return item;
    const original = new Date(`${item.nextDate}T12:00:00`);
    if (Number.isNaN(original.getTime()) || original >= now) return item;
    const text = `${item.description || ''} ${(item.tags || []).join(' ')}`.toLocaleLowerCase('fr-FR');
    const weeklyDay = text.includes('dimanche') ? 0 : text.includes('lundi') ? 1 : text.includes('mardi') ? 2 : text.includes('mercredi') ? 3 : text.includes('jeudi') ? 4 : text.includes('vendredi') ? 5 : text.includes('samedi') ? 6 : null;
    const next = new Date(now);
    if (weeklyDay !== null) {
      const days = (weeklyDay - next.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + days);
    } else {
      const day = Math.min(original.getDate(), 28);
      next.setDate(day);
      while (next < now) next.setMonth(next.getMonth() + 1);
    }
    return { ...item, nextDate: next.toISOString().slice(0, 10) };
  });
}

export async function getEvents() {
  const rows = (await getRaw<Event>('event', 'event')).filter((event) => event.id !== 'ici-dj-lyss-2026');
  const current = allEvents.filter((event) => CURRENT_VERIFIED_EVENT_IDS.some((id) => id === event.id));
  const ids = new Set(rows.map((event) => event.id));
  return [...rows, ...current.filter((event) => !ids.has(event.id))];
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
  return refreshRecurringInitiatives(await getRaw<Initiative>('solidarity', 'initiative'));
}
export const getVisiteMalades = () => getRaw<VisiteMalade>('solidarity', 'visite_malade');
export const getVoyagesHumanitaires = () =>
  getRaw<VoyageHumanitaire>('solidarity', 'voyage_humanitaire');
export const getAssociations = () => getRaw<Association>('solidarity', 'association');
export async function getHajjAgences() {
  try { const rows = await getRaw<HajjAgence>('hajj', 'agence'); return rows.length ? rows : staticHajjAgences; }
  catch { return staticHajjAgences; }
}
export async function getHajjPackages() {
  try {
    const rows = await getRaw<Record<string, unknown>>('hajj', 'package');
    if (!rows.length) return staticHajjPackages;
    return rows.map((raw, index) => {
      const title = String(raw.name || raw.title || `Offre Hajj/Omra ${index + 1}`);
      const typeText = `${title} ${String(raw.type || '')}`.toLocaleLowerCase('fr-FR');
      const type = typeText.includes('hajj') ? 'hajj' : typeText.includes('ramadan') ? 'omra-ramadan' : 'omra-hors-saison';
      const city = String(raw.city || raw.ville || 'Paris');
      const rawPrice = Number(raw.price ?? raw.prix ?? raw.prix_a_partir ?? 0);
      const rawDuration = Number(raw.duration ?? raw.duree_jours ?? 9);
      const includes = Array.isArray(raw.includes) ? raw.includes.map(String) : Array.isArray(raw.inclus) ? raw.inclus.map(String) : ['Voir les conditions auprès de l’agence'];
      const excludes = Array.isArray(raw.excludes) ? raw.excludes.map(String) : Array.isArray(raw.exclus) ? raw.exclus.map(String) : [];
      return {
        id: String(raw.id || `db-hajj-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`),
        agenceId: String(raw.agenceId || raw.agencyId || 'agence-a-verifier'),
        type,
        name: title,
        stars: (Number(raw.stars) >= 3 && Number(raw.stars) <= 5 ? Number(raw.stars) : 4) as 3 | 4 | 5,
        duration: Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 9,
        departCities: [city] as Array<'Paris' | 'Lyon' | 'Marseille' | 'Bordeaux' | 'Lille' | 'Nantes' | 'Strasbourg'>,
        price: Number.isFinite(rawPrice) ? rawPrice : 0,
        includes,
        excludes,
        description: String(raw.description || 'Offre importée depuis une source publique, à vérifier avant réservation.'),
        departure: String(raw.departure || raw.depart || ''),
        priceDouble: Number(raw.priceDouble ?? raw.prix_double) || undefined,
        distanceMasjidHaram: Number(raw.distanceMasjidHaram ?? raw.distance_haram) || undefined,
        distanceMasjidNabawi: Number(raw.distanceMasjidNabawi ?? raw.distance_nabawi) || undefined,
        places: Number(raw.places) || undefined,
        placesRestantes: Number(raw.placesRestantes ?? raw.places_restantes) || undefined,
        promo: typeof raw.promo === 'string' ? raw.promo : undefined,
        hotelMakkah: typeof raw.hotelMakkah === 'string' ? raw.hotelMakkah : typeof raw.hotel_makkah === 'string' ? raw.hotel_makkah : undefined,
        hotelMadinah: typeof raw.hotelMadinah === 'string' ? raw.hotelMadinah : typeof raw.hotel_madinah === 'string' ? raw.hotel_madinah : undefined,
        sourceUrl: typeof raw.sourceUrl === 'string' ? raw.sourceUrl : undefined,
        seasonYear: Number(raw.seasonYear || raw.season || 0) || undefined,
        verificationStatus: raw.verificationStatus === 'verified' ? 'verified' : 'to_verify',
      } satisfies HajjPackage;
    });
  }
  catch { return staticHajjPackages; }
}
