import type { items } from '@/db/schema';
import { withoutEmDashes } from '@/lib/typography';

type Item = typeof items.$inferSelect;
type Keyboard = { inline_keyboard: Array<Array<{ text: string; callback_data?: string; url?: string }>> };

export function moderationChatId(): string {
  return process.env.TELEGRAM_MODERATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '';
}

export function isAuthorizedReviewAction(userId: string, chatId: string, allowedUserId: string, allowedChatId: string): boolean {
  return !!userId && !!chatId && userId === allowedUserId && chatId === allowedChatId;
}

export function reviewUrl(id: string): string {
  return `https://al-wasil.fr/admin/soumissions?item=${encodeURIComponent(id)}`;
}

export function reviewKeyboard(item: Pick<Item, 'id' | 'category' | 'metadata' | 'dateStart'>): Keyboard {
  const campaign = item.category === 'solidarity' && item.metadata?.subType === 'cagnotte';
  const needsEdit = item.metadata?.requiresEnrichment === true;
  const raw = (item.metadata?.raw || {}) as Record<string, unknown>;
  const eventDate = typeof raw.date === 'string' ? raw.date : item.dateStart?.toISOString().slice(0, 10);
  const eventNotReady = item.category === 'event' && (!eventDate || eventDate < new Date().toISOString().slice(0, 10));
  return { inline_keyboard: [
    ...(!campaign && !eventNotReady ? [[
      { text: needsEdit ? 'Valider malgré les infos manquantes' : 'Valider', callback_data: `a:${item.id}` },
      { text: 'Refuser', callback_data: `r:${item.id}` },
    ]] : [[{ text: 'Refuser', callback_data: `r:${item.id}` }]]),
    [{ text: campaign ? 'Vérifier la cagnotte sur le site' : 'Modifier ou voir la fiche', url: reviewUrl(item.id) }],
  ] };
}

export function reviewPreview(item: Pick<Item, 'id' | 'category' | 'title' | 'description' | 'city' | 'dateStart' | 'sourceUrl' | 'metadata'>): string {
  const raw = (item.metadata?.raw || {}) as Record<string, unknown>;
  const date = typeof raw.date === 'string' ? raw.date : item.dateStart?.toISOString().slice(0, 10);
  const location = typeof raw.location === 'string' ? raw.location : typeof raw.address === 'string' ? raw.address : '';
  const organizer = typeof raw.organizer === 'string' ? raw.organizer : '';
  const notes = [
    item.metadata?.requiresEnrichment === true ? 'Informations à compléter avant publication.' : '',
    item.category === 'event' && !date ? 'Date de l’événement absente.' : '',
    item.category === 'event' && date && date < new Date().toISOString().slice(0, 10) ? 'Événement potentiellement passé.' : '',
    item.category === 'solidarity' && item.metadata?.subType === 'cagnotte' ? 'Collecte à vérifier sur sa source avant publication.' : '',
  ].filter(Boolean);
  return withoutEmDashes([
    'À vérifier sur Al-Wasil',
    `${item.title} (${item.category})`,
    item.city ? `Ville : ${item.city}` : '',
    date ? `Date de l’événement : ${date}` : '',
    location ? `Lieu : ${location}` : '',
    organizer ? `Organisateur : ${organizer}` : '',
    item.description ? `Description : ${item.description.slice(0, 650)}` : '',
    item.sourceUrl ? `Source : ${item.sourceUrl}` : 'Source : non renseignée',
    ...notes,
    `Ouvrir : ${reviewUrl(item.id)}`,
  ].filter(Boolean).join('\n'));
}

async function telegramCall(method: string, payload: Record<string, unknown>): Promise<unknown> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Telegram non configuré');
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  const body = await response.json() as { ok?: boolean; description?: string; result?: unknown };
  if (!response.ok || !body.ok) throw new Error(`Telegram ${method}: ${response.status} ${body.description || ''}`);
  return body.result;
}

export async function sendReview(item: Item): Promise<void> {
  const chatId = moderationChatId();
  if (!chatId) return;
  await telegramCall('sendMessage', { chat_id: chatId, text: reviewPreview(item),
    disable_web_page_preview: true, reply_markup: reviewKeyboard(item) });
}

export async function sendModerationText(text: string): Promise<void> {
  const chatId = moderationChatId();
  if (!chatId) return;
  await telegramCall('sendMessage', { chat_id: chatId, text, disable_web_page_preview: true });
}

export async function answerReviewCallback(id: string, text: string): Promise<void> {
  await telegramCall('answerCallbackQuery', { callback_query_id: id, text, show_alert: true });
}

export async function closeReviewButtons(chatId: string, messageId: number): Promise<void> {
  await telegramCall('editMessageReplyMarkup', { chat_id: chatId, message_id: messageId,
    reply_markup: { inline_keyboard: [] } });
}
