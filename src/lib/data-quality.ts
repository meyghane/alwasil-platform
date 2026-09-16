// Pure comparisons: a shared contact is evidence for review, never proof of identity.
export function normalizeText(value: unknown): string {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
export function normalizeUrl(value: unknown): string | null {
  try {
    const url = new URL(String(value));
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
    url.searchParams.sort();
    return url.toString().replace(/\/$/, '');
  } catch { return null; }
}
export function normalizePhone(value: unknown): string | null {
  let phone = String(value ?? '').replace(/[\s().-]/g, '');
  if (phone.startsWith('0033')) phone = '+33' + phone.slice(4);
  if (/^0[1-9]\d{8}$/.test(phone)) phone = '+33' + phone.slice(1);
  if (phone.startsWith('+330')) phone = '+33' + phone.slice(4);
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}
export type Candidate = { id: string; category: string; title: string; city: string | null; dateStart: Date | null; sourceUrl: string | null; metadata: Record<string, unknown> | null };
function rawData(candidate: Candidate): Record<string, unknown> {
  return (candidate.metadata?.raw ?? candidate.metadata ?? {}) as Record<string, unknown>;
}
export function candidatePhones(candidate: Candidate): string[] {
  const raw = rawData(candidate);
  return [raw.phone, raw.telephone, raw.tel, raw.mobile, raw.whatsapp]
    .map(normalizePhone).filter((value): value is string => Boolean(value));
}
export function candidateEmails(candidate: Candidate): string[] {
  const raw = rawData(candidate);
  return [raw.email, raw.contactEmail, raw.contact_email]
    .map(value => String(value ?? '').trim().toLowerCase())
    .filter(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}
export function candidateLinks(candidate: Candidate): string[] {
  const raw = rawData(candidate);
  return [candidate.sourceUrl, raw.website, raw.url, raw.url_source, raw.registrationUrl, raw.registration_url, raw.link, raw.cagnotteUrl]
    .map(normalizeUrl).filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index);
}
export function duplicateReasons(a: Candidate, b: Candidate): string[] {
  if (a.category !== b.category) return [];
  // Recurring events must not collapse different dates into one entry.
  if (a.category === 'event' && (!a.dateStart || !b.dateStart || a.dateStart.toISOString().slice(0,10) !== b.dateStart.toISOString().slice(0,10))) return [];
  const reasons: string[] = [];
  const url = normalizeUrl(a.sourceUrl);
  if (url && url === normalizeUrl(b.sourceUrl)) reasons.push('url');
  const phonesA = candidatePhones(a); const phonesB = candidatePhones(b);
  if (phonesA.some(phone => phonesB.includes(phone))) reasons.push('phone');
  const emailsA = candidateEmails(a); const emailsB = candidateEmails(b);
  if (emailsA.some(email => emailsB.includes(email))) reasons.push('email');
  const wordsA = new Set(normalizeText(a.title).split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normalizeText(b.title).split(' ').filter(w => w.length > 2));
  const union = new Set([...wordsA, ...wordsB]);
  const common = [...wordsA].filter(w => wordsB.has(w)).length;
  const sameCity = Boolean(normalizeText(a.city)) && normalizeText(a.city) === normalizeText(b.city);
  const exactTitle = normalizeText(a.title) === normalizeText(b.title);
  if ((sameCity && exactTitle) || (sameCity && wordsA.size >= 2 && common / Math.max(union.size, 1) >= .8)) reasons.push('title');
  return reasons;
}
