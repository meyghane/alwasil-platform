const FRENCH_MONTHS: Record<string, string> = {
  janvier: '01', février: '02', fevrier: '02', mars: '03', avril: '04', mai: '05', juin: '06',
  juillet: '07', août: '08', aout: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12', decembre: '12',
};

function validDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function normalizeEventDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value !== 'string') return null;
  const text = value.trim().toLowerCase();
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  if (match) return validDate(Number(match[1]), Number(match[2]), Number(match[3]));
  match = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.exec(text);
  if (match) return validDate(Number(match[3]), Number(match[2]), Number(match[1]));
  match = /^(\d{1,2})\s+([a-zéûîôà]+)\s+(\d{4})$/.exec(text);
  if (match) {
    const month = FRENCH_MONTHS[match[2]];
    if (month) return validDate(Number(match[3]), Number(month), Number(match[1]));
  }
  return null;
}

export function itemEventDate(raw: Record<string, unknown>, dateStart?: Date | null): string | null {
  return normalizeEventDate(raw.date_iso ?? raw.date ?? dateStart ?? null);
}
