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
  const goal = cagnotte.goal;
  const raised = cagnotte.raised;
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
    ...(goal !== undefined ? { objectif: goal } : {}),
    ...(raised !== undefined ? { montant_collecte: raised } : {}),
    ...(cagnotte.backers !== undefined ? { nb_donateurs: cagnotte.backers } : {}),
    ...(goal !== undefined && goal > 0 && raised !== undefined ? { pourcentage: Math.round(raised / goal * 100) } : {}),
    // An unknown closing date is not proof that a campaign is still active.
    is_active: cagnotte.isActive === true || cagnotte.campaignStatus === 'active',
    source: cagnotte.platform,
    derniere_maj: cagnotte.statsCheckedAt || '',
  };
}
