// ============================================================
// src/lib/sheets.ts — Google Sheets comme base de données
// Lit les données depuis le Google Sheet Al-Wasil via l'API publique
// Cache : 1h via Next.js ISR (revalidate)
// ============================================================

// Sheet public "AL WASIL - BDD public" — source de vérité pour le site
const SHEET_ID = '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU';
const CACHE_SECONDS = 3600; // 1 heure

// ── Types ──────────────────────────────────────────────────

export type Mosquee = {
  id_osm: string;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement: string;
  territoire: string;
  latitude: number;
  longitude: number;
  website: string;
  telephone: string;
  horaires: string;
  instagram: string;
  facebook: string;
  // Colonnes cours (O-T)
  has_courses: boolean;
  cours_types: string[];       // ['coran','arabe','tajwid',...]
  cours_audience: string[];    // ['hommes','femmes','enfants','mixte']
  cours_format: string;        // 'presentiel' | 'distanciel' | 'hybride'
  cours_description: string;
  cours_verified: boolean;
};

export type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  date_debut: string;
  date_fin: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  adresse: string;
  ville: string;
  departement: string;
  organisateur: string;
  organisateur_url: string;
  description: string;
  tags: string[];
  format: 'presentiel' | 'enligne' | 'hybride';
  url_inscription: string;
  gratuit: boolean;
  prix: string;
  facebook_event_id: string;
  mosquee_id: string;
  source: 'manual' | 'facebook' | 'scraped';
  featured: boolean;
};

// ── Fonction générique de fetch ─────────────────────────────

async function fetchSheet(sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  const res = await fetch(url, {
    next: { revalidate: CACHE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Erreur Google Sheets: ${res.status} pour l'onglet "${sheetName}"`);
  }

  const text = await res.text();

  // Google retourne du JS pas du JSON : google.visualization.Query.setResponse({...})
  const jsonStr = text.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '');
  const json = JSON.parse(jsonStr);

  if (!json.table || !json.table.rows) return [];

  // Extraire les valeurs (cols = headers, rows = données)
  return json.table.rows.map((row: any) =>
    (row.c || []).map((cell: any) => (cell?.v != null ? String(cell.v) : ''))
  );
}

// ── Mosquées ────────────────────────────────────────────────

export async function getMosquees(): Promise<Mosquee[]> {
  try {
    const rows = await fetchSheet('Mosquées');

    return rows
      .filter(row => row[0]) // ignore lignes vides
      .map(row => ({
        id_osm:           row[0]  || '',
        nom:              row[1]  || '',
        adresse:          row[2]  || '',
        ville:            row[3]  || '',
        code_postal:      row[4]  || '',
        departement:      row[5]  || '',
        territoire:       row[6]  || '',
        latitude:         parseFloat(row[7])  || 0,
        longitude:        parseFloat(row[8])  || 0,
        website:          row[9]  || '',
        telephone:        row[10] || '',
        horaires:         row[11] || '',
        instagram:        row[12] || '',
        facebook:         row[13] || '',
        // Colonnes cours
        has_courses:      row[14]?.toUpperCase() === 'TRUE',
        cours_types:      row[15] ? row[15].split(',').map(s => s.trim()).filter(Boolean) : [],
        cours_audience:   row[16] ? row[16].split(',').map(s => s.trim()).filter(Boolean) : [],
        cours_format:     row[17] || 'presentiel',
        cours_description:row[18] || '',
        cours_verified:   row[19]?.toUpperCase() === 'TRUE',
      }));
  } catch (e) {
    console.error('[sheets] getMosquees error:', e);
    return [];
  }
}

// Uniquement les mosquées avec des cours
export async function getMosqueesWithCourses(): Promise<Mosquee[]> {
  const all = await getMosquees();
  return all.filter(m => m.has_courses);
}

// ── Événements ──────────────────────────────────────────────

export async function getEvenements(): Promise<Evenement[]> {
  try {
    const rows = await fetchSheet('Events');

    const now = new Date();

    return rows
      .filter(row => row[0] && row[3]) // doit avoir id et date
      .map(row => ({
        id:               row[0]  || '',
        titre:            row[1]  || '',
        categorie:        row[2]  || 'autre',
        date_debut:       row[3]  || '',
        date_fin:         row[4]  || '',
        heure_debut:      row[5]  || '',
        heure_fin:        row[6]  || '',
        lieu:             row[7]  || '',
        adresse:          row[8]  || '',
        ville:            row[9]  || '',
        departement:      row[10] || '',
        organisateur:     row[11] || '',
        organisateur_url: row[12] || '',
        description:      row[13] || '',
        tags:             row[14] ? row[14].split(',').map(s => s.trim()).filter(Boolean) : [],
        format:           (row[15] || 'presentiel') as 'presentiel' | 'enligne' | 'hybride',
        url_inscription:  row[16] || '',
        gratuit:          row[17]?.toUpperCase() !== 'FALSE',
        prix:             row[18] || '',
        facebook_event_id:row[19] || '',
        mosquee_id:       row[20] || '',
        source:           (row[21] || 'manual') as 'manual' | 'facebook' | 'scraped',
        featured:         row[22]?.toUpperCase() === 'TRUE',
      }));
  } catch (e) {
    console.error('[sheets] getEvenements error:', e);
    return [];
  }
}

// Uniquement les événements futurs
export async function getEvenementsAVenir(): Promise<Evenement[]> {
  const all = await getEvenements();
  const now = new Date();
  return all
    .filter(e => e.date_debut && new Date(e.date_debut) >= now)
    .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime());
}

// ── Cagnottes ───────────────────────────────────────────────

