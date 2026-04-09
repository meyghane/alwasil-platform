/**
 * ============================================================
 * AL WASIL — Export données TS → CSV (prêt pour Google Sheets)
 * ============================================================
 * Usage : npx tsx scripts/export-to-sheets.ts
 * Output : scripts/csv/*.csv  (1 fichier par onglet du sheet)
 *
 * Colonnes = structure exacte du sheet BDD public
 * mosqueeId ajouté dans Education et Solidarite_cagnottes
 * ============================================================
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { allEvents }                  from '../src/data/events.js';
import { allInstituts }               from '../src/data/institutes.js';
import { jobOffers }                  from '../src/data/jobs.js';
import { cagnottes, initiatives }     from '../src/data/solidarity.js';
import { psyProfiles, hijamaProfiles, roqyaProfiles } from '../src/data/sante.js';
import { piscines }                   from '../src/data/piscines.js';
import { librairies }                 from '../src/data/librairies.js';
import { hajjAgences, hajjPackages }  from '../src/data/hajj.js';

// ─── Helpers CSV ─────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);
const OUT_DIR    = join(__dir, 'csv');
mkdirSync(OUT_DIR, { recursive: true });

function esc(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n'))
    return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const bool = (v: boolean | undefined) => v === true ? 'TRUE' : v === false ? 'FALSE' : '';
const arr  = (v: unknown[] | undefined) => (!v || v.length === 0) ? '' : v.join(',');
const row  = (cols: Record<string, string>) => Object.values(cols).map(esc).join(',');

function writeCsv(filename: string, headers: string[], rows: string[]): void {
  const content = [headers.join(','), ...rows].join('\n');
  writeFileSync(join(OUT_DIR, filename), content, 'utf-8');
  console.log(`✅ ${filename} — ${rows.length} ligne(s)`);
}

// ============================================================
// 1. EDUCATION
// + mosqueeId : rempli auto si type==='mosquee' (id = id mosquée)
//               sinon vide → à compléter manuellement dans le sheet
// ============================================================
const eduHeaders = [
  'id','name','type','address','city','department',
  'website','phone','email','courses','audience','format',
  'description','tags','verified','featured','active','mosqueeId',
];

const eduRows = allInstituts.map(i => row({
  id:         i.id,
  name:       i.name,
  type:       i.type,
  address:    i.address,
  city:       i.city,
  department: i.department,
  website:    i.website    ?? '',
  phone:      i.phone      ?? '',
  email:      i.email      ?? '',
  courses:    arr(i.courses),
  audience:   arr(i.audience),
  format:     arr(i.format),
  description:i.description,
  tags:       arr(i.tags),
  verified:   bool(i.verified),
  featured:   bool(i.featured),
  active:     'TRUE',
  // Si la fiche EST une mosquée, son id peut directement servir de mosqueeId
  mosqueeId:  i.type === 'mosquee' ? i.id : '',
}));

writeCsv('education.csv', eduHeaders, eduRows);

// ============================================================
// 2. EVENTS
// ============================================================
const evtHeaders = [
  'id','title','category','date','timeStart','timeEnd','location',
  'address','city','department','organizer','organizerUrl',
  'description','format','registrationUrl','isFree','price',
  'tags','featured','active',
];

const evtRows = allEvents.map(e => row({
  id:              e.id,
  title:           e.title,
  category:        e.category,
  date:            e.date,
  timeStart:       e.timeStart,
  timeEnd:         e.timeEnd         ?? '',
  location:        e.location,
  address:         e.address         ?? '',
  city:            e.city,
  department:      e.department,
  organizer:       e.organizer,
  organizerUrl:    e.organizerUrl    ?? '',
  description:     e.description,
  format:          e.format,
  registrationUrl: e.registrationUrl ?? '',
  isFree:          bool(e.isFree),
  price:           e.price           ?? '',
  tags:            arr(e.tags),
  featured:        bool(e.featured),
  active:          'TRUE',
}));

writeCsv('events.csv', evtHeaders, evtRows);

// ============================================================
// 3. SOLIDARITE_CAGNOTTES
// + mosqueeId : pour les cagnottes liées à une mosquée (ex: rénovation)
//               vide par défaut → à compléter manuellement
// ============================================================
const cagHeaders = [
  'id','title','organizer','platform','url','description',
  'category','raised','goal','currency','country',
  'nb_donateurs','verified','featured','active','mosqueeId',
];

const cagRows = cagnottes.map(c => row({
  id:           c.id,
  title:        c.title,
  organizer:    c.organizer,
  platform:     c.platform,
  url:          c.url,
  description:  c.description,
  category:     c.category,
  raised:       String(c.raised       ?? ''),
  goal:         String(c.goal         ?? ''),
  currency:     c.currency,
  country:      c.country             ?? '',
  nb_donateurs: String(c.backers      ?? ''),
  verified:     bool(c.verified),
  featured:     bool(c.featured),
  active:       'TRUE',
  // mosqueeId : vide par défaut, à remplir manuellement dans le sheet
  // quand la cagnotte est liée à une mosquée spécifique
  mosqueeId:    '',
}));

writeCsv('solidarite_cagnottes.csv', cagHeaders, cagRows);

// ============================================================
// 4. SOLIDARITE_INITIATIVES
// ============================================================
const initHeaders = [
  'id','title','type','organizer','city','department',
  'description','contactUrl','phone','tags','recurring','nextDate','active',
];

const initRows = initiatives.map(i => row({
  id:          i.id,
  title:       i.title,
  type:        i.type,
  organizer:   i.organizer,
  city:        i.city,
  department:  i.department,
  description: i.description,
  contactUrl:  i.contactUrl ?? '',
  phone:       i.phone      ?? '',
  tags:        arr(i.tags),
  recurring:   bool(i.recurring),
  nextDate:    i.nextDate   ?? '',
  active:      'TRUE',
}));

writeCsv('solidarite_initiatives.csv', initHeaders, initRows);

// ============================================================
// 5. EMPLOI
// ============================================================
const jobHeaders = [
  'id','title','company','location','department','remote',
  'type','sector','friendly','salary','description','tags',
  'postedDate','url','featured','cmn','active',
];

const jobRows = jobOffers.map(j => row({
  id:          j.id,
  title:       j.title,
  company:     j.company,
  location:    j.location,
  department:  j.department ?? '',
  remote:      j.remote,
  type:        j.type,
  sector:      j.sector,
  friendly:    arr(j.friendly),
  salary:      j.salary     ?? '',
  description: j.description,
  tags:        arr(j.tags),
  postedDate:  j.postedDate,
  url:         j.url,
  featured:    bool(j.featured),
  cmn:         bool(j.cmn),
  active:      'TRUE',
}));

writeCsv('emploi.csv', jobHeaders, jobRows);

// ============================================================
// 6. SANTE_PSY
// Note : le champ tarif dans le TS s'écrit "tariف" (typo avec ف arabe)
// ============================================================
const psyHeaders = [
  'id','name','title','specialites','langues','location',
  'department','visio','tarif','conventionne','secteur',
  'description','approche','muslimFocus','arabophone',
  'gender','contact','website','tags','active',
];

const psyRows = psyProfiles.map(p => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tarif = (p as any)['tariف'] ?? (p as any)['tarif'] ?? '';
  return row({
    id:           p.id,
    name:         p.name,
    title:        p.title,
    specialites:  arr(p.specialites),
    langues:      arr(p.langues),
    location:     p.location,
    department:   p.department,
    visio:        bool(p.visio),
    tarif:        String(tarif),
    conventionne: bool(p.conventionné),
    secteur:      p.secteur ?? '',
    description:  p.description,
    approche:     arr(p.approche),
    muslimFocus:  bool(p.muslimFocus),
    arabophone:   bool(p.arabophone),
    gender:       p.gender,
    contact:      p.contact  ?? '',
    website:      p.website  ?? '',
    tags:         arr(p.tags),
    active:       'TRUE',
  });
});

writeCsv('sante_psy.csv', psyHeaders, psyRows);

// ============================================================
// 7. SANTE_HIJAMA
// ============================================================
const hijHeaders = [
  'id','name','location','department','tarif','gender',
  'certifie','certifOrg','description','disponibilite',
  'contact','instagram','website','tags','active',
];

const hijRows = hijamaProfiles.map(h => row({
  id:            h.id,
  name:          h.name,
  location:      h.location,
  department:    h.department,
  tarif:         h.tarif         ?? '',
  gender:        h.gender,
  certifie:      bool(h.certifié),
  certifOrg:     h.certifOrg     ?? '',
  description:   h.description,
  disponibilite: h.disponibilité,
  contact:       h.contact       ?? '',
  instagram:     h.instagram     ?? '',
  website:       h.website       ?? '',
  tags:          arr(h.tags),
  active:        'TRUE',
}));

writeCsv('sante_hijama.csv', hijHeaders, hijRows);

// ============================================================
// 8. SANTE_ROQYA
// ============================================================
const roqHeaders = [
  'id','name','title','location','department','visio','tarif',
  'gender','ecole','langues','description','disponibilite',
  'contact','tags','warning','active',
];

const roqRows = roqyaProfiles.map(r => row({
  id:            r.id,
  name:          r.name,
  title:         r.title,
  location:      r.location,
  department:    r.department    ?? '',
  visio:         bool(r.visio),
  tarif:         String(r.tarif  ?? ''),
  gender:        r.gender,
  ecole:         (r as any)['école'] ?? '',
  langues:       arr(r.langues),
  description:   r.description,
  disponibilite: (r as any)['disponibilité'] ?? '',
  contact:       r.contact       ?? '',
  tags:          arr(r.tags),
  warning:       r.warning       ?? '',
  active:        'TRUE',
}));

writeCsv('sante_roqya.csv', roqHeaders, roqRows);

// ============================================================
// 10. PISCINES
// creneaux → "Jour Horaire (Info) | Jour Horaire (Info)"
// ============================================================
const piscHeaders = [
  'id','name','type','adresse','ville','department',
  'creneaux','tarif','phone','website','maps',
  'description','confirmed','lastVerified','tags','note','active',
];

const piscRows = piscines.map(p => {
  const creneauxStr = p.creneaux
    .map(c => `${c.jour} ${c.horaire}${c.info ? ` (${c.info})` : ''}`)
    .join(' | ');
  return row({
    id:           p.id,
    name:         p.name,
    type:         p.type,
    adresse:      p.adresse,
    ville:        p.ville,
    department:   p.department,
    creneaux:     creneauxStr,
    tarif:        p.tarif        ?? '',
    phone:        p.phone        ?? '',
    website:      p.website      ?? '',
    maps:         p.maps         ?? '',
    description:  p.description,
    confirmed:    bool(p.confirmed),
    lastVerified: p.lastVerified ?? '',
    tags:         arr(p.tags),
    note:         p.note         ?? '',
    active:       'TRUE',
  });
});

writeCsv('piscines.csv', piscHeaders, piscRows);

// ============================================================
// 11. LIBRAIRIES
// ============================================================
const libHeaders = [
  'id','name','type','description','adresse','ville',
  'department','horaires','fermeture','phone','website',
  'instagram','maps','specialites','langues','tags',
  'online','livraison','note','featured','active',
];

const libRows = librairies.map(l => row({
  id:          l.id,
  name:        l.name,
  type:        l.type,
  description: l.description,
  adresse:     l.adresse    ?? '',
  ville:       l.ville,
  department:  l.department,
  horaires:    l.horaires   ?? '',
  fermeture:   l.fermeture  ?? '',
  phone:       l.phone      ?? '',
  website:     l.website    ?? '',
  instagram:   l.instagram  ?? '',
  maps:        l.maps       ?? '',
  specialites: arr(l.specialites),
  langues:     arr(l.langues),
  tags:        arr(l.tags),
  online:      bool(l.online),
  livraison:   bool(l.livraison),
  note:        l.note       ?? '',
  featured:    bool(l.featured),
  active:      'TRUE',
}));

writeCsv('librairies.csv', libHeaders, libRows);

// ============================================================
// 12. HAJJ_AGENCES
// ============================================================
const agHeaders = [
  'id','name','location','since','rating','reviews',
  'agree','description','website','phone','tags','active',
];

const agRows = hajjAgences.map(a => row({
  id:          a.id,
  name:        a.name,
  location:    a.location,
  since:       String(a.since),
  rating:      String(a.rating),
  reviews:     String(a.reviews),
  agree:       bool(a.agrée),
  description: a.description,
  website:     a.website ?? '',
  phone:       a.phone   ?? '',
  tags:        arr(a.tags),
  active:      'TRUE',
}));

writeCsv('hajj_agences.csv', agHeaders, agRows);

// ============================================================
// 13. HAJJ_PACKAGES
// ============================================================
const pkgHeaders = [
  'id','agenceId','type','name','stars','duration',
  'departCities','price','priceDouble','priceTriple','priceQuad',
  'distanceMasjidHaram','distanceMasjidNabawi',
  'includes','description','places','placesRestantes','departure','active',
];

const pkgRows = hajjPackages.map(p => row({
  id:                   p.id,
  agenceId:             p.agenceId,
  type:                 p.type,
  name:                 p.name,
  stars:                String(p.stars),
  duration:             String(p.duration),
  departCities:         arr(p.departCities),
  price:                String(p.price),
  priceDouble:          String(p.priceDouble          ?? ''),
  priceTriple:          String(p.priceTriple          ?? ''),
  priceQuad:            String(p.priceQuad            ?? ''),
  distanceMasjidHaram:  String(p.distanceMasjidHaram  ?? ''),
  distanceMasjidNabawi: String(p.distanceMasjidNabawi ?? ''),
  includes:             arr(p.includes),
  description:          p.description,
  places:               String(p.places               ?? ''),
  placesRestantes:      String(p.placesRestantes      ?? ''),
  departure:            p.departure ?? '',
  active:               'TRUE',
}));

writeCsv('hajj_packages.csv', pkgHeaders, pkgRows);

// ─── Résumé ──────────────────────────────────────────────────
console.log('\n📊 Export terminé — fichiers dans scripts/csv/');
console.log('');
console.log('📋 Ordre d\'import recommandé (un CSV = un onglet) :');
console.log('   1. education.csv          → Education (instituts,mosquées)');
console.log('   2. events.csv             → Events');
console.log('   3. solidarite_cagnottes.csv → Solidarite_cagnotte');
console.log('   4. solidarite_initiatives.csv → Solidarite_initiatives');
console.log('   5. emploi.csv             → Emploi');
console.log('   6. sante_psy.csv          → Sante_psy');
console.log('   7. sante_hijama.csv       → sante_hijama');
console.log('   8. sante_roqya.csv        → Sante_roqya');
console.log('   9. piscines.csv           → Piscines');
console.log('  10. librairies.csv         → Librairies');
console.log('  11. hajj_agences.csv       → HajjOmra_agences');
console.log('  12. hajj_packages.csv      → HajjOmra_packages');
console.log('');
console.log('⚠️  Dans chaque onglet : supprimer l\'ancienne ligne 1 (anciens headers)');
console.log('   avant d\'importer → Fichier → Importer → Remplacer les données');
