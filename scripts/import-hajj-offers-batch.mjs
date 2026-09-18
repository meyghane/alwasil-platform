import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { inArray } from 'drizzle-orm';
import { duplicateReasons } from '../src/lib/data-quality.ts';
import { sendReview } from '../src/lib/telegram-moderation.ts';

// Sources publiques consultées le 18/09/2026. Ces fiches restent pending
// jusqu'à validation humaine et ne sont pas présentées comme des offres garanties.
const batch = [
  { title: 'Omra Janvier 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1299, duration: 9, departure: 'Janvier 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus, hébergement 4 ou 5 étoiles selon la formule. Prix et disponibilités à confirmer auprès de l’agence.' },
  { title: 'Omra Février 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1590, duration: 10, departure: 'Février 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus, hébergement 5 étoiles et accompagnement spirituel indiqués par la source. Prix et disponibilités à confirmer.' },
  { title: 'Omra Mars 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1590, duration: 9, departure: 'Mars 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus et hébergement 4 ou 5 étoiles selon la formule. Dates exactes et disponibilités à confirmer.' },
  { title: 'Omra Janvier 2027 - départ Paris', city: 'Paris', season: '2027', price: 1790, duration: 9, departure: '06 - 16 janvier 2027', sourceUrl: 'https://www.almourafiq.com/', agency: 'Al Mourafiq', description: 'Départ annoncé depuis Paris, vol direct, hôtel proche du Haram et guide francophone annoncés par la source. Prix et conditions à vérifier.' },
  { title: 'Omra Décembre 2026 - vacances scolaires', city: 'Paris', season: '2026-2027', price: 2290, duration: 9, departure: '17 - 25 décembre 2026', sourceUrl: 'https://www.almourafiq.com/', agency: 'Al Mourafiq', description: 'Départ annoncé depuis Paris pendant les vacances scolaires, vol direct, hôtel proche du Haram et guide francophone annoncés par la source. Prix et conditions à vérifier.' },
];

const existing = await db.select({ id: items.id, category: items.category, title: items.title, city: items.city, dateStart: items.dateStart, sourceUrl: items.sourceUrl, metadata: items.metadata })
  .from(items).where(inArray(items.status, ['pending', 'approved']));

let inserted = 0;
let duplicates = 0;
for (const offer of batch) {
  const raw = {
    title: offer.title,
    name: offer.title,
    agency: offer.agency,
    city: offer.city,
    price: offer.price,
    duration: offer.duration,
    departure: offer.departure,
    seasonYear: offer.season,
    sourceUrl: offer.sourceUrl,
    verificationStatus: 'to_verify',
    lastVerifiedAt: '2026-09-18',
    tags: ['omra', 'offre', offer.season],
  };
  const candidate = { id: 'new', category: 'hajj', title: offer.title, city: offer.city, dateStart: null, sourceUrl: offer.sourceUrl, metadata: { raw } };
  if (existing.some(item => duplicateReasons(candidate, item).length > 0)) { duplicates += 1; continue; }
  const [created] = await db.insert(items).values({
    category: 'hajj', status: 'pending', title: offer.title, description: offer.description,
    city: offer.city, source: 'Recherche publique Hajj/Omra - batch 001', sourceUrl: offer.sourceUrl,
    tags: raw.tags, isSpam: false,
    metadata: { subType: 'package', raw, requiresEnrichment: true, importBatch: 'hajj-omra-001' },
  }).returning();
  existing.push(created);
  inserted += 1;
  await sendReview(created);
}

console.log(JSON.stringify({ batch: 'hajj-omra-001', inserted, duplicates, total: batch.length }));
