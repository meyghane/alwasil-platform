import { normalizeEventCategory, type EventCategory } from '../types';

export function inferEventCategory(...values: Array<string | undefined | null>): EventCategory {
  const text = values.filter(Boolean).join(' ').toLocaleLowerCase('fr-FR');
  if (/maraude|sans[- ]abri|distribution alimentaire|aide alimentaire/.test(text)) return 'maraude';
  if (/cours|formation|tajwid|coran|arabe|fiqh|tafsir|apprentissage/.test(text)) return 'cours';
  if (/collecte|humanitaire|solidarité|solidaire/.test(text)) return 'collecte';
  if (/iftar|rupture du jeûne/.test(text)) return 'iftar';
  if (/webinaire|visioconférence|en ligne/.test(text)) return 'webinaire';
  if (/jeunesse|jeunes|enfant/.test(text)) return 'jeunesse';
  return normalizeEventCategory(text);
}
