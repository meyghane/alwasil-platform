import { normalizeUrl } from '@/lib/data-quality';

export type TelegramSubmission = { categoryKey: string; data: Record<string, unknown> };

const CATEGORIES: Record<string, string> = {
  event: 'evenement', evenement: 'evenement', mosque: 'mosquee', mosquee: 'mosquee',
  institute: 'institut', institut: 'institut', cagnotte: 'cagnotte', fundraiser: 'cagnotte',
  piscine: 'piscine', emploi: 'emploi', librairie: 'librairie', psy: 'psy',
  hijama: 'hijama', roqya: 'roqya', hajj: 'hajj',
};

function str(value: unknown, max = 1000): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function prepareTelegramSubmission(result: Record<string, unknown>, messageText: string): TelegramSubmission | null {
  const categoryKey = CATEGORIES[str(result.categorie, 30).toLowerCase()];
  const title = str(result.titre ?? result.title, 240);
  if (!categoryKey || !title) return null;
  const description = str(result.description, 3000) || messageText.slice(0, 3000);
  const city = str(result.ville ?? result.city, 120);
  const department = str(result.departement ?? result.department, 3);
  const sourceUrl = str(result.site_web ?? result.url, 1000);
  const link = normalizeUrl(sourceUrl);
  const date = str(result.date_iso ?? result.date, 32);
  const tags = Array.isArray(result.tags) ? result.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 12) : [];
  const base = { title, description, city, department, tags, website: link || undefined, telegram_original: messageText.slice(0, 3000) };
  if (categoryKey === 'evenement') {
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
    return { categoryKey, data: {
      ...base, category: str(result.event_category, 30) || 'autre', date: validDate ? date : '',
      timeStart: str(result.heure ?? result.timeStart, 20),
      location: str(result.lieu ?? result.location, 160), organizer: str(result.organisateur ?? result.organizer, 160),
      registrationUrl: link || undefined, format: str(result.format, 20) || 'presentiel', isFree: result.gratuit === true,
      requires_enrichment: !validDate || !city || !department || !str(result.organisateur ?? result.organizer) || !str(result.heure ?? result.timeStart),
    } };
  }
  if (categoryKey === 'cagnotte') {
    const platformUrl = link && /^https:\/\/(?:[^/]+\.)?(?:helloasso\.com|launchgood\.com)\//i.test(link) ? link : null;
    return { categoryKey, data: {
      ...base, url: platformUrl || undefined, organizer: str(result.organisateur ?? result.organizer, 160),
      platform: platformUrl?.includes('launchgood.com') ? 'launchgood' : 'helloasso',
      verified: false, requires_enrichment: !platformUrl || !str(result.organisateur ?? result.organizer) || !str(result.currency),
    } };
  }
  if (categoryKey === 'mosquee' || categoryKey === 'institut') {
    return { categoryKey, data: {
      ...base, name: title, type: categoryKey === 'mosquee' ? 'mosquee' : 'institut',
      address: str(result.adresse ?? result.address, 240), phone: str(result.contact, 100),
      courses: [], audience: [], format: ['presentiel'], verified: false,
      requires_enrichment: !city || !department,
    } };
  }
  return { categoryKey, data: { ...base, name: title, requires_enrichment: true } };
}
