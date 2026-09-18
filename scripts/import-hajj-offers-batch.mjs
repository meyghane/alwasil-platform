import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { inArray } from 'drizzle-orm';
import { duplicateReasons, normalizeText, normalizeUrl } from '../src/lib/data-quality.ts';
import { sendReview } from '../src/lib/telegram-moderation.ts';

// Sources publiques consultées le 18/09/2026. Ces fiches restent pending
// jusqu'à validation humaine et ne sont pas présentées comme des offres garanties.
const batch = [
  { title: 'Omra Janvier 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1299, duration: 9, departure: 'Janvier 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus, hébergement 4 ou 5 étoiles selon la formule. Prix et disponibilités à confirmer auprès de l’agence.' },
  { title: 'Omra Février 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1590, duration: 10, departure: 'Février 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus, hébergement 5 étoiles et accompagnement spirituel indiqués par la source. Prix et disponibilités à confirmer.' },
  { title: 'Omra Mars 2027 - départ Marseille', city: 'Marseille', season: '2027', price: 1590, duration: 9, departure: 'Mars 2027', sourceUrl: 'https://omraihram.com/', agency: 'Omraihram', description: 'Offre annoncée depuis Marseille, visa inclus et hébergement 4 ou 5 étoiles selon la formule. Dates exactes et disponibilités à confirmer.' },
  { title: 'Omra Janvier 2027 - départ Paris', city: 'Paris', season: '2027', price: 1790, duration: 9, departure: '06 - 16 janvier 2027', sourceUrl: 'https://www.almourafiq.com/', agency: 'Al Mourafiq', description: 'Départ annoncé depuis Paris, vol direct, hôtel proche du Haram et guide francophone annoncés par la source. Prix et conditions à vérifier.' },
  { title: 'Omra Décembre 2026 - vacances scolaires', city: 'Paris', season: '2026-2027', price: 2290, duration: 9, departure: '17 - 25 décembre 2026', sourceUrl: 'https://www.almourafiq.com/', agency: 'Al Mourafiq', description: 'Départ annoncé depuis Paris pendant les vacances scolaires, vol direct, hôtel proche du Haram et guide francophone annoncés par la source. Prix et conditions à vérifier.' },
  { title: 'Omra Premium Janvier 2027 - départ Paris', city: 'Paris', season: '2027', price: 1790, duration: 10, departure: '20 - 30 janvier 2027', sourceUrl: 'https://www.omragroupe.fr/omra-janvier', agency: 'Omra Groupe', description: 'Offre annoncée depuis Paris avec vol Saudia, hôtel Conrad 5 étoiles à environ 100 mètres du Haram et hôtel Bosphorus à Médine. Disponibilité et conditions à confirmer.' },
  { title: 'Omra Janvier 2027 - formule confort Paris', city: 'Paris', season: '2027', price: 1299, priceQuad: 1299, priceTriple: 1399, priceDouble: 1499, priceSingle: 1999, duration: 10, departure: '18 - 28 janvier 2027', sourceUrl: 'https://www.omradiscount.fr/omra/agence-omra-paris', agency: 'Omra Discount', airline: 'Saudia', hotelMakkah: 'Sheraton', hotelMadinah: 'View Al Madinah', includes: ['Vol', 'Visa', 'Hôtel à La Mecque', 'Hôtel à Médine'], requiredDocuments: ['Passeport valide', 'Photo d’identité', 'Carte de séjour pour les résidents français'], description: 'Formule annoncée au départ de Paris avec plusieurs niveaux de chambre, hôtels à Médine et La Mecque, visa et accompagnement à confirmer auprès de la source.' },
  { title: 'Omra Nouvel An 2027 - départ Paris', city: 'Paris', season: '2026-2027', price: 1999, priceQuad: 1699, priceTriple: 1799, priceDouble: 1999, priceSingle: 2599, duration: 9, departure: '24 décembre 2026 - 2 janvier 2027', sourceUrl: 'https://www.omradiscount.fr/omra/agence-omra-paris', agency: 'Omra Discount', airline: 'Saudia', hotelMakkah: 'Sheraton', hotelMadinah: 'View Al Madinah', includes: ['Vol', 'Visa', 'Hôtel à La Mecque', 'Hôtel à Médine'], requiredDocuments: ['Passeport valide', 'Photo d’identité', 'Carte de séjour pour les résidents français'], description: 'Départ annoncé pendant les vacances de fin d’année, avec compagnie aérienne et hôtels indiqués par la source. Prix, places et conditions à confirmer.' },
  { title: 'Omra Décembre 2026 - formule confort Paris', city: 'Paris', season: '2026', price: 1890, priceQuad: 1299, priceTriple: 1399, priceDouble: 1499, priceSingle: 1999, duration: 9, departure: '21 - 30 décembre 2026', sourceUrl: 'https://www.omradiscount.fr/omra/agence-omra-paris', agency: 'Omra Discount', airline: 'Saudia', hotelMakkah: 'Sheraton Jabal Kaaba', hotelMadinah: 'View Al Madinah', includes: ['Vol', 'Visa', 'Hôtel à Médine', 'Hôtel à La Mecque'], requiredDocuments: ['Passeport valide', 'Photo d’identité', 'Carte de séjour pour les résidents français'], description: 'Séjour annoncé au départ de Paris avec hôtel à Médine et hôtel à La Mecque. Plusieurs catégories de chambres proposées selon la source. Disponibilité à confirmer.' },
  { title: 'Omra Premium Octobre 2026 - départ Paris', city: 'Paris', season: '2026', price: 2150, duration: 9, departure: '19 octobre 2026', sourceUrl: 'https://www.agence-omra.fr/', agency: 'Agence Omra', description: 'Formule premium annoncée depuis Paris avec hôtel Conrad à environ 100 mètres du Haram, visa, vol et accompagnement francophone annoncés. Dernières places à confirmer.' },
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
    priceQuad: offer.priceQuad,
    priceTriple: offer.priceTriple,
    priceDouble: offer.priceDouble,
    priceSingle: offer.priceSingle,
    duration: offer.duration,
    departure: offer.departure,
    seasonYear: offer.season,
    sourceUrl: offer.sourceUrl,
    airline: offer.airline,
    hotelMakkah: offer.hotelMakkah,
    hotelMadinah: offer.hotelMadinah,
    includes: offer.includes,
    requiredDocuments: offer.requiredDocuments,
    verificationStatus: 'to_verify',
    lastVerifiedAt: '2026-09-18',
    tags: ['omra', 'offre', offer.season],
  };
  const candidate = { id: 'new', category: 'hajj', title: offer.title, city: offer.city, dateStart: null, sourceUrl: offer.sourceUrl, metadata: { raw } };
  const normalizedTitle = normalizeText(offer.title);
  const duplicate = existing.some(item => {
    const rawExisting = item.metadata?.raw || {};
    const existingTitle = normalizeText(item.title);
    const existingDeparture = normalizeText(String(rawExisting.departure || rawExisting.depart || ''));
    const sameTitle = existingTitle === normalizedTitle;
    const sameOfferDetails = normalizeUrl(offer.sourceUrl) === normalizeUrl(item.sourceUrl)
      && existingDeparture === normalizeText(offer.departure)
      && Number(rawExisting.price || 0) === offer.price;
    // A source page can list many offers. Its URL alone is not a duplicate.
    return item.category === 'hajj' && (sameTitle || sameOfferDetails) && duplicateReasons(candidate, item).length > 0;
  });
  if (duplicate) { duplicates += 1; continue; }
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
