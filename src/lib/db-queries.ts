import { db } from '@/db';
import { items } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

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
// intact dans metadata.raw à la migration — on le relit tel quel ici pour
// que les composants existants n'aient rien à changer côté shape de données.
// Volume actuel < 200 lignes : filtrer le subType en JS plutôt qu'en SQL
// jsonb reste largement suffisant, à revoir si le volume grossit fortement.
async function getRaw<T>(category: Category, subType: string): Promise<T[]> {
  const rows = await db
    .select({ metadata: items.metadata })
    .from(items)
    .where(and(eq(items.category, category), eq(items.status, 'approved')));

  return rows
    .filter((r) => (r.metadata as Record<string, unknown> | null)?.subType === subType)
    .map((r) => (r.metadata as { raw: unknown }).raw as T);
}

export const getEvents = () => getRaw<Event>('event', 'event');
export const getInstituts = () => getRaw<Institut>('institute', 'institut');
export const getLibrairies = () => getRaw<Librairie>('library', 'librairie');
export const getJobOffers = () => getRaw<JobOffer>('job', 'job_offer');
export const getTalentProfiles = () => getRaw<TalentProfile>('job', 'talent_profile');
export const getPsyProfiles = () => getRaw<PraticienPsy>('health', 'psy');
export const getHijamaProfiles = () => getRaw<PraticienHijama>('health', 'hijama');
export const getMedicalProfiles = () => getRaw<PraticienMedical>('health', 'medical');
export const getRoqyaProfiles = () => getRaw<PraticienRoqya>('health', 'roqya');
export const getCagnottes = () => getRaw<Cagnotte>('solidarity', 'cagnotte');
export const getInitiatives = () => getRaw<Initiative>('solidarity', 'initiative');
export const getVisiteMalades = () => getRaw<VisiteMalade>('solidarity', 'visite_malade');
export const getVoyagesHumanitaires = () =>
  getRaw<VoyageHumanitaire>('solidarity', 'voyage_humanitaire');
export const getAssociations = () => getRaw<Association>('solidarity', 'association');
export const getHajjAgences = () => getRaw<HajjAgence>('hajj', 'agence');
export const getHajjPackages = () => getRaw<HajjPackage>('hajj', 'package');
