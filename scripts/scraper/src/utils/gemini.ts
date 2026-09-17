// Gemini API — discover Islamic events via Google Search grounding
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const DEPARTMENTS = ['75', '92', '93', '94', '77', '78', '95'] as const;
const THEMES = ['conférences et rencontres musulmanes', 'maraudes et actions solidaires', 'cours arabe et Coran', 'collectes humanitaires', 'événements jeunesse', 'portes ouvertes et séminaires', 'webinaires islamiques'];

export function prioritizeDepartments(counts: Record<string, number>): string[] {
  return [...DEPARTMENTS].sort((a, b) => (counts[a] ?? 0) - (counts[b] ?? 0));
}

export function normalizeCampaignUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['helloasso.com', 'www.helloasso.com', 'launchgood.com', 'www.launchgood.com'].includes(url.hostname.toLowerCase())) return null;
    return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
  } catch { return null; }
}

export class GeminiQuotaError extends Error {}
export class BudgetExhaustedError extends Error {}
export type UsageRecorder = (kind: 'call' | 'tokens', amount: number) => void;
let cachedModel: string | null = null;

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

export type GeminiCagnotte = {
  titre: string;
  organisateur: string;
  plateforme: string;
  categorie: string;
  pays: string;
  description: string;
  url_source: string;
};

async function callGemini<T>(prompt: string, recordUsage: UsageRecorder, canCall: () => boolean): Promise<T[]> {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY est absente');
  // On découvre les modèles réellement disponibles pour cette clé : les noms
  // et accès peuvent varier selon le projet Google et évoluer dans le temps.
  let available: string[] = [];
  if (!cachedModel) try {
    const catalog = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`);
    if (catalog.status === 429) throw new GeminiQuotaError('Quota Gemini atteint lors du catalogue des modèles.');
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
  } catch (e) {
    if (e instanceof GeminiQuotaError) throw e;
    console.warn('[gemini] catalogue inaccessible:', e);
  }

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
  const activeModel = cachedModel || (discovered.length ? discovered : preferred)[0];
  cachedModel = activeModel;
  const models: Array<[string, boolean]> = [[activeModel, true], [activeModel, false]];

  let successfulResponses = 0;
  let lastError = '';
  for (const [model, useSearch] of models) {
    try {
      if (!canCall()) throw new BudgetExhaustedError('Budget quotidien atteint.');
      const body: Record<string, unknown> = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 3000 },
      };
      if (useSearch) body.tools = [{ google_search: {} }];

      recordUsage('call', 1);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );

      if (res.status === 429) throw new GeminiQuotaError('Quota Gemini atteint : arrêt du run sans nouvelle tentative.');

      const raw = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[]; usageMetadata?: { totalTokenCount?: number } };
      recordUsage('tokens', raw.usageMetadata?.totalTokenCount ?? 0);

      if (!res.ok) {
        lastError = `${model} (${useSearch ? 'search' : 'texte'}) HTTP ${res.status}`;
        console.warn(`[gemini] ${lastError}`);
        continue;
      }

      successfulResponses++;

      const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = text.match(/\[[\s\S]*?\]/);
      if (!match) continue;

      const events = JSON.parse(match[0]) as T[];
      if (Array.isArray(events) && events.length > 0) {
        console.log(`[gemini] ${model} → ${events.length} events`);
        return events;
      }
    } catch (e) {
      if (e instanceof GeminiQuotaError || e instanceof BudgetExhaustedError) throw e;
      console.warn(`[gemini] ${model} error:`, e);
    }
  }
  if (successfulResponses === 0) {
    throw new Error(`Gemini n'a accepté aucune requête. Dernière erreur: ${lastError || 'réponse inconnue'}`);
  }
  return [];
}

