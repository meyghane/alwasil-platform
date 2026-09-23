type Fetcher = typeof fetch;
export class GeminiFailure extends Error {
  constructor(public readonly code: string) { super(`Analyse Gemini indisponible : ${code}`); }
}
async function request(fetcher: Fetcher, url: string, key: string, init: RequestInit = {}) {
  let response: Response;
  try { response = await fetcher(url, { ...init, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(15000) }); }
  catch { throw new GeminiFailure('timeout_ou_reseau'); }
  if (!response.ok) throw new GeminiFailure(response.status === 429 ? 'quota_429' : `http_${response.status}`);
  try { return await response.json(); } catch { throw new GeminiFailure('json_invalide'); }
}
export async function analyzeGemini(key: string, parts: Record<string, unknown>[], fetcher: Fetcher = fetch, requestedModel = process.env.GEMINI_MODEL): Promise<Record<string, unknown>> {
  if (!key.trim()) throw new GeminiFailure('cle_absente');
  const catalog = await request(fetcher, 'https://generativelanguage.googleapis.com/v1beta/models', key);
  const models: string[] = (Array.isArray(catalog.models) ? catalog.models : [])
    .filter((model: { supportedGenerationMethods?: string[] }) => model.supportedGenerationMethods?.includes('generateContent'))
    .map((model: { name?: string }) => String(model.name || '').replace(/^models\//, ''));
  const model = requestedModel ? models.find(name => name === requestedModel) : models.find(name => /flash/.test(name) && !/image|audio|live|tts/.test(name));
  if (!model) throw new GeminiFailure('modele_non_disponible');
  const data = await request(fetcher, `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, key, {
    method: 'POST', body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2000 } }),
  });
  const output = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('');
  if (!output?.trim()) throw new GeminiFailure('reponse_vide');
  let result: unknown;
  try { result = JSON.parse(output); } catch { throw new GeminiFailure('json_invalide'); }
  if (!result || typeof result !== 'object' || Array.isArray(result) || !Object.keys(result).length) throw new GeminiFailure('aucune_fiche');
  return result as Record<string, unknown>;
}