export type Cagnotte = {
  id: string;
  titre: string;
  organisateur: string;
  description: string;
  url: string;
  image_url: string;
  categorie: string;
  ville: string;
  departement: string;
  date_debut: string;
  date_fin: string;
  objectif: number;
  montant_collecte: number;
  nb_donateurs: number;
  pourcentage: number;
  is_active: boolean;
  source: string;
  derniere_maj: string;
};

export async function getCagnottes(): Promise<Cagnotte[]> {
  try {
    const rows = await fetchSheet('Cagnottes');

    return rows
      .filter(row => row[0] && row[4]) // doit avoir id et url
      .map(row => ({
        id:               row[0]  || '',
        titre:            row[1]  || '',
        organisateur:     row[2]  || '',
        description:      row[3]  || '',
        url:              row[4]  || '',
        image_url:        row[5]  || '',
        categorie:        row[6]  || 'autre',
        ville:            row[7]  || '',
        departement:      row[8]  || '',
        date_debut:       row[9]  || '',
        date_fin:         row[10] || '',
        objectif:         parseFloat(row[11]) || 0,
        montant_collecte: parseFloat(row[12]) || 0,
        nb_donateurs:     parseInt(row[13])   || 0,
        pourcentage:      parseFloat(row[14]) || 0,
        is_active:        row[15]?.toUpperCase() !== 'FALSE', // actif par défaut
        source:           row[16] || '',
        derniere_maj:     row[17] || '',
      }));
  } catch (e) {
    console.error('[sheets] getCagnottes error:', e);
    return [];
  }
}

// Uniquement les cagnottes actives
export async function getCagnottesActives(): Promise<Cagnotte[]> {
  const all = await getCagnottes();
  return all
    .filter(c => c.is_active)
    .sort((a, b) => b.montant_collecte - a.montant_collecte);
}

// ── Piscines ─────────────────────────────────────────────────

export type PiscineSheet = {
  id: string;
  name: string;
  type: 'municipale' | 'privee' | 'associative';
  adresse: string;
  ville: string;
  department: string;
  creneaux: { jour: string; horaire: string; info?: string }[];
  tarif: string;
  phone: string;
  website: string;
  maps: string;
  description: string;
  confirmed: boolean;
  lastVerified: string;
  tags: string[];
  note: string;
  active: boolean;
};

function parseCreneaux(raw: string): { jour: string; horaire: string; info?: string }[] {
  if (!raw) return [];
  return raw.split('|').map(s => {
    s = s.trim();
    const infoMatch = s.match(/\(([^)]+)\)$/);
    const info = infoMatch ? infoMatch[1] : undefined;
    const withoutInfo = s.replace(/\s*\([^)]+\)$/, '').trim();
    const parts = withoutInfo.split(/\s+/);
    const horaire = parts.pop() ?? '';
    const jour = parts.join(' ');
    return { jour, horaire, ...(info ? { info } : {}) };
  });
}

export async function getPiscines(): Promise<PiscineSheet[]> {
  try {
    const rows = await fetchSheet('Piscines');
    return rows
      .filter(row => row[0] && row[16]?.toUpperCase() !== 'FALSE')
      .map(row => ({
        id:           row[0]  || '',
        name:         row[1]  || '',
        type:         (row[2] || 'municipale') as PiscineSheet['type'],
        adresse:      row[3]  || '',
        ville:        row[4]  || '',
        department:   row[5]  || '',
        creneaux:     parseCreneaux(row[6]),
        tarif:        row[7]  || '',
        phone:        row[8]  || '',
        website:      row[9]  || '',
        maps:         row[10] || '',
        description:  row[11] || '',
        confirmed:    row[12]?.toUpperCase() === 'TRUE',
        lastVerified: row[13] || '',
        tags:         row[14] ? row[14].split(',').map(s => s.trim()).filter(Boolean) : [],
        note:         row[15] || '',
        active:       true,
      }));
  } catch (e) {
    console.error('[sheets] getPiscines error:', e);
    return [];
  }
}

// ── Librairies ───────────────────────────────────────────────

export type LibrairieSheet = {
  id: string;
  name: string;
  type: 'physique' | 'en-ligne' | 'mixte';
  description: string;
  adresse: string;
  ville: string;
  department: string;
  horaires: string;
  fermeture: string;
  phone: string;
  website: string;
  instagram: string;
  maps: string;
  specialites: string[];
  langues: string[];
  tags: string[];
  online: boolean;
  livraison: boolean;
  note: string;
  featured: boolean;
};

export async function getLibrairies(): Promise<LibrairieSheet[]> {
  try {
    const rows = await fetchSheet('Librairies');
    return rows
      .filter(row => row[0] && row[20]?.toUpperCase() !== 'FALSE')
      .map(row => ({
        id:          row[0]  || '',
        name:        row[1]  || '',
        type:        (row[2] || 'physique') as LibrairieSheet['type'],
        description: row[3]  || '',
        adresse:     row[4]  || '',
        ville:       row[5]  || '',
        department:  row[6]  || '',
        horaires:    row[7]  || '',
        fermeture:   row[8]  || '',
        phone:       row[9]  || '',
        website:     row[10] || '',
        instagram:   row[11] || '',
        maps:        row[12] || '',
        specialites: row[13] ? row[13].split(',').map(s => s.trim()).filter(Boolean) : [],
        langues:     row[14] ? row[14].split(',').map(s => s.trim()).filter(Boolean) : [],
        tags:        row[15] ? row[15].split(',').map(s => s.trim()).filter(Boolean) : [],
        online:      row[16]?.toUpperCase() === 'TRUE',
        livraison:   row[17]?.toUpperCase() === 'TRUE',
        note:        row[18] || '',
        featured:    row[19]?.toUpperCase() === 'TRUE',
      }));
  } catch (e) {
    console.error('[sheets] getLibrairies error:', e);
    return [];
  }
}