export async function scrapeEventsWithGemini(existingKeys: Set<string>, departmentCounts: Record<string, number>, maxCalls: number, recordUsage: UsageRecorder, canCall: () => boolean, onQuota: () => void): Promise<GeminiEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const allEvents: GeminiEvent[] = [];
  const seenKeys = new Set(existingKeys);

  // Une recherche à la fois : cela évite les pics RPM et laisse une chance à
  // chaque stratégie de produire des données.
  const departments = prioritizeDepartments(departmentCounts);
  for (let index = 0; index < departments.length && index < maxCalls; index++) {
    const department = departments[index];
    const strategy = `${THEMES[index]} département ${department} prochains événements confirmés`;
    const existingList = [...seenKeys].slice(-20).join(' ; ') || 'aucun';
    const prompt = `Aujourd'hui : ${today}. Cherche 5 vrais événements islamiques à venir en France via cette recherche : "${strategy}". Priorité au département ${department}. Ces combinaisons titre/ville/date sont déjà dans la base, ne les répète pas : ${existingList}. Retourne UNIQUEMENT un tableau JSON valide, sans markdown. Chaque objet : titre (string), date_iso (YYYY-MM-DD, après ${today}), heure (ex: 14h00), ville, departement (2 chiffres), organisateur, categorie (conference/maraude/cours/iftar/webinaire/collecte/autre), description (2 phrases max), url_source (URL réelle), gratuit (boolean).`;
    let events: GeminiEvent[];
    try {
      events = await callGemini<GeminiEvent>(prompt, recordUsage, canCall);
    } catch (error) {
      if (error instanceof GeminiQuotaError) { onQuota(); break; }
      if (error instanceof BudgetExhaustedError) break;
      throw error;
    }
    for (const ev of events) {
        if (!ev.titre || !ev.date_iso) continue;
        if (ev.date_iso < today) continue;
        const key = `${ev.titre.trim().toLowerCase()}|${(ev.ville || '').trim().toLowerCase()}|${ev.date_iso}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        allEvents.push(ev);
    }

    // Pause courte entre deux recherches pour respecter le RPM.
    if (index < departments.length - 1 && index < maxCalls - 1) await sleep(3000);
  }

  console.log(`[gemini] Total unique events: ${allEvents.length}`);
  return allEvents;
}

export async function scrapeCagnottesWithGemini(existingUrls: Set<string>, maxCalls: number, recordUsage: UsageRecorder, canCall: () => boolean, onQuota: () => void): Promise<GeminiCagnotte[]> {
  const queries = [
    'site:helloasso.com collecte mosquée projet association musulmane France',
    'site:launchgood.com Palestine orphelins aide humanitaire campagne en cours',
    'site:helloasso.com Palestine solidarité aide familles campagne active',
  ];
  const discovered: GeminiCagnotte[] = [];
  const seen = new Set(existingUrls);
  for (const query of queries.slice(0, maxCalls)) {
    const prompt = `Aujourd'hui : ${new Date().toISOString().slice(0, 10)}. Trouve des cagnottes encore actives avec page de collecte publique pour : ${query}. N'invente aucun lien. Exclure ces URL déjà présentes : ${[...seen].slice(-15).join(' ; ') || 'aucune'}. Retourne uniquement un tableau JSON de maximum 4 objets avec titre, organisateur, plateforme, categorie (palestine/mosquee/orphelins/urgence/famille/education/afrique/eau-puits), pays, description, url_source. Aucun montant, aucun statut vérifié inventé.`;
    let candidates: GeminiCagnotte[];
    try { candidates = await callGemini<GeminiCagnotte>(prompt, recordUsage, canCall); }
    catch (error) {
      if (error instanceof GeminiQuotaError) { onQuota(); break; }
      if (error instanceof BudgetExhaustedError) break;
      throw error;
    }
    for (const candidate of candidates) {
      if (!candidate.titre || !candidate.url_source) continue;
      const normalized = normalizeCampaignUrl(candidate.url_source);
      if (!normalized) continue;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      discovered.push({ ...candidate, url_source: normalized });
    }
  }
  return discovered;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
