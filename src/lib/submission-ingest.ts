import { db } from '@/db';
import { items } from '@/db/schema';
import { duplicateReasons, type Candidate, normalizeUrl } from '@/lib/data-quality';
import { inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { withoutEmDashes } from '@/lib/typography';

type Category = typeof items.$inferInsert.category;
const CATEGORY_MAP: Record<string, { category: Category; subType: string }> = {
  piscine: { category: 'pool', subType: 'piscine' },
  institut: { category: 'institute', subType: 'institut' },
  mosquee: { category: 'institute', subType: 'mosquee' },
  evenement: { category: 'event', subType: 'event' },
  emploi: { category: 'job', subType: 'job_offer' },
  psy: { category: 'health', subType: 'psy' },
  hijama: { category: 'health', subType: 'hijama' },
  roqya: { category: 'health', subType: 'roqya' },
  librairie: { category: 'library', subType: 'librairie' },
  cagnotte: { category: 'solidarity', subType: 'cagnotte' },
  agence_hajj: { category: 'hajj', subType: 'agence' },
  hajj: { category: 'hajj', subType: 'package' },
};

function first(data: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

export async function ingestManualSubmission(input: {
  categoryKey: string;
  data: Record<string, unknown>;
  actor: string;
  source: string;
}) {
  const mapping = CATEGORY_MAP[input.categoryKey];
  if (!mapping) throw new Error('Catégorie non prise en charge');
  const raw: Record<string, unknown> = withoutEmDashes({ ...input.data, id: randomUUID() });
  const title = first(raw, input.categoryKey === 'psy' ? ['name', 'title'] : ['title', 'name', 'titre', 'nom']);
  if (!title || title.length > 240) throw new Error('Titre invalide');
  const textForClassification = `${title} ${first(raw, ['description', 'texte_libre'])}`.toLocaleLowerCase('fr-FR');
  const courses = Array.isArray(raw.courses) ? raw.courses.filter(Boolean) : [];
  const hasConfirmedCourse = courses.length > 0 || /cours|formation|enseignement|coran|tajwid|arabe|mémorisation|memorisation|hifz|sciences islamiques/.test(textForClassification);
  const isPrayerPlace = /mosquée|mosquee|masjid|salle de prière|salle de priere|lieu de prière|lieu de priere/.test(textForClassification) && !hasConfirmedCourse;
  const effectiveCategoryKey = isPrayerPlace ? 'mosquee' : input.categoryKey;
  const effectiveMapping = CATEGORY_MAP[effectiveCategoryKey];
  const city = first(raw, ['city', 'ville', 'location']) || null;
  const department = first(raw, ['department', 'departement']) || null;
  const url = first(raw, ['website', 'url', 'registrationUrl', 'site_web', 'url_source']);
  if (url && !normalizeUrl(url)) throw new Error('URL invalide');
  const dateText = first(raw, ['date', 'date_iso']);
  const dateStart = dateText && !Number.isNaN(Date.parse(dateText)) ? new Date(dateText) : null;
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') :
    typeof raw.tags === 'string' ? raw.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  const candidate: Candidate = {
    id: 'new', category: effectiveMapping.category, title, city, dateStart,
    sourceUrl: url || null, metadata: { raw },
  };
  const existing = await db.select({
    id: items.id, category: items.category, title: items.title, city: items.city,
    description: items.description, department: items.department, dateStart: items.dateStart, sourceUrl: items.sourceUrl, metadata: items.metadata,
  }).from(items).where(inArray(items.status, ['pending', 'approved']));
  const duplicate = existing.find(item => duplicateReasons(candidate, item).length > 0);
  if (duplicate) {
    const previousMetadata = (duplicate.metadata || {}) as Record<string, unknown>;
    const previousRaw = (previousMetadata.raw && typeof previousMetadata.raw === 'object' ? previousMetadata.raw : {}) as Record<string, unknown>;
    const mergedRaw = { ...raw, ...previousRaw };
    for (const [key, value] of Object.entries(raw)) if (value !== undefined && value !== null && value !== '' && previousRaw[key] === undefined) mergedRaw[key] = value;
    await db.update(items).set({
      description: duplicate.description || first(raw, ['description', 'texte_libre']) || null,
      city: duplicate.city || city,
      department: duplicate.department || department,
      dateStart: duplicate.dateStart || dateStart,
      sourceUrl: duplicate.sourceUrl || url,
      updatedAt: new Date(),
      metadata: { ...previousMetadata, raw: mergedRaw, lastEnrichedAt: new Date().toISOString(), enrichmentSource: input.source },
    }).where(inArray(items.id, [duplicate.id]));
    return { duplicate: true as const, id: duplicate.id, enriched: true as const };
  }

  const [inserted] = await db.insert(items).values({
    category: effectiveMapping.category, status: 'pending', title,
    description: first(raw, ['description', 'texte_libre']) || null,
    city, department, dateStart, source: input.source, sourceUrl: url || null,
    tags, isSpam: raw.is_spam === true,
    metadata: { subType: effectiveMapping.subType, raw: { ...raw, type: effectiveMapping.subType }, submittedBy: input.actor, submittedAt: new Date().toISOString(), requiresEnrichment: input.source === 'quick_add' || input.source.startsWith('telegram:') && raw.requires_enrichment === true },
  }).returning({ id: items.id });
  return { duplicate: false as const, id: inserted.id };
}
