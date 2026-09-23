import { createHash } from 'node:crypto';
import type { RecordData, Source } from './contracts';
type JsonObject = Record<string, unknown>;
const text = (value: unknown): string => typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : '';
const object = (value: unknown): JsonObject => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const strings = (value: unknown): string[] => (Array.isArray(value) ? value : [value]).map(v => text(v) || text(object(v).name)).filter(Boolean);
// A trusted domain does not make every entity on its pages a place in this category.
const schemaTypes: Record<string, string[]> = {
  mosquee: ['Mosque'], institut: ['EducationalOrganization', 'School'],
  evenement: ['Event', 'EducationEvent', 'SocialEvent', 'Festival', 'BusinessEvent'],
  association: ['Organization', 'NGO'], librairie: ['BookStore'], piscine: ['PublicSwimmingPool'],
};

export function extractStructured(html: string, source: Source, fetchedAt: string): RecordData[] {
  const documents: JsonObject[] = [];
  function visit(value: unknown) {
    if (Array.isArray(value)) { value.forEach(visit); return; }
    const node = object(value);
    if (node['@graph']) visit(node['@graph']);
    if (node.itemListElement) visit(node.itemListElement);
    if (node.item) visit(node.item);
    const types = strings(node['@type']).map(type => type.replace(/^https?:\/\/schema\.org\//, ''));
    if (node.name && types.some(type => (schemaTypes[source.category] || []).includes(type))) documents.push(node);
  }
  for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { visit(JSON.parse(match[1])); } catch { /* Invalid structured source is not invented from prose. */ }
  }
  return documents.slice(0, 50).map(node => {
    const address = object(node.address || object(node.location).address);
    const geo = object(node.geo || object(node.location).geo);
    const postalCode = text(address.postalCode);
    const department = postalCode.startsWith('97') ? postalCode.slice(0,3) : postalCode.startsWith('20') ? '' : postalCode.slice(0,2);
    const title = text(node.name); const description = text(node.description);
    return {
      title, description, category: source.category, subType: source.category,
      commercial: !!node.offers || !!node.priceRange || source.category === 'librairie',
      city: text(address.addressLocality), department, address: text(address.streetAddress),
      phone: text(node.telephone), email: text(node.email), website: text(node.url) || source.url,
      hours: strings(node.openingHours || node.schedule), courses: strings(node.hasCourse), audience: strings(node.audience),
      format: strings(node.courseMode), tags: strings(node.keywords), verifiedAt: fetchedAt,
      image: text(node.image) || text(object(node.image).url) || undefined,
      date: text(node.startDate).slice(0,10) || undefined, organizer: text(object(node.organizer).name) || undefined,
      latitude: typeof geo.latitude === 'number' ? geo.latitude : undefined,
      longitude: typeof geo.longitude === 'number' ? geo.longitude : undefined,
      provenance: { sourceId: source.id, url: source.url, fetchedAt, contentHash: createHash('sha256').update(html).digest('hex'), fields: Object.keys(node) },
    };
  }).filter(record => !!record.title);
}
