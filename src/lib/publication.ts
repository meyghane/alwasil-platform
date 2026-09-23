import { assessInstitute } from './institute-quality';
import { assessHajjOfferReadiness } from './hajj-offer-quality';
import { itemEventDate } from './event-dates';

export type PublishCandidate = { id: string; category: string; status: string; title: string; city: string | null; department: string | null; description: string | null; sourceUrl: string | null; dateStart: Date | null; metadata: Record<string, unknown> | null };
export function publicationIssues(item: PublishCandidate): string[] {
  const raw: Record<string, unknown> = { title: item.title, name: item.title, city: item.city, department: item.department, description: item.description, sourceUrl: item.sourceUrl, ...(item.metadata?.raw as Record<string, unknown> || {}) };
  if (item.category === 'institute') return assessInstitute(raw).missing;
  if (item.category === 'hajj') return [...assessHajjOfferReadiness(raw).missing,
    !raw.partnerId && !raw.partner_id ? 'agence reliée' : '', raw.agencyContactVerified !== true ? 'contact agence vérifié' : '',
  ].filter(Boolean);
  if (item.metadata?.requiresEnrichment === true) return ['enrichissement requis'];
  if (item.category === 'event') {
    const date = itemEventDate(raw, item.dateStart);
    const missing = [];
    if (!date || date < new Date().toISOString().slice(0, 10)) missing.push('date absente ou événement passé');
    for (const [field,value] of Object.entries({ville:raw.city,lieu:raw.venue || raw.location || raw.lieu || raw.address,organisateur:raw.organizer || raw.organisateur,description:raw.description,source:raw.sourceUrl,inscription:raw.registrationUrl || raw.url})) if (typeof value!=='string'||!value.trim()) missing.push(field);
    if (!Array.isArray(raw.tags)||!raw.tags.length) missing.push('tags');
    return missing;
  }
  return [];
}

export async function confirmPublicPublication(id: string, probe: (id: string) => Promise<boolean>): Promise<boolean> {
  try { return await probe(id); } catch { return false; }
}
