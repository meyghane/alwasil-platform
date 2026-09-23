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
    if (!date || date < new Date().toISOString().slice(0, 10)) return ['date absente ou événement passé'];
  }
  return [];
}

export async function confirmPublicPublication(id: string, probe: (id: string) => Promise<boolean>): Promise<boolean> {
  try { return await probe(id); } catch { return false; }
}
