import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { inArray } from 'drizzle-orm';
import { duplicateReasons } from '../src/lib/data-quality.ts';
import { sendReview } from '../src/lib/telegram-moderation.ts';

const batch = [
  ['296924979', 'Salle de prière', 'Rue des Marchands', 'Coignières', '78310', '78', '48.7502922', '1.9196722', 'http://avecc.over-blog.com/'],
  ['340247284', 'Mosquée Philippe Grenier', '6 Place Jules Pagnier', 'Pontarlier', '25300', '25', '46.9046068', '6.3571272', '', '+33623155148', 'https://www.instagram.com/mosqueephilippegrenier/', 'https://www.facebook.com/mosquee.philippegrenier.1'],
  ['476278241', 'Mosquée Niya', '43 Rue des Chantaloups', 'Romainville', '93230', '93', '48.8916683', '2.433699', 'https://mosquee-romainville.fr/', '148445206', '', '', 'https://www.helloasso.com/associations/afmr'],
  ['670635777', "Mosquée Al'Madina", '5 Rue Des Lataniers', 'Saint-Denis', '97400', '974', '-20.8862831', '55.462834', ''],
  ['672114819', 'Mosquée', '51 Square des Sorbiers', 'Le Mée-sur-Seine', '77350', '77', '48.5437422', '2.6352907', ''],
  ['730688632', 'Mosquée de Persan', '69 Avenue Gaston Vermeire', 'Persan', '95340', '95', '49.1511047', '2.275185', ''],
  ['881090108', "Mosquée Ali Ibn Al Khattab", '83 Rue du Faubourg Saint-Denis', 'Paris', '75010', '75', '48.8735208', '2.3547382', '', '33951611849'],
  ['881308332', 'Mosquée de Paris 15ème', '47 Rue des 4 Frères Peignot', 'Paris', '75015', '75', '48.845432', '2.2826721', ''],
  ['886032807', 'Mosquée', '17 Cours Edouard Branly', 'Lesparre-Médoc', '33340', '33', '45.3033429', '-0.9227162', ''],
  ['886080780', 'Mosquée de Talence', '5 Rue Henry de Montherlant', 'Talence', '33400', '33', '44.7972504', '-0.5809593', '', '+33556372650'],
].map(([osm, name, address, city, postal, department, lat, lng, website = '', phone = '', instagram = '', facebook = '', fundraiser = '']) => ({
  id_osm: osm, name, address, city, postal, department, lat, lng, website, phone, instagram, facebook, fundraiser,
}));

const existing = await db.select({ id: items.id, category: items.category, title: items.title, city: items.city, dateStart: items.dateStart, sourceUrl: items.sourceUrl, metadata: items.metadata }).from(items).where(inArray(items.status, ['pending', 'approved']));
let inserted = 0;
let duplicates = 0;
for (const row of batch) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.name}, ${row.address}, ${row.city}, ${row.postal}`)}`;
  const raw = { ...row, type: 'mosquee', maps, source: 'Google Sheets', requires_enrichment: true };
  const candidate = { id: 'new', category: 'institute', title: row.name, city: row.city, dateStart: null, sourceUrl: row.website || null, metadata: { raw } };
  const duplicate = existing.find(item => duplicateReasons(candidate, item).length > 0);
  if (duplicate) { duplicates += 1; continue; }
  const [created] = await db.insert(items).values({
    category: 'institute', status: 'pending', title: row.name,
    description: `Lieu de prière à ${row.city}. Informations à compléter et vérifier avant publication.`,
    city: row.city, department: row.department, source: 'Google Sheets - mosquees_france_nettoyees', sourceUrl: row.website || null,
    tags: ['mosquee', 'lieu-de-priere'], isSpam: false,
    metadata: { subType: 'institut', raw, requiresEnrichment: true, importBatch: 'mosquees-001' },
  }).returning();
  existing.push(created);
  inserted += 1;
  await sendReview(created);
}
console.log(JSON.stringify({ batch: 'mosquees-001', inserted, duplicates, total: batch.length }));
