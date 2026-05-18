// GET /api/auto/scrape?cat=CATEGORIE
// Scraper générique pour toutes les catégories du site
// Appelé par Vercel Cron avec des fréquences différentes par catégorie

import { NextRequest, NextResponse } from 'next/server';

const GEMINI_KEY  = process.env.GEMINI_API_KEY || '';
const APPS_URL    = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
const TG_TOKEN    = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT     = process.env.TELEGRAM_CHAT_ID || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

// ── Config par catégorie ─────────────────────────────────────────

type CatConfig = {
  sheetTab:     string;
  expiresIn?:   number;   // jours par défaut si pas de date fournie
  expiryField?: string;   // champ dans la réponse Gemini qui contient la date de fin
  prompt:       string;
  dedup:        string;
};

const CATEGORIES: Record<string, CatConfig> = {

  events: {
    sheetTab: 'soumissions_events',
    prompt: `Find 5 upcoming Islamic events in France (priority Ile-de-France). Return ONLY a JSON array. Each object: titre, date_iso (YYYY-MM-DD, future only), heure, ville, departement, organisateur, categorie (conference/maraude/cours/iftar/webinaire/collecte/autre), description, url_source, gratuit (boolean).`,
    dedup: 'titre',
  },

  cagnottes: {
    sheetTab: 'soumissions_cagnottes',
    expiresIn: 90,
    prompt: `Find 5 active Islamic/Muslim fundraising campaigns in France (LaunchGood, HelloAsso, Leetchi). Look for: humanitarian aid, mosque construction, education, Gaza, Palestine, families. Return ONLY a JSON array. Each object: titre, organisateur, plateforme (launchgood/helloasso/leetchi/autre), objectif_euros (number or null), collecte_euros (number or null), description, url_source, ville, urgence (boolean).`,
    dedup: 'titre',
  },

  librairies: {
    sheetTab: 'soumissions_librairies',
    prompt: `Find 3 Islamic bookshops (librairies islamiques) in France that are NOT already well-known (not Tawhid, not Al-Bouraq). Search different cities: Lyon, Marseille, Lille, Toulouse, Bordeaux, Nantes, Strasbourg, Montpellier, Nice, Rennes. Return ONLY a JSON array. Each object: nom, adresse, ville, departement, horaires, phone, website, description, url_source, langues (array of strings), specialites (array: coran/arabe/enfants/spiritualite/vetements).`,
    dedup: 'nom',
  },

  piscines: {
    sheetTab: 'soumissions_piscines',
    prompt: `Find 3 swimming pools in France that offer burkini-friendly or women-only sessions (creneaux feminins, burkini accepte, maillots couvrants). Search across all France. Return ONLY a JSON array. Each object: nom, adresse, ville, departement, horaires_burkini, tarif, phone, website, description, url_source, type_creneau (burkini/femmes/mixte-couvert).`,
    dedup: 'nom',
  },

  emploi: {
    sheetTab: 'soumissions_emploi',
    expiresIn: 60,
    prompt: `Find 5 real job offers in France that explicitly accept hijab/voile OR mention prayer-friendly environment (priere acceptee, voile ok, inclusif). Search on: indeed.fr, welcometothejungle.com, hellowork.com, leboncoin emploi. Return ONLY a JSON array. Each object: titre_poste, entreprise, ville, departement, type_contrat (CDI/CDD/Freelance/Stage/Alternance), salaire (string or null), description, url_source, voile_accepte (boolean), priere_ok (boolean), teletravail (boolean).`,
    dedup: 'url_source',
  },

  praticiens: {
    sheetTab: 'soumissions_praticiens',
    prompt: `Find 3 Muslim-friendly health practitioners in France: psychologists (psychologue), hijama therapists, or roqya charia practitioners. Return ONLY a JSON array. Each object: nom, specialite (psy/hijama/roqya/naturopathe), ville, departement, adresse, phone, website, description, url_source, langues (array), tarif_approx (string or null), certifie (boolean for hijama).`,
    dedup: 'nom',
  },

  solidarite: {
    sheetTab: 'soumissions_solidarite',
    expiresIn: 60, // fallback si pas de date fournie
    prompt: `Find 5 solidarity initiatives in France from Muslim/Islamic associations: maraudes, food banks (distribution alimentaire), elderly visits, neighborhood help. Return ONLY a JSON array. Each object: titre, association, ville, departement, type (maraude/distribution/visite/aide-juridique/autre), description, date_fin (YYYY-MM-DD or null — the end/expiry date of the initiative), date_prochaine (YYYY-MM-DD or null — next occurrence), recurrence (hebdo/mensuel/ponctuel/permanent), url_source, contact.`,
    dedup: 'titre',
    expiryField: 'date_fin', // utilise la date de fin si fournie par Gemini
  },

  education: {
    sheetTab: 'soumissions_education',
    prompt: `Find 3 Islamic education institutions in France that are NOT already famous (not IESH, not Al-Kalam). Search in: Lyon, Marseille, Bordeaux, Toulouse, Lille, Strasbourg, Nantes. Include: instituts islamiques, cours arabe, halaqas, online Coran teachers. Return ONLY a JSON array. Each object: nom, type (institut/cours-arabe/halaqa/professeur-en-ligne), ville, departement, description, horaires, tarif, url_source, langues (array), niveaux (array: debutant/intermediaire/avance/enfants).`,
    dedup: 'nom',
  },

  hajj: {
    sheetTab: 'soumissions_hajj',
    expiresIn: 365,
    prompt: `Find 3 French travel agencies offering Hajj 2026 or Omra packages. Search for: agence voyage hajj 2026 france, omra pas cher france. Return ONLY a JSON array. Each object: nom_agence, ville, type (hajj/omra/les-deux), prix_a_partir (number in euros), duree_jours (number), description, url_source, phone, inclus (array: vol/hotel/transport/guide/repas), agrement_officiel (boolean).`,
    dedup: 'nom_agence',
  },
};

