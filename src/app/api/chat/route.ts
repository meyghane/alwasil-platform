// Chatbot Wasil - Gemini Flash avec sélection dynamique du modèle disponible
// Clé API gratuite : https://aistudio.google.com/app/apikey → GEMINI_API_KEY dans .env.local + Vercel

const SYSTEM_PROMPT = `Tu es "Wasil", l'assistant d'Al-Wasil, la plateforme communautaire pour les musulmans de France (surtout Île-de-France).

Tu parles uniquement français. Tu es bienveillant, concis et bien informé sur les ressources communautaires.

## Sections du site
- /education - Instituts islamiques, cours d'arabe, Coran, Tajwid, sciences islamiques
- /events - Conférences, maraudes, iftars, cours, webinaires à venir
- /solidarity - Initiatives solidaires, maraudes, cagnottes (Gaza, mosquées, familles...)
- /jobs - Offres d'emploi avec voile accepté / prière OK
- /justice - Droits des musulmans, avocats, FAQ discrimination, ARCOM
- /sante - Psychologues, hijama certifiés, roqya, médecins bienveillants
- /piscines - Créneaux burkini en Île-de-France
- /hajj - Offres Hajj 2027 et Omra 2026-2027, comparatif de packages
- /librairies - Librairies islamiques en France

## Règles
- Redirige toujours vers la section pertinente : [Voir les piscines](/piscines)
- 3-4 phrases max par réponse, sauf question détaillée
- Ne génère jamais de fatwas. Pour questions religieuses complexes : "Consulte un imam de confiance."
- Tu peux utiliser inshallah, barakallah naturellement`;

let cachedGeminiModel: string | null = null;

async function chooseGeminiModel(key: string): Promise<string> {
 if (cachedGeminiModel) return cachedGeminiModel;
 const preferred = ['gemini-3.6-flash', 'gemini-3.6-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
 try {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(8000) });
  const catalog = await response.json() as { models?: Array<{ name?: string; supportedGenerationMethods?: string[] }> };
  const available = (catalog.models || [])
   .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
   .map(model => (model.name || '').replace(/^models\//, ''))
   .filter(Boolean);
  cachedGeminiModel = preferred.find(model => available.includes(model)) || available.find(model => /flash/i.test(model)) || null;
 } catch (error) {
  console.warn('[chat] Gemini model catalog unavailable:', error instanceof Error ? error.message : 'unknown error');
 }
 return cachedGeminiModel || 'gemini-2.5-flash';
}

 export async function POST(request: Request) {
 const { messages } = await request.json();

 const apiKey = process.env.GEMINI_API_KEY;
 if (!apiKey) {
 return Response.json({ error: 'GEMINI_API_KEY non configurée dans .env.local et Vercel' }, { status: 500 });
 }

 // Format Gemini : "model" au lieu de "assistant"
 const contents = messages.map((m: { role: string; content: string }) => ({
 role: m.role === 'assistant' ? 'model' : 'user',
 parts: [{ text: m.content }],
 }));

 const body = {
 system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
 contents,
 generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
 };

 const res = await fetch(
 `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(await chooseGeminiModel(apiKey))}:streamGenerateContent?key=${encodeURIComponent(apiKey)}&alt=sse`,
 { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
 );

 if (!res.ok) {
 const err = await res.text();
 console.error('[chat] Gemini error:', err);
 return Response.json({ error: 'Le service de recherche est temporairement indisponible.' }, { status: 502 });
 }

 // Transposer SSE Gemini → notre format SSE { text }
 const encoder = new TextEncoder();
 const readable = new ReadableStream({
 async start(controller) {
 const reader = res.body!.getReader();
 const decoder = new TextDecoder();
 let buffer = '';

 while (true) {
 const { done, value } = await reader.read();
 if (done) break;

 buffer += decoder.decode(value, { stream: true });
 const lines = buffer.split('\n');
 buffer = lines.pop() ?? '';

 for (const line of lines) {
 if (!line.startsWith('data: ')) continue;
 const jsonStr = line.slice(6).trim();
 if (!jsonStr || jsonStr === '[DONE]') continue;
 try {
 const parsed = JSON.parse(jsonStr);
 const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
 if (text) {
 controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
 }
 } catch { /* chunk malformé, ignoré */ }
 }
 }

 controller.enqueue(encoder.encode('data: [DONE]\n\n'));
 controller.close();
 },
 });

 return new Response(readable, {
 headers: {
 'Content-Type': 'text/event-stream',
 'Cache-Control': 'no-cache',
 Connection: 'keep-alive',
 },
 });
}
