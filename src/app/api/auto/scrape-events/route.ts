// GET /api/auto/scrape-events
// Appelé automatiquement par Vercel Cron toutes les 6h
// Cherche des événements islamiques via Gemini + Google Search
// → écrit dans soumissions_events → notifie Telegram

import { NextRequest, NextResponse } from 'next/server';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
// Telegram removed — notifications via email digest (GitHub Actions)
const CRON_SECRET = process.env.CRON_SECRET || '';

const STRATEGIES = [
 'conferences islamiques Ile-de-France 2026',
 'maraudes solidarite associations musulmanes Paris banlieue',
 'cours arabe Coran instituts islamiques IdF 2026',
 'collectes humanitaires associations musulmanes France',
 'iftars soirees islamiques mosquees Ile-de-France',
 'evenements jeunesse musulmane IdF 2026',
 'portes ouvertes mosquees conferences islamiques France',
];

type GeminiEvent = {
 titre: string; date_iso: string; heure: string;
 ville: string; departement: string; organisateur: string;
 categorie: string; description: string; url_source: string;
 gratuit: boolean;
};

async function callGemini(prompt: string): Promise<GeminiEvent[]> {
 // Essaie d'abord gemini-2.0-flash avec Google Search
 for (const [model, useSearch] of [
 ['gemini-2.0-flash', true],
 ['gemini-1.5-flash', true],
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
 const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
 const match = text.match(/\[[\s\S]*?\]/);
 if (!match) continue;

 const events = JSON.parse(match[0]) as GeminiEvent[];
 if (Array.isArray(events) && events.length > 0) return events;
 } catch { continue; }
 }
 return [];
}

export async function GET(req: NextRequest) {
 // Auth : Vercel Cron envoie le secret en header Authorization
 const auth = req.headers.get('authorization');
 if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
 return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
 }

 const today = new Date().toISOString().split('T')[0];
 const strategy = STRATEGIES[new Date().getDay()];

 // 1. Lire les events déjà en base (pour éviter les doublons)
 let existingTitles: string[] = [];
 if (APPS_URL) {
 try {
 const r = await fetch(`${APPS_URL}?action=listTab&tab=soumissions_events`, { cache: 'no-store' });
 if (r.ok) {
 const d = await r.json();
 existingTitles = ((d.rows || []) as Record<string, string>[])
 .map(row => (row.titre || '').toLowerCase())
 .filter(Boolean);
 }
 } catch { /* Sheet vide ou pas encore configuré */ }
 }

 // 2. Construire le prompt
 const prompt = `Today is ${today}. Search for 5 real upcoming Islamic events in France using this angle: "${strategy}". Priority: Ile-de-France region. These titles are already in our database, do NOT include them: ${existingTitles.slice(0, 30).join(' | ') || 'none yet'}. Return ONLY a valid JSON array, no markdown, no text outside the array. Each object must have exactly these keys: titre (string), date_iso (string YYYY-MM-DD, must be after ${today}), heure (string like 14h00), ville (string), departement (string, 2 digits like 75 or 93), organisateur (string), categorie (one of: conference/maraude/cours/iftar/webinaire/collecte/autre), description (string, 2 sentences max), url_source (string, real URL), gratuit (boolean).`;

 // 3. Appeler Gemini
 const events = await callGemini(prompt);
 if (events.length === 0) {
 return NextResponse.json({ ok: true, found: 0, written: 0, strategy, note: 'Gemini returned no events' });
 }

 // 4. Filtrer : garder seulement les futurs non-doublons
 const filtered = events.filter(e =>
 e.titre && e.date_iso >= today &&
 !existingTitles.includes(e.titre.toLowerCase())
 );

 // 5. Écrire dans le Sheet via Apps Script
 let written = 0;
 for (let i = 0; i < filtered.length; i++) {
 const ev = filtered[i];
 if (!APPS_URL) break;
 try {
 await fetch(APPS_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 sheetTab: 'soumissions_events',
 row: {
 id: `evt-${Date.now()}-${i}`,
 titre: ev.titre,
 date_iso: ev.date_iso,
 heure: ev.heure || '',
 ville: ev.ville || '',
 departement: ev.departement || '',
 organisateur: ev.organisateur || '',
 categorie: ev.categorie || 'autre',
 description: ev.description || '',
 url_source: ev.url_source || '',
 gratuit: ev.gratuit,
 status: 'à vérifier',
 soumis_par: 'Wassil',
 soumis_le: new Date().toISOString(),
 },
 }),
 });
 written++;
 } catch { continue; }
 }

 // 6. Log dans SearchLog
 if (APPS_URL) {
 fetch(APPS_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 sheetTab: 'SearchLog',
 row: {
 DATE: new Date().toISOString(),
 QUERY: strategy,
 STRATEGY: new Date().toLocaleDateString('fr-FR', { weekday: 'long' }),
 EVENTS_FOUND: written,
 URLS: filtered.map(e => e.url_source).join(', '),
 },
 }),
 }).catch(() => {});
 }

 return NextResponse.json({ ok: true, found: events.length, written, strategy, today });
}