// ── Helpers ──────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<Record<string, unknown>[]> {
  for (const [model, useSearch] of [
    ['gemini-2.0-flash', true],
    ['gemini-1.5-flash', false],
  ] as [string, boolean][]) {
    try {
      const body: Record<string, unknown> = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      };
      if (useSearch) body.tools = [{ google_search: {} }];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const text  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = text.match(/\[[\s\S]*?\]/);
      if (!match) continue;

      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { continue; }
  }
  return [];
}

async function getExisting(tab: string, field: string): Promise<string[]> {
  if (!APPS_URL) return [];
  try {
    const r = await fetch(`${APPS_URL}?action=listTab&tab=${tab}`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json();
    return ((d.rows || []) as Record<string, string>[])
      .map(row => (row[field] || '').toLowerCase())
      .filter(Boolean);
  } catch { return []; }
}

async function writeToSheet(tab: string, row: Record<string, unknown>): Promise<boolean> {
  if (!APPS_URL) return false;
  try {
    const res = await fetch(APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetTab: tab, row }),
    });
    return res.ok;
  } catch { return false; }
}

function notify(msg: string) {
  if (!TG_TOKEN || !TG_CHAT) return;
  fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT, text: msg }),
  }).catch(() => {});
}

// ── Handler ──────────────────────────────────────────────────────

export async function GET(req: NextRequest) {

  const cat = req.nextUrl.searchParams.get('cat') || 'events';
  const config = CATEGORIES[cat];
  if (!config) return NextResponse.json({ error: `Catégorie inconnue: ${cat}` }, { status: 400 });

  // 1. Charger les doublons existants
  const existing = await getExisting(config.sheetTab, config.dedup);

  // 2. Construire le prompt avec déduplication
  const dedupNote = existing.length
    ? ` Do NOT include these already in database: ${existing.slice(0, 20).join(' | ')}.`
    : '';
  const fullPrompt = config.prompt + dedupNote;

  // 3. Appeler Gemini
  const items = await callGemini(fullPrompt);
  if (items.length === 0) {
    return NextResponse.json({ ok: true, cat, found: 0, written: 0 });
  }

  // 4. Filtrer les doublons
  const filtered = items.filter(item => {
    const val = String(item[config.dedup] || '').toLowerCase();
    return val && !existing.includes(val);
  });

  // 5. Écrire dans le Sheet
  const today    = new Date().toISOString().split('T')[0];
  const default_expiry = config.expiresIn
    ? new Date(Date.now() + config.expiresIn * 86400000).toISOString().split('T')[0]
    : null;

  let written = 0;
  for (let i = 0; i < filtered.length; i++) {
    const item = filtered[i];

    // Expiration : utilise la date fournie par Gemini si dispo, sinon le défaut
    let expiresAt = default_expiry;
    if (config.expiryField) {
      const fromData = String(item[config.expiryField] || '');
      if (fromData && fromData > today) expiresAt = fromData;
    }

    const row: Record<string, unknown> = {
      ...item,
      id:         `${cat}-${Date.now()}-${i}`,
      status:     'à vérifier',
      soumis_par: 'Wassil',
      soumis_le:  new Date().toISOString(),
      ...(expiresAt ? { expires_at: expiresAt } : {}),
    };
    const ok = await writeToSheet(config.sheetTab, row);
    if (ok) written++;
  }

  // 6. Telegram
  if (written > 0) {
    const sample = filtered.slice(0, 2)
      .map(e => `• ${e[config.dedup] || ''}`)
      .join('\n');
    notify(`🤖 Wassil [${cat}] : ${written} nouvelle(s) fiche(s)\n${sample}\n\n👉 https://al-wasil.fr/admin/soumissions`);
  }

  return NextResponse.json({ ok: true, cat, found: items.length, written, today });
}
