import { normalizeUrl } from '@/lib/data-quality';
import { findSchoolHolidayPeriod, holidayLabel } from '@/lib/school-holidays';
import { assessHajjOfferReadiness } from '@/lib/hajj-offer-quality';

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
function numberValue(value: unknown): number | undefined {
  const match = String(value ?? '').replace(/\s/g, '').match(/\d+(?:[.,]\d+)?/);
  if (!match) return undefined;
  const parsed = Number(match[0].replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function prepareTelegramSubmission(result: Record<string, unknown>, messageText: string): TelegramSubmission | null {
  const categoryKey = CATEGORIES[str(result.categorie, 30).toLowerCase()];
  const title = str(result.titre ?? result.title, 240);
  if (!categoryKey || !title) return null;
  const description = str(result.description, 3000) || messageText.slice(0, 3000);
  const holiday = findSchoolHolidayPeriod(`${title} ${description}`);
  const enrichedDescription = holiday && !description.toLocaleLowerCase('fr-FR').includes(holiday.start) ? `${description}\n\nPériode repérée : ${holidayLabel(holiday)}.` : description;
  const city = str(result.ville ?? result.city, 120);
  const department = str(result.departement ?? result.department, 3);
  const sourceUrl = str(result.site_web ?? result.url, 1000);
  const link = normalizeUrl(sourceUrl);
  const date = str(result.date_iso ?? result.date, 32);
  const tags = Array.isArray(result.tags) ? result.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 12) : [];
  const base = { title, description: enrichedDescription, city, department, tags, website: link || undefined, telegram_original: messageText.slice(0, 3000) };
  const travelText = `${title} ${description}`.toLocaleLowerCase('fr-FR');
  const inferredTravel = /\b(omra|omrah|hajj|hadj)\b/.test(travelText);
  const effectiveCategoryKey = inferredTravel && categoryKey === 'evenement' ? 'hajj' : categoryKey;
  if (effectiveCategoryKey === 'hajj') {
    const priceText = str(result.prix ?? result.price ?? result.prix_par_personne, 80);
    const price = numberValue(priceText);
    const departure = str(result.depart ?? result.departure ?? result.ville_depart, 120) || city;
    const packageData = {
      ...base, name: title, type: 'package', travelType: /hajj|hadj/.test(travelText) ? 'Hajj' : 'Omra',
      departure, price, duration: numberValue(result.duree ?? result.duration),
      dates: str(result.dates ?? result.periode ?? result.date, 160),
      hotelMakkah: str(result.hotelMakkah ?? result.hotel_makkah ?? result.hotel, 160) || undefined,
      hotelMadinah: str(result.hotelMadinah ?? result.hotel_madinah, 160) || undefined,
      distance_haram: numberValue(result.distance_haram ?? result.distanceMasjidHaram),
      distance_nabawi: numberValue(result.distance_nabawi ?? result.distanceMasjidNabawi),
      inclusions: result.inclusions ?? result.inclus ?? undefined, exclusions: result.exclusions ?? result.exclus ?? undefined,
      requiredDocuments: result.documents_requis ?? result.documentsRequis ?? result.documents ?? undefined,
      placesRestantes: numberValue(result.places_restantes ?? result.placesRestantes),
      agency: str(result.agence ?? result.organisateur ?? result.organizer, 160),
      agencyEmail: str(result.agence_email ?? result.agencyEmail ?? result.email_agence, 240),
      agencyPhone: str(result.agence_telephone ?? result.agencyPhone ?? result.telephone_agence ?? result.contact, 100),
      agencyContactSource: str(result.source_contact_agence ?? result.agencyContactSource, 120),
      agencyContactVerified: result.agencyContactVerified === true,
      partnerReference: str(result.agence ?? result.organisateur ?? result.organizer, 160),
      verified: false,
      requires_enrichment: true,
    };
    const readiness = assessHajjOfferReadiness(packageData);
    packageData.requires_enrichment = !readiness.eligible;
    return { categoryKey: 'hajj', data: packageData };
  }
  if (effectiveCategoryKey === 'evenement') {
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
    return { categoryKey: effectiveCategoryKey, data: {
      ...base, category: str(result.event_category, 30) || 'autre', date: validDate ? date : '',
      timeStart: str(result.heure ?? result.timeStart, 20),
      location: str(result.lieu ?? result.location, 160), organizer: str(result.organisateur ?? result.organizer, 160),
      registrationUrl: link || undefined, format: str(result.format, 20) || 'presentiel', isFree: result.gratuit === true,
      requires_enrichment: !validDate || !city || !department || !str(result.organisateur ?? result.organizer) || !str(result.heure ?? result.timeStart),
    } };
  }
  if (effectiveCategoryKey === 'cagnotte') {
    const platformUrl = link && /^https:\/\/(?:[^/]+\.)?(?:helloasso\.com|launchgood\.com)\//i.test(link) ? link : null;
    return { categoryKey, data: {
      ...base, url: platformUrl || undefined, organizer: str(result.organisateur ?? result.organizer, 160),
      platform: platformUrl?.includes('launchgood.com') ? 'launchgood' : 'helloasso',
      verified: false, requires_enrichment: !platformUrl || !str(result.organisateur ?? result.organizer) || !str(result.currency),
    } };
  }
  if (effectiveCategoryKey === 'mosquee' || effectiveCategoryKey === 'institut') {
    return { categoryKey: effectiveCategoryKey, data: {
      ...base, name: title, type: categoryKey === 'mosquee' ? 'mosquee' : 'institut',
      address: str(result.adresse ?? result.address, 240), phone: str(result.contact, 100),
      courses: [], audience: [], format: ['presentiel'], verified: false,
      requires_enrichment: !city || !department,
    } };
  }
  return { categoryKey: effectiveCategoryKey, data: { ...base, name: title, departure: holiday ? holidayLabel(holiday) : undefined, requires_enrichment: true } };
}
