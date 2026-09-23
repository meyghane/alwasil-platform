export type ChatRecord = {
  id: string; category: string; status: string; title: string; city: string | null;
  dateStart: Date | null; isSpam: boolean; metadata: Record<string, unknown> | null;
};
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const routes: Record<string, string> = { event: '/events', institute: '/education', solidarity: '/solidarity', hajj: '/hajj', health: '/sante', library: '/librairies', pool: '/piscines', job: '/jobs' };
const label = (value: string) => value.replace(/[\[\]<>\r\n]/g, ' ').slice(0, 200);

export function searchPublicRecords(question: string, records: ChatRecord[], now = new Date()): string {
  const query = normalize(question);
  const mosque = /mosque|masjid|priere/.test(query);
  const category = /hajj|hadj|omra/.test(query) ? 'hajj' : mosque || /institut|cours|arabe|coran|tajwid|ecole/.test(query) ? 'institute'
    : /evenement|conference|iftar|rencontre/.test(query) ? 'event' : /solidar|cagnotte|benevol|maraude|association/.test(query) ? 'solidarity'
    : /psy|hijama|sante|roqya/.test(query) ? 'health' : /librair/.test(query) ? 'library' : /piscine|burkini/.test(query) ? 'pool' : /emploi/.test(query) ? 'job' : '';
  if (!category) return 'Précise la catégorie et la ville recherchées : événements, mosquées, instituts, solidarité ou Hajj/Omra. Je recherche uniquement dans les fiches disponibles sur Al-Wasil.';
  const route = mosque ? '/lieux-priere' : routes[category];
  const location = /\b(?:a|au|en|pres de)\s+([a-z][a-z -]{1,45})/.exec(query)?.[1]?.trim();
  const today = now.toISOString().slice(0, 10);
  const matches = records.filter(record => {
    if (record.status !== 'approved' || record.isSpam || record.category !== category || record.metadata?.requiresEnrichment === true) return false;
    const raw = (record.metadata?.raw || {}) as Record<string, unknown>;
    if (category === 'institute' && (raw.type === 'mosquee' || record.metadata?.subType === 'mosquee') !== mosque) return false;
    if (category === 'event') {
      const date = record.dateStart?.toISOString().slice(0, 10) || String(raw.date || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) return false;
    }
    if (category === 'hajj' && record.metadata?.publicOfferVerified !== true) return false;
    if (location && !['france', 'ile de france', 'chez moi'].includes(location) && !normalize(record.city || '').includes(location)) return false;
    return true;
  }).slice(0, 5);
  if (!matches.length) return `Je n’ai pas trouvé de fiche publique fiable correspondant à cette recherche. [Consulter la rubrique](${route}) ou précise une autre ville. Je ne peux pas confirmer de prix ni de disponibilité sans fiche correspondante.`;
  return 'Voici les fiches disponibles :\n' + matches.map(record =>
    `• [${label(record.title)}](${category === 'hajj' ? `/hajj/offres/${encodeURIComponent(record.id)}` : route})${record.city ? ` (${label(record.city)})` : ''}`
  ).join('\n') + '\nConsulte les fiches pour leurs détails. Les disponibilités restent à confirmer auprès des établissements.';
}

export async function answerChat(request: Request, load: () => Promise<ChatRecord[]>, timeoutMs = 8000): Promise<Response> {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Message invalide.' }, { status: 400 }); }
  const messages = body && typeof body === 'object' && 'messages' in body ? body.messages : null;
  if (!Array.isArray(messages) || !messages.length || messages.length > 30 || messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 2000)) {
    return Response.json({ error: 'Message invalide ou trop long.' }, { status: 400 });
  }
  const question = messages.at(-1);
  if (question.role !== 'user' || !question.content.trim()) return Response.json({ error: 'Précise ta recherche.' }, { status: 400 });
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const records = await Promise.race([load(), new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), timeoutMs); })]);
    return Response.json({ text: searchPublicRecords(question.content, records) });
  } catch {
    return Response.json({ error: 'La recherche est momentanément indisponible. Consulte les rubriques du site ou réessaie dans quelques instants.' }, { status: 503 });
  } finally { clearTimeout(timeout); }
}
