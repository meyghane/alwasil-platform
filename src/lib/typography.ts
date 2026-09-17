const emDash = String.fromCodePoint(0x2014);
const emDashSeparator = new RegExp(`[ \\t]*${emDash}[ \\t]*`, 'g');

export function withoutEmDashes<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(emDashSeparator, ' - ') as T;
  }
  if (Array.isArray(value)) {
    return value.map(withoutEmDashes) as T;
  }
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, withoutEmDashes(entry)]),
    ) as T;
  }
  return value;
}
