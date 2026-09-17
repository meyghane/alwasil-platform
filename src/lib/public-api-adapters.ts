import type { Event } from '@/data/events';
import type { Cagnotte } from '@/data/solidarity';

// Conserver la forme historique des réponses API pendant la migration de
// Google Sheets vers Neon. Les pages du site utilisent déjà ces fiches Neon.
export function toLegacyEvent(event: Event) {
  return {
    id: event.id,
    titre: event.title,
    categorie: event.category,
    date_debut: event.date,
    date_fin: event.endDate || '',
    heure_debut: event.timeStart,
    heure_fin: event.timeEnd || '',
    lieu: event.location,
    adresse: event.address || '',
    ville: event.city,
    departement: event.department,
    organisateur: event.organizer,
    organisateur_url: event.organizerUrl || '',
    description: event.description,
    tags: event.tags,
    format: event.format,
    url_inscription: event.registrationUrl || '',
    gratuit: event.isFree,
    prix: event.price || '',
    facebook_event_id: '',
    mosquee_id: '',
    source: event.verified ? 'manual' : 'scraped',
    featured: event.featured ?? false,
  };
}

export function toLegacyCagnotte(cagnotte: Cagnotte) {
  const goal = cagnotte.goal ?? 0;
  const raised = cagnotte.raised ?? 0;
  return {
    id: cagnotte.id,
    titre: cagnotte.title,
    organisateur: cagnotte.organizer,
    description: cagnotte.description,
    url: cagnotte.url,
    image_url: '',
    categorie: cagnotte.category,
    ville: '',
    departement: '',
    date_debut: '',
    date_fin: '',
    objectif: goal,
    montant_collecte: raised,
    nb_donateurs: cagnotte.backers ?? 0,
    pourcentage: goal > 0 ? Math.round(raised / goal * 100) : 0,
    is_active: cagnotte.daysLeft === undefined || cagnotte.daysLeft > 0,
    source: cagnotte.platform,
    derniere_maj: '',
  };
}
