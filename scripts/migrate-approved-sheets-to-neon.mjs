import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { inArray } from 'drizzle-orm';

const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
const apply = process.argv.includes('--apply');
if (!appsUrl) throw new Error('APPS_SCRIPT_WEBHOOK_URL manquante');

const response = await fetch(`${appsUrl}?action=list`, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Apps Script HTTP ${response.status}`);
const payload = await response.json();
const rows = Array.isArray(payload.soumissions) ? payload.soumissions : [];
const text = (row, keys) => keys.map(key => row[key] ?? row[key.toLowerCase()] ?? '').find(value => typeof value === 'string' && value.trim())?.trim() || '';
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const approved = new Set(['en ligne', 'enligne', 'approved', 'published', 'publie', 'publiee', 'true', 'valide', 'validee']);
const isApproved = row => approved.has(normalize(text(row, ['status', 'statut'])));
const classify = row => {
  const source = normalize([text(row, ['categorie', 'category', 'type']), text(row, ['titre', 'title', 'name']), text(row, ['description', 'texte'])].join(' '));
  if (/maraude|sans abri|sans-abri|distribution alimentaire|aide alimentaire/.test(source)) return 'maraude';
  if (/cours|formation|tajwid|coran|arabe|fiqh|tafsir|apprentissage/.test(source)) return 'cours';
  if (/collecte|humanitaire|solidarite|solidaire/.test(source)) return 'collecte';
  if (/iftar|rupture du jeune/.test(source)) return 'iftar';
  if (/webinaire|visioconference|en ligne/.test(source)) return 'webinaire';
  if (/jeunesse|jeune|enfant/.test(source)) return 'jeunesse';
  return 'conference';
};
const dateOf = row => text(row, ['date_iso', 'date_evenement', 'date_debut', 'date']);
const validDate = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value) : null;
const existing = await db.select({ title: items.title, city: items.city, dateStart: items.dateStart, sourceUrl: items.sourceUrl }).from(items).where(inArray(items.status, ['pending', 'approved', 'rejected', 'expired']));
const seen = new Set(existing.map(item => `${normalize(item.title)}|${normalize(item.city || '')}|${item.dateStart?.toISOString().slice(0, 10) || ''}|${normalize(item.sourceUrl || '')}`));
const candidates = rows.filter(isApproved).map(row => {
  const title = text(row, ['titre', 'title', 'name', 'nom']);
  const city = text(row, ['ville', 'city', 'location']);
  const date = validDate(dateOf(row));
  const sourceUrl = text(row, ['url_source', 'sourceurl', 'website', 'site_web', 'url']);
  const marker = normalize(text(row, ['categorie', 'category', 'destinationtab', 'sheettab']));
  const event = !!date || /event|evenement|agenda|soumission/.test(marker);
  const subtype = event ? 'event' : /cagnotte|fundraiser|solidar/.test(marker) ? 'cagnotte' : /institut|mosquee|education/.test(marker) ? 'institut' : null;
  if (!title || !subtype) return null;
  const category = subtype === 'event' ? 'event' : subtype === 'cagnotte' ? 'solidarity' : 'institute';
  const eventType = subtype === 'event' ? classify(row) : null;
  const key = `${normalize(title)}|${normalize(city)}|${date?.toISOString().slice(0, 10) || ''}|${normalize(sourceUrl)}`;
  return { row, title, city: city || null, date, sourceUrl: sourceUrl || null, category, subtype, eventType, key };
}).filter(Boolean).filter(candidate => {
  if (seen.has(candidate.key)) return false;
  seen.add(candidate.key);
  return true;
});

console.log(`Fiches approuvées dans Sheets : ${rows.filter(isApproved).length}`);
console.log(`Importables sans doublon : ${candidates.length}`);
if (!apply) {
  console.log('Simulation uniquement. Relancer avec --apply pour importer dans Neon.');
  process.exit(0);
}
let inserted = 0;
for (const candidate of candidates) {
  const row = candidate.row;
  const tags = candidate.eventType ? [candidate.eventType, ...(candidate.eventType === 'maraude' ? ['solidarite'] : [])] : [];
  await db.insert(items).values({
    category: candidate.category, status: 'approved', title: candidate.title,
    description: text(row, ['description', 'texte', 'details']) || null, city: candidate.city,
    department: text(row, ['departement', 'department', 'code_postal']) || null, dateStart: candidate.date,
    source: 'sheets-migration', sourceUrl: candidate.sourceUrl, tags, isSpam: false,
    lastVerifiedAt: new Date(), nextReviewAt: new Date(Date.now() + 30 * 86400000),
    metadata: { subType: candidate.subtype, raw: { ...row, category: candidate.eventType, tags } },
  });
  inserted += 1;
}
console.log(`Importées dans Neon : ${inserted}`);
