import { assessInstitute } from './institute-quality';
import { assessHajjOfferReadiness } from './hajj-offer-quality';
import { itemEventDate } from './event-dates';

export type PublishCandidate = { id: string; category: string; status: string; title: string; city: string | null; department: string | null; description: string | null; sourceUrl: string | null; dateStart: Date | null; metadata: Record<string, unknown> | null };
export function publicationIssues(item: PublishCandidate): string[] {
  const raw: Record<string, unknown> = { title: item.title, name: item.title, city: item.city, department: item.department, description: item.description, sourceUrl: item.sourceUrl, ...(item.metadata?.raw as Record<string, unknown> || {}) };
  if (item.category === 'institute') return assessInstitute(raw).missing;
  if (item.category === 'health') {
    const missing = [];
    if (!['psy', 'hijama', 'medical', 'roqya'].includes(String(raw.healthSubtype || raw.type || ''))) missing.push('spécialité vérifiée');
    if (typeof raw.qualification !== 'string' || !raw.qualification.trim()) missing.push('qualification');
    if (typeof raw.qualificationUrl !== 'string' || !raw.qualificationUrl.startsWith('https://')) missing.push('source de qualification');
    const adaptation = raw.adaptationEvidence as { url?: unknown; excerpt?: unknown } | undefined;
    if (typeof adaptation?.url !== 'string' || typeof adaptation.excerpt !== 'string' || adaptation.excerpt.trim().length < 12) missing.push('preuve officielle d’adaptation au public musulman');
    else {
      try { if (new URL(adaptation.url).origin !== new URL(String(raw.sourceUrl || '')).origin) missing.push('preuve d’adaptation hors du domaine officiel'); }
      catch { missing.push('URL de preuve d’adaptation invalide'); }
    }
    if (!raw.sourceUrl || typeof raw.sourceUrl !== 'string') missing.push('source officielle');
    const remote = Array.isArray(raw.format) && raw.format.some(value => typeof value === 'string' && /en ligne|online|t[eé]l[eé]consultation/i.test(value));
    if (!raw.city && !remote) missing.push('ville ou modalité à distance');
    if (typeof raw.description !== 'string' || raw.description.trim().length < 80) missing.push('description utile');
    if (!raw.email && !raw.phone && !raw.website) missing.push('contact public');
    if (!Array.isArray(raw.tags) || raw.tags.length === 0) missing.push('tags');
    return missing;
  }
  if (item.category === 'justice') {
    const missing = [];
    if (!['avocat', 'association', 'permanence', 'aide-juridique'].includes(String(raw.justiceSubtype || ''))) missing.push('type de ressource juridique');
    if (typeof raw.serviceArea !== 'string' || !raw.serviceArea.trim()) missing.push('zone de service');
    if (typeof raw.accessConditions !== 'string' || !raw.accessConditions.trim()) missing.push('modalités d’accès');
    if (raw.justiceSubtype === 'avocat' && (!raw.justiceQualification || typeof raw.justiceQualificationUrl !== 'string' || !raw.justiceQualificationUrl.startsWith('https://'))) missing.push('qualification professionnelle vérifiable');
    if (typeof raw.description !== 'string' || raw.description.trim().length < 80) missing.push('description utile');
    if (!raw.sourceUrl || typeof raw.sourceUrl !== 'string') missing.push('source officielle');
    const relevance = raw.relevanceEvidence as { url?: unknown; excerpt?: unknown } | undefined;
    if (typeof relevance?.url !== 'string' || typeof relevance.excerpt !== 'string' || relevance.excerpt.trim().length < 12) missing.push('preuve explicite de pertinence musulmane');
    else {
      try { if (new URL(relevance.url).origin !== new URL(String(raw.sourceUrl || '')).origin) missing.push('preuve de pertinence hors du domaine officiel'); }
      catch { missing.push('URL de preuve de pertinence invalide'); }
    }
    return missing;
  }
  if (item.category === 'solidarity' && item.metadata?.subType === 'cagnotte') {
    const missing = [];
    if (typeof raw.organizer !== 'string' || !raw.organizer.trim()) missing.push('organisateur');
    if (typeof raw.campaignDestination !== 'string' || !raw.campaignDestination.trim()) missing.push('destination');
    if (raw.isActive !== true && raw.campaignStatus !== 'active') missing.push('campagne explicitement active');
    const checked = Date.parse(String(raw.campaignStatusEvidence && (raw.campaignStatusEvidence as Record<string, unknown>).checkedAt || ''));
    const campaignEvidence = raw.campaignStatusEvidence as { url?: unknown } | undefined;
    if (!Number.isFinite(checked) || Date.now() - checked > 7 * 86400000) missing.push('état actif contrôlé au cours des 7 derniers jours');
    if (campaignEvidence?.url !== raw.sourceUrl) missing.push('état actif vérifié sur la page originale');
    return missing;
  }
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
