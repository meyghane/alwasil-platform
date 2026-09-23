import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { db } from '@/db';
import { items, moderationLog } from '@/db/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { publicationIssues, confirmPublicPublication } from '@/lib/publication';
import { telegramStore, unsentReviewIds } from '@/lib/telegram-delivery';
import { ingestManualSubmission } from '@/lib/submission-ingest';
import { prepareTelegramSubmission } from '@/lib/telegram-ingest';
import { answerReviewCallback, closeReviewButtons, isAuthorizedReviewAction, moderationChatId, sendReview } from '@/lib/telegram-moderation';
import { withoutEmDashes } from '@/lib/typography';
import { revalidatePath } from 'next/cache';
import { itemEventDate } from '@/lib/event-dates';
import { assessHajjOfferReadiness } from '@/lib/hajj-offer-quality';

type TelegramMessage = {
  chat?: { id?: number }; from?: { id?: number };
  text?: string; caption?: string;
  photo?: Array<{ file_id: string }>;
  document?: { file_id: string; mime_type?: string };
  voice?: { file_id: string }; audio?: { file_id: string };
};
type TelegramCallback = {
  id: string; data?: string; from?: { id?: number };
  message?: { message_id?: number; chat?: { id?: number } };
};

const CATEGORY_PATH: Record<string, string> = {
  event: '/events', institute: '/education', solidarity: '/solidarity', job: '/jobs',
  library: '/librairies', pool: '/piscines', health: '/sante', hajj: '/hajj',
};

function secretFor(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function validSecret(expected: string, actual: string | null): boolean {
  if (!actual) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function sendMessage(token: string, chatId: string, text: string): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) console.error('[telegram] sendMessage status:', response.status);
}

async function downloadMedia(token: string, msg: TelegramMessage): Promise<{ data: string; mime: string } | null> {
  const fileId = msg.photo?.at(-1)?.file_id || msg.document?.file_id || msg.voice?.file_id || msg.audio?.file_id;
  if (!fileId) return null;
  const fileResponse = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`, { signal: AbortSignal.timeout(8000) });
  if (!fileResponse.ok) throw new Error('Fichier Telegram inaccessible');
  const fileInfo = await fileResponse.json() as { result?: { file_path?: string; file_size?: number } };
  const path = fileInfo.result?.file_path;
  if (!path || path.includes('..') || (fileInfo.result?.file_size ?? 0) > 8_000_000) throw new Error('Fichier absent ou trop volumineux');
  const response = await fetch(`https://api.telegram.org/file/bot${token}/${path}`, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Téléchargement Telegram impossible');
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > 8_000_000) throw new Error('Fichier trop volumineux');
  const mime = msg.photo ? 'image/jpeg' : msg.voice ? 'audio/ogg' : msg.document?.mime_type || response.headers.get('content-type') || 'audio/mpeg';
  if (!/^image\/(jpeg|png|webp)$|^audio\/(ogg|mpeg|mp3|mp4|x-m4a)$/.test(mime)) throw new Error('Format de fichier non pris en charge');
  return { data: buffer.toString('base64'), mime };
}

let cachedGeminiModel: string | null = null;

async function chooseGeminiModel(key: string): Promise<string> {
  if (cachedGeminiModel) return cachedGeminiModel;
  const preferred = ['gemini-3.6-flash', 'gemini-3.6-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  try {
    const catalog = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(8000) });
    const data = await catalog.json() as { models?: Array<{ name?: string; supportedGenerationMethods?: string[] }> };
    const available = (data.models || [])
      .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
      .map(model => (model.name || '').replace(/^models\//, ''))
      .filter(Boolean);
    const selected = preferred.find(model => available.includes(model)) || available.find(model => /flash/i.test(model));
    if (selected) cachedGeminiModel = selected;
  } catch (error) {
    console.warn('[telegram] Gemini model catalog unavailable:', error instanceof Error ? error.message : 'unknown error');
  }
  return cachedGeminiModel || preferred[0];
}

