const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
export function assessInstitute(raw: Record<string, unknown>) {
  const type = text(raw.type);
  const url = text(raw.sourceUrl || raw.website);
  const missing = [
    !text(raw.name || raw.title) ? 'nom' : '',
    !['mosquee', 'institut'].includes(type) ? 'type exact' : '',
    !text(raw.city) ? 'ville' : '', !text(raw.department) ? 'département' : '',
    !text(raw.address || raw.zone) ? 'adresse ou zone' : '',
    type === 'institut' && !text(raw.phone || raw.email || raw.contact) ? 'contact public' : '',
    !/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url) ? 'source officielle' : '',
    text(raw.description).length < 80 ? 'description utile' : '',
    !text(raw.lastVerifiedAt) || Number.isNaN(Date.parse(text(raw.lastVerifiedAt))) ? 'date de vérification' : '',
    !['high', 'medium', 'élevé', 'moyen'].includes(text(raw.confidence)) ? 'niveau de confiance' : '',
    type === 'institut' && (!Array.isArray(raw.courses) || !raw.courses.some(course => text(course).length >= 10)) ? 'cours détaillés' : '',
    type === 'institut' && (!Array.isArray(raw.audience) || !raw.audience.some(value => text(value))) ? 'public concerné' : '',
    type === 'institut' && (!Array.isArray(raw.format) || !raw.format.some(value => text(value))) ? 'format' : '',
    type === 'institut' && !text(raw.horaires) && (!Array.isArray(raw.hours) || !raw.hours.some(value => text(value))) ? 'horaires ou modalités' : '',
    type === 'institut' && (!Array.isArray(raw.tags) || !raw.tags.some(value => text(value))) ? 'tags' : '',
  ].filter(Boolean);
  return { eligible: missing.length === 0, missing };
}
