type Holiday = { label: string; start: string; end: string };

const HOLIDAYS_2026_2027: Holiday[] = [
  { label: 'vacances de la Toussaint', start: '2026-10-17', end: '2026-11-02' },
  { label: 'vacances de Noël', start: '2026-12-19', end: '2027-01-04' },
];

export function findSchoolHolidayPeriod(text: string): Holiday | null {
  if (!/vacances scolaires|vacances d['’]été|vacances de noël|vacances de la toussaint/i.test(text)) return null;
  const lower = text.toLocaleLowerCase('fr-FR');
  return HOLIDAYS_2026_2027.find(period => lower.includes(period.label.replace('vacances de ', '').replace('vacances de la ', ''))) ||
    (lower.includes('décembre 2026') || lower.includes('decembre 2026') || lower.includes('noël') || lower.includes('noel') ? HOLIDAYS_2026_2027[1] : null);
}

export function holidayLabel(period: Holiday): string {
  const format = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `${period.label} : du ${format(period.start)} au ${format(period.end)}`;
}
