// Gemini API — discover Islamic events via Google Search grounding
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const STRATEGIES = [
  'conférences islamiques Île-de-France juillet août 2026',
  'maraudes solidarité associations musulmanes Paris banlieue',
  'cours arabe Coran instituts islamiques IDF été 2026',
  'collectes humanitaires associations musulmanes France',
  'événements jeunesse musulmane IdF août septembre 2026',
  'portes ouvertes mosquées conférences islamiques France',
  'stage Coran mémorisation été 2026 Île-de-France',
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
  const models: Array<[string, boolean]> = [
    ['gemini-2.0-flash', true],
    ['gemini-1.5-flash', true],
    ['gemini-1.5-flash', false],
  ];

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

      if (!res.ok) { console.warn(`[gemini] ${model} HTTP ${res.status}`); continue; }

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
  return [];
}

export async function scrapeEventsWithGemini(existingTitles: Set<string>): Promise<GeminiEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const allEvents: GeminiEvent[] = [];
  const seenTitles = new Set(existingTitles);

  // Run all strategies in parallel (3 at a time)
  for (let i = 0; i < STRATEGIES.length; i += 3) {
    const batch = STRATEGIES.slice(i, i + 3);
    const results = await Promise.all(batch.map(async (strategy) => {
      const existingList = [...seenTitles].slice(0, 20).join(' | ') || 'aucun';
      const prompt = `Aujourd'hui : ${today}. Cherche 5 vrais événements islamiques à venir en France via cette recherche : "${strategy}". Priorité Île-de-France. Ces titres sont déjà dans la base, NE PAS les inclure : ${existingList}. Retourne UNIQUEMENT un tableau JSON valide, sans markdown. Chaque objet : titre (string), date_iso (YYYY-MM-DD, après ${today}), heure (ex: 14h00), ville, departement (2 chiffres), organisateur, categorie (conference/maraude/cours/iftar/webinaire/collecte/autre), description (2 phrases max), url_source (URL réelle), gratuit (boolean).`;
      return callGemini(prompt);
    }));

    for (const events of results) {
      for (const ev of events) {
        if (!ev.titre || !ev.date_iso) continue;
        if (ev.date_iso < today) continue;
        if (seenTitles.has(ev.titre.toLowerCase())) continue;
        seenTitles.add(ev.titre.toLowerCase());
        allEvents.push(ev);
      }
    }

    // Respect rate limits
    if (i + 3 < STRATEGIES.length) await sleep(2000);
  }

  console.log(`[gemini] Total unique events: ${allEvents.length}`);
  return allEvents;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