async function analyze(key: string, text: string, media: { data: string; mime: string } | null): Promise<Record<string, unknown>> {
  const parts: Array<Record<string, unknown>> = [{ text: `Extrais les informations factuelles de cette proposition. Si une donnée manque, laisse une chaîne vide. N'invente rien. Catégories autorisées: evenement, mosquee, institut, cagnotte, piscine, emploi, librairie, psy, hijama, roqya, hajj. Champs JSON: categorie, titre, description, ville, departement, date_iso au format YYYY-MM-DD si connu, heure, lieu, organisateur, agence, agence_email, agence_telephone, adresse, contact, site_web, prix, duree, depart, dates, periode, hotelMakkah, hotelMadinah, airline, inclusions, documents_requis, gratuit, event_category, tags. Pour une agence, ne déduis jamais un email ou téléphone : ne les remplis que s’ils figurent explicitement dans le texte ou la source. Texte transmis: ${text}` }];
  if (media) parts.push({ inline_data: { mime_type: media.mime, data: media.data } });
  const model = await chooseGeminiModel(key);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { temperature: 0, responseMimeType: 'application/json', maxOutputTokens: 1600 } }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { error?: { status?: string; message?: string } } | null;
    const reason = errorBody?.error?.status || errorBody?.error?.message || 'réponse Google inconnue';
    console.warn(`[telegram] Gemini ${model} HTTP ${response.status}: ${reason}`);
    throw new Error(`Analyse indisponible (${response.status})`);
  }
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}') as unknown;
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Analyse invalide');
  return result as Record<string, unknown>;
}

