// Catégories d'événements valides — identiques à EventCategory dans src/data/events.ts
export const EVENT_CATEGORIES = [
  'conference',
  'maraude',
  'cours',
  'iftar',
  'webinaire',
  'jeunesse',
  'famille',
  'collecte',
  'autre',
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export function normalizeEventCategory(cat: string): EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(cat) ? (cat as EventCategory) : 'autre';
}

// Item prêt à être affiché dans le digest email (lien Valider/Refuser)
export interface DigestItem {
  id: string; // uuid réel de la ligne Postgres
  title: string;
  category: EventCategory;
  description: string;
  dateIso?: string;
  city?: string;
  sourceUrl?: string;
}
