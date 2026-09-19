const value = (raw: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const candidate = raw[key];
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return '';
};

const hasNumber = (raw: Record<string, unknown>, keys: string[]): boolean => keys.some((key) => {
  const candidate = raw[key];
  return typeof candidate === 'number' ? Number.isFinite(candidate) && candidate > 0 :
    typeof candidate === 'string' && /\d/.test(candidate);
});

const hasList = (raw: Record<string, unknown>, keys: string[]): boolean => keys.some((key) => {
  const candidate = raw[key];
  return Array.isArray(candidate) ? candidate.some(Boolean) : typeof candidate === 'string' && candidate.trim().length > 0;
});

export type HajjOfferReadiness = { eligible: boolean; missing: string[] };

/** Minimum information required before an offer can reach human moderation. */
export function assessHajjOfferReadiness(raw: Record<string, unknown>): HajjOfferReadiness {
  const agency = value(raw, ['agency', 'agence', 'partnerName', 'partnerReference', 'organisateur', 'organizer']);
  const genericAgency = /^(agence[-_ ]?a[-_ ]?verifier|à vérifier|a verifier|inconnu|unknown)$/i.test(agency);
  const contact = value(raw, ['agencyEmail', 'agenceEmail', 'contactEmail', 'emailAgence', 'agencyPhone', 'agencePhone', 'contactPhone', 'phoneAgence', 'telephone']);
  const missing = [
    !agency || genericAgency ? 'agence identifiable' : '',
    !contact ? 'email ou téléphone de l’agence' : '',
    !value(raw, ['sourceUrl', 'website', 'site_web', 'url']) ? 'source officielle' : '',
    !value(raw, ['city', 'ville', 'location']) ? 'ville' : '',
    !value(raw, ['departure', 'depart', 'ville_depart']) ? 'ville de départ' : '',
    !hasNumber(raw, ['price', 'prix', 'prix_par_personne']) ? 'prix' : '',
    !hasNumber(raw, ['duration', 'duree', 'duree_jours']) ? 'durée' : '',
    !value(raw, ['dates', 'date', 'periode', 'seasonYear']) ? 'période ou dates' : '',
    !value(raw, ['description', 'texte_libre']) ? 'description' : '',
    !hasList(raw, ['includes', 'inclusions', 'inclus', 'requiredDocuments', 'documentsRequis', 'documents', 'hotelMakkah', 'hotelMadinah', 'airline']) ? 'détail de l’offre (hôtel, vol, inclusions ou documents)' : '',
  ].filter(Boolean);
  return { eligible: missing.length === 0, missing };
}