async function handleCallback(query: TelegramCallback, allowedUser: string): Promise<NextResponse> {
  const originChat = String(query.message?.chat?.id ?? '');
  const allowedChats = new Set([process.env.TELEGRAM_MODERATION_CHAT_ID, process.env.TELEGRAM_CHAT_ID].filter(Boolean));
  const authorized = !!originChat && allowedChats.has(originChat) && isAuthorizedReviewAction(String(query.from?.id ?? ''), originChat, allowedUser, originChat);
  if (!authorized) {
    await answerReviewCallback(query.id, 'Action non autorisée.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const match = /^([arv]):([0-9a-f]{8}-[0-9a-f-]{27,})$/i.exec(query.data || '');
  if (!match) {
    await answerReviewCallback(query.id, 'Bouton non reconnu.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const [, action, id] = match;
  const [candidate] = await db.select().from(items).where(eq(items.id, id)).limit(1);
  if (!candidate || candidate.status !== 'pending') {
    await answerReviewCallback(query.id, 'Cette fiche a déjà été traitée.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const approving = action === 'a' || action === 'v';
  if (approving && candidate.category === 'solidarity' && candidate.metadata?.subType === 'cagnotte') {
    await answerReviewCallback(query.id, 'Vérifie la cagnotte sur le site avant publication.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const raw = (candidate.metadata?.raw || {}) as Record<string, unknown>;
  if (approving && publicationIssues(candidate).length) {
    await answerReviewCallback(query.id, 'Publication échouée : complète et vérifie la fiche dans /admin/soumissions.').catch(() => {});
    return NextResponse.json({ ok: false, publicationFailed: true });
  }
  const eventDate = itemEventDate(raw, candidate.dateStart);
  if (approving && candidate.category === 'event' && eventDate && eventDate < new Date().toISOString().slice(0, 10)) {
    await answerReviewCallback(query.id, 'Date absente ou événement passé. Vérifie sur le site.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const now = new Date();
  const [updated] = await db.update(items).set({
    status: approving ? 'approved' : 'rejected', updatedAt: now,
    title: withoutEmDashes(candidate.title), description: withoutEmDashes(candidate.description),
    metadata: withoutEmDashes({ ...candidate.metadata,
      moderation: { action: approving ? 'approved' : 'rejected', actor: `telegram:${allowedUser}`, at: now.toISOString() } }),
    ...(approving ? {
      lastVerifiedAt: now,
      nextReviewAt: new Date(now.getTime() + 30 * 86400000),
      ...(candidate.category === 'event' && eventDate && !candidate.dateStart ? { dateStart: new Date(`${eventDate}T12:00:00Z`) } : {}),
    } : {}),
  }).where(and(eq(items.id, id), eq(items.status, 'pending'))).returning({ id: items.id });
  if (!updated) {
    await answerReviewCallback(query.id, 'Cette fiche a déjà été traitée.').catch(() => {});
    return NextResponse.json({ ok: true });
  }
  await db.insert(moderationLog).values({ itemId: id, action: approving ? 'approved' : 'rejected', previousStatus: 'pending', newStatus: approving ? 'approved' : 'rejected', actor: `telegram:${query.from?.id || allowedUser}` })
    .catch(error => console.error('[telegram] moderation log write failed:', error));
  revalidatePath('/');
  revalidatePath(CATEGORY_PATH[candidate.category] || '/');
  if (candidate.category === 'institute') { revalidatePath('/api/mosques'); revalidatePath('/lieux-priere'); }
  if (candidate.category === 'hajj') revalidatePath(`/hajj/offres/${id}`);
  revalidatePath(`/api/public/items/${id}`);
  if (approving && !await confirmPublicPublication(id, async itemId => {
    const response = await fetch(`https://al-wasil.fr/api/public/items/${encodeURIComponent(itemId)}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) return false;
    const visible = await response.json() as { id?: string };
    return visible.id === itemId;
  })) {
    const reverted = await db.update(items).set({ status: 'pending', updatedAt: new Date() }).where(and(eq(items.id, id), eq(items.status, 'approved'))).returning({ id: items.id });
    if (reverted.length) await db.insert(moderationLog).values({ itemId: id, action: 'edited', previousStatus: 'approved', newStatus: 'pending', actor: 'telegram:publication_failed' });
    revalidatePath('/');
    if (candidate.category === 'institute') { revalidatePath('/api/mosques'); revalidatePath('/lieux-priere'); }
    revalidatePath(CATEGORY_PATH[candidate.category] || '/');
    revalidatePath(`/api/public/items/${id}`);
    await answerReviewCallback(query.id, 'Publication échouée : visibilité non confirmée. Fiche remise en attente ; vérifier dans /admin/soumissions.').catch(() => {});
    return NextResponse.json({ ok: false, publicationFailed: true });
  }
  await answerReviewCallback(query.id, approving ? 'Fiche publiée.' : 'Fiche refusée.').catch(() => {});
  if (query.message?.message_id) await closeReviewButtons(originChat, query.message.message_id).catch(() => {});
  return NextResponse.json({ ok: true, id, status: approving ? 'approved' : 'rejected' });
}

async function handleUpdate(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const allowedChat = process.env.TELEGRAM_CHAT_ID || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';
  if (!token || !allowedChat) return NextResponse.json({ error: 'Bot non configuré' }, { status: 503 });
  if (!validSecret(secretFor(token), req.headers.get('x-telegram-bot-api-secret-token'))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  let update: { update_id?: number; message?: TelegramMessage; edited_message?: TelegramMessage; callback_query?: TelegramCallback };
  try { update = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  if (!Number.isSafeInteger(update.update_id)) return NextResponse.json({ error: 'Message invalide' }, { status: 400 });
  const delivery = telegramStore();
  const updateKey = `update:${update.update_id}`;
  try {
    if (!await delivery.claim({ key: updateKey, updateId: update.update_id, source: 'telegram', recipient: String(update.callback_query?.message?.chat?.id || update.message?.chat?.id || update.edited_message?.chat?.id || ''), type: 'update' })) return NextResponse.json({ ok: true, duplicateUpdate: true });
  } catch { return NextResponse.json({ error: 'Journal Telegram indisponible' }, { status: 503 }); }
  if (update.callback_query) {
    const allowedUser = process.env.TELEGRAM_MODERATOR_USER_ID || process.env.TELEGRAM_ADMIN_USER_ID || allowedChat;
    return handleCallback(update.callback_query, allowedUser);
  }
  const msg = update.message || update.edited_message;
  if (!msg) return NextResponse.json({ ok: true });
  const chatId = String(msg.chat?.id ?? '');
  const allowedUser = process.env.TELEGRAM_MODERATOR_USER_ID || process.env.TELEGRAM_ADMIN_USER_ID || allowedChat;
  if (String(msg.from?.id ?? '') !== allowedUser) return NextResponse.json({ ok: true });
  const text = (msg.text || msg.caption || '').trim();
  if (/^\/chatid(?:@\w+)?$/.test(text) && chatId) {
    await sendMessage(token, chatId, `Identifiant de cette conversation : ${chatId}`);
    return NextResponse.json({ ok: true });
  }
  const nextMatch = /^\/suivantes(?:@\w+)?(?:\s+(\d{1,3}))?$/.exec(text);
  if (nextMatch && chatId === moderationChatId()) {
    const ids = await unsentReviewIds(chatId);
    const pending = ids.length ? await db.select().from(items).where(and(eq(items.status, 'pending'), inArray(items.id, ids)))
      .orderBy(desc(items.createdAt)).limit(5) : [];
    if (!pending.length) await sendMessage(token, chatId, 'Aucune autre fiche à vérifier.');
    for (const item of pending) await sendReview(item).catch((error) => console.warn('[telegram] pending item held back:', error instanceof Error ? error.message : error));
    return NextResponse.json({ ok: true, previews: pending.length });
  }
  if (chatId !== allowedChat) return NextResponse.json({ ok: true });
  const updateId = update.update_id;
  if (!Number.isSafeInteger(updateId) || text.length > 5000) return NextResponse.json({ error: 'Message invalide' }, { status: 400 });
  const source = `telegram:${updateId}`;
  const existing = await db.select({ id: items.id }).from(items).where(eq(items.source, source)).limit(1);
  if (existing.length) return NextResponse.json({ ok: true, duplicateUpdate: true });
  try {
    if (!geminiKey) throw new Error('Analyse indisponible');
    const media = await downloadMedia(token, msg);
    if (!text && !media) {
      await sendMessage(token, chatId, 'Envoie un texte, une image ou un vocal contenant une ressource à référencer.');
      return NextResponse.json({ ok: true });
    }
    const analyzed = await analyze(geminiKey, text, media);
    const proposal = prepareTelegramSubmission(analyzed, text);
    if (!proposal) {
      await sendMessage(token, chatId, 'Je n’ai pas pu identifier la catégorie ou le nom. Renvoie la ressource avec plus de détails.');
      return NextResponse.json({ ok: true });
    }
    const result = await ingestManualSubmission({ categoryKey: proposal.categoryKey, data: proposal.data, actor: `telegram:${chatId}`, source });
    if (!result.duplicate) await db.insert(moderationLog).values({ itemId: result.id, action: 'edited', previousStatus: null, newStatus: 'pending', actor: `telegram:${chatId}` }).catch(error => console.error('[telegram] ingestion audit write failed:', error));
    let blockedMessage = '';
    if (!result.duplicate && proposal.categoryKey === 'hajj') {
      const readiness = assessHajjOfferReadiness(proposal.data);
      if (!readiness.eligible) blockedMessage = ` Fiche enregistrée à enrichir, mais non envoyée en modération : ${readiness.missing.join(', ')}.`;
    }
    if (!result.duplicate && !blockedMessage) {
      const [inserted] = await db.select().from(items).where(eq(items.id, result.id)).limit(1);
      if (inserted) await sendReview(inserted).catch(error => console.error('[telegram] moderation notification failed:', error));
    }
    await sendMessage(token, chatId, result.duplicate
      ? 'Cette ressource semble déjà présente. Vérifie les fiches en modération.'
      : `Ressource reçue : ${String(proposal.data.title)}.${blockedMessage || ' Elle attend ta validation dans https://al-wasil.fr/admin/soumissions. Rien n’a été publié automatiquement.'}`);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error('[telegram] ingestion failure:', error);
    await sendMessage(token, chatId, 'Je n’ai pas pu enregistrer cette ressource. Réessaie plus tard ou utilise le formulaire du site.').catch(() => {});
    return NextResponse.json({ error: 'Traitement indisponible' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const authenticated = !!token && validSecret(secretFor(token), req.headers.get('x-telegram-bot-api-secret-token'));
  const body = await req.clone().json().catch(() => null) as { update_id?: number } | null;
  try {
    const response = await handleUpdate(req);
    const result = await response.clone().json().catch(() => ({}));
    if (authenticated && Number.isSafeInteger(body?.update_id) && !result.duplicateUpdate) {
      await telegramStore().finish(`update:${body!.update_id}`, response.ok && result.ok !== false ? 'sent' : 'uncertain');
    }
    return response;
  } catch {
    if (authenticated && Number.isSafeInteger(body?.update_id)) await telegramStore().finish(`update:${body!.update_id}`, 'uncertain').catch(() => {});
    return NextResponse.json({ error: 'Traitement interrompu. Vérifier le journal avant de relancer.' }, { status: 503 });
  }
}
