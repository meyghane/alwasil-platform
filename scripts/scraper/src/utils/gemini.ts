// Gemini API — discover Islamic events via Google Search grounding
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const STRATEGIES = [
  'conférences islamiques Île-de-France événements à venir 2026',
  'maraudes solidarité associations musulmanes Paris banlieue',
  'cours arabe Coran instituts islamiques IDF été 2026',
  'collectes humanitaires associations musulmanes France',
  'événements jeunesse musulmane IdF septembre octobre 2026',
  'portes ouvertes mosquées conférences islamiques France',
  'stage Coran mémorisation rentrée 2026 Île-de-France',
];

export type GeminiEvent = {
  titre: string;
  date_iso: string;
  heure: string;
  ville: string;
  departement: string;
  organisateur: string;
  categorie: string;
  description: string;
  url_source: string;
  gratuit: boolean;
};

async function callGemini(prompt: string): Promise<GeminiEvent[]> {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY est absente');
  // On découvre les modèles réellement disponibles pour cette clé : les noms
  // et accès peuvent varier selon le projet Google et évoluer dans le temps.
  let available: string[] = [];
  try {
    const catalog = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`);
    if (catalog.ok) {
      const data = await catalog.json() as { models?: { name?: string; supportedGenerationMethods?: string[] }[] };
      available = (data.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => (m.name || '').replace(/^models\//, ''))
        .filter(Boolean);
      console.log(`[gemini] ${available.length} modèles accessibles pour cette clé`);
    } else {
      console.warn(`[gemini] catalogue des modèles HTTP ${catalog.status}`);
    }
  } catch (e) { console.warn('[gemini] catalogue inaccessible:', e); }

  // Google peut retirer les anciens modèles pour les nouveaux projets. On
  // privilégie donc les modèles réellement annoncés par le catalogue de la clé.
  const preferred = ['gemini-3.6-flash', 'gemini-3.6-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  const discovered = [
    ...preferred.filter(model => available.includes(model)),
    ...available.filter(model => /flash/i.test(model) && !preferred.includes(model)),
  ];
  // Un seul modèle actif par recherche : tester toute la liste consommait le
  // quota inutilement. Le texte reste un secours pour le même modèle si la
  // recherche Google est momentanément indisponible.
  const activeModel = (discovered.length ? discovered : preferred)[0];
  const models: Array<[string, boolean]> = [[activeModel, true], [activeModel, false]];

  let successfulResponses = 0;
  let lastError = '';
  for (const [model, useSearch] of models) {
    try {
      const body: Record<string, unknown> = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 3000 },
      };
      if (useSearch) body.tools = [{ google_search: {} }];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );

      if (!res.ok) {
        const detail = (await res.text()).slice(0, 180);
        lastError = `${model} (${useSearch ? 'search' : 'texte'}) HTTP ${res.status}: ${detail}`;
        console.warn(`[gemini] ${lastError}`);
        continue;
      }

      successfulResponses++;

      const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = text.match(/\[[\s\S]*?\]/);
      if (!match) continue;

      const events = JSON.parse(match[0]) as GeminiEvent[];
      if (Array.isArray(events) && events.length > 0) {
        console.log(`[gemini] ${model} → ${events.length} events`);
        return events;
      }
    } catch (e) {
      console.warn(`[gemini] ${model} error:`, e);
    }
  }
  if (successfulResponses === 0) {
    throw new Error(`Gemini n'a accepté aucune requête. Dernière erreur: ${lastError || 'réponse inconnue'}`);
  }
  return [];
}

export async function scrapeEventsWithGemini(existingTitles: Set<string>): Promise<GeminiEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const allEvents: GeminiEvent[] = [];
  const seenTitles = new Set(existingTitles);

  // Une recherche à la fois : cela évite les pics RPM et laisse une chance à
  // chaque stratégie de produire des données.
  for (const strategy of STRATEGIES) {
    const existingList = [...seenTitles].slice(0, 20).join(' | ') || 'aucun';
    const prompt = `Aujourd'hui : ${today}. Cherche 5 vrais événements islamiques à venir en France via cette recherche : "${strategy}". Priorité Île-de-France. Ces titres sont déjà dans la base, NE PAS les inclure : ${existingList}. Retourne UNIQUEMENT un tableau JSON valide, sans markdown. Chaque objet : titre (string), date_iso (YYYY-MM-DD, après ${today}), heure (ex: 14h00), ville, departement (2 chiffres), organisateur, categorie (conference/maraude/cours/iftar/webinaire/collecte/autre), description (2 phrases max), url_source (URL réelle), gratuit (boolean).`;
    const events = await callGemini(prompt);
    for (const ev of events) {
        if (!ev.titre || !ev.date_iso) continue;
        if (ev.date_iso < today) continue;
        if (seenTitles.has(ev.titre.toLowerCase())) continue;
        seenTitles.add(ev.titre.toLowerCase());
        allEvents.push(ev);
    }

    // Pause courte entre deux recherches pour respecter le RPM.
    if (strategy !== STRATEGIES[STRATEGIES.length - 1]) await sleep(3000);
  }

  console.log(`[gemini] Total unique events: ${allEvents.length}`);
  return allEvents;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
