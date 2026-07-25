// Migration one-off : src/data/*.ts (codé en dur) → table `items` Postgres (Neon).
// Usage : node --env-file=.env.local node_modules/.bin/tsx scripts/db/migrate-static-data.ts
import { db } from '../../src/db';
import { items } from '../../src/db/schema';

import { allEvents } from '../../src/data/events';
import { allInstituts } from '../../src/data/institutes';
import { librairies } from '../../src/data/librairies';
import { piscines } from '../../src/data/piscines';
import { jobOffers, talentProfiles } from '../../src/data/jobs';
import { psyProfiles, hijamaProfiles, medicalProfiles, roqyaProfiles } from '../../src/data/sante';
import {
  cagnottes,
  initiatives,
  visiteMalades,
  voyagesHumanitaires,
  associations,
} from '../../src/data/solidarity';
import { hajjAgences, hajjPackages } from '../../src/data/hajj';

type RawItem = Record<string, unknown>;

function firstOf(obj: RawItem, keys: string[]): unknown {
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}

function toDate(v: unknown): Date | null {
  if (!v || typeof v !== 'string') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

const CATEGORY_ALLOWED = [
  'event',
  'job',
  'solidarity',
  'institute',
  'health',
  'library',
  'pool',
  'hajj',
] as const;
type Category = (typeof CATEGORY_ALLOWED)[number];

const sources: { data: RawItem[]; category: Category; subType: string }[] = [
  { data: allEvents as unknown as RawItem[], category: 'event', subType: 'event' },
  { data: allInstituts as unknown as RawItem[], category: 'institute', subType: 'institut' },
  { data: librairies as unknown as RawItem[], category: 'library', subType: 'librairie' },
  { data: piscines as unknown as RawItem[], category: 'pool', subType: 'piscine' },
  { data: jobOffers as unknown as RawItem[], category: 'job', subType: 'job_offer' },
  { data: talentProfiles as unknown as RawItem[], category: 'job', subType: 'talent_profile' },
  { data: psyProfiles as unknown as RawItem[], category: 'health', subType: 'psy' },
  { data: hijamaProfiles as unknown as RawItem[], category: 'health', subType: 'hijama' },
  { data: medicalProfiles as unknown as RawItem[], category: 'health', subType: 'medical' },
  { data: roqyaProfiles as unknown as RawItem[], category: 'health', subType: 'roqya' },
  { data: cagnottes as unknown as RawItem[], category: 'solidarity', subType: 'cagnotte' },
  { data: initiatives as unknown as RawItem[], category: 'solidarity', subType: 'initiative' },
  { data: visiteMalades as unknown as RawItem[], category: 'solidarity', subType: 'visite_malade' },
  {
    data: voyagesHumanitaires as unknown as RawItem[],
    category: 'solidarity',
    subType: 'voyage_humanitaire',
  },
  { data: associations as unknown as RawItem[], category: 'solidarity', subType: 'association' },
  { data: hajjAgences as unknown as RawItem[], category: 'hajj', subType: 'agence' },
  { data: hajjPackages as unknown as RawItem[], category: 'hajj', subType: 'package' },
];

async function migrate() {
  const now = new Date();
  let total = 0;

  for (const { data, category, subType } of sources) {
    if (!Array.isArray(data) || data.length === 0) continue;

    const rows = data.map((raw) => {
      const title = String(firstOf(raw, ['title', 'name']) ?? 'Sans titre');
      const description = String(firstOf(raw, ['description']) ?? '');
      const cityRaw = firstOf(raw, ['city', 'ville', 'location']);
      const departmentRaw = firstOf(raw, ['department']);
      const tags = Array.isArray(raw.tags) ? (raw.tags as string[]) : [];
      const sourceUrl = firstOf(raw, ['website', 'url', 'registrationUrl', 'maps', 'organizerUrl']);
      const dateStart = toDate(raw['date']);
      const dateEnd = toDate(raw['endDate']);

      const status = category === 'event' && dateStart && dateStart < now ? 'expired' : 'approved';

      return {
        category,
        status: status as 'approved' | 'expired',
        title,
        description,
        city: cityRaw ? String(cityRaw) : null,
        department: departmentRaw ? String(departmentRaw) : null,
        region: 'idf',
        dateStart,
        dateEnd,
        source: 'manual_migration_2026-07-25',
        sourceUrl: sourceUrl ? String(sourceUrl) : null,
        tags,
        isSpam: false,
        metadata: { subType, originalId: raw.id ?? null, raw },
      };
    });

    await db.insert(items).values(rows);
    total += rows.length;
    console.log(`${category}/${subType}: ${rows.length} items migrés`);
  }

  console.log(`\nTOTAL: ${total} items migrés vers Postgres`);
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
