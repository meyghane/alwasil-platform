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
    .select({ metadata: items.metadata })
    .from(items)
    .where(and(eq(items.category, category), eq(items.status, 'approved')));

  return rows
    .filter((r) => (r.metadata as Record<string, unknown> | null)?.subType === subType)
    .map((r) => withoutEmDashes((r.metadata as { raw: unknown }).raw as T)); } catch {
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
  try { const rows = await getRaw<HajjPackage>('hajj', 'package'); return rows.length ? rows : staticHajjPackages; }
  catch { return staticHajjPackages; }
}
