export type VoyageType = 'hajj' | 'omra-ramadan' | 'omra-hors-saison' | 'omra-express';
export type StarRating = 3 | 4 | 5;
export type DepartCity = 'Paris' | 'Lyon' | 'Marseille' | 'Bordeaux' | 'Lille' | 'Nantes' | 'Strasbourg';

export type HajjAgence = {
  id: string;
  name: string;
  logoEmoji: string;
  location: string;
  since: number; // année de création
  rating: number;
  reviews: number;
  agrée: boolean; // agréé Ministère des Affaires Religieuses Saoudie / ONPLF
  description: string;
  website?: string;
  phone?: string;
  tags: string[];
};

export type HajjPackage = {
  id: string;
  agenceId: string;
  type: VoyageType;
  name: string;
  stars: StarRating;
  duration: number; // jours
  departCities: DepartCity[];
  price: number; // prix de base par personne
  priceDouble?: number; // chambre double
  priceTriple?: number; // chambre triple
  priceQuad?: number; // chambre quadruple
  priceSingle?: number; // chambre single (supplément)
  distanceMasjidNabawi?: number; // mètres
  distanceMasjidHaram?: number; // mètres
  includes: string[];
  excludes: string[];
  description: string;
  places?: number;
  placesRestantes?: number;
  departure?: string; // date ou mois
  featured?: boolean;
  promo?: string; // ex: "-5% jusqu'au 15 avril"
  hotelMakkah?: string;
  hotelMadinah?: string;
};

export const VOYAGE_TYPE_LABELS: Record<VoyageType, string> = {
  'hajj': '🕋 Hajj 2026',
  'omra-ramadan': '🌙 Omra Ramadan',
  'omra-hors-saison': '✈️ Omra (hors saison)',
  'omra-express': '⚡ Omra Express',
};

export const VOYAGE_TYPE_COLORS: Record<VoyageType, string> = {
  'hajj': '#059669',
  'omra-ramadan': '#7c3aed',
  'omra-hors-saison': '#0ea5e9',
  'omra-express': '#f97316',
};

export const hajjAgences: HajjAgence[] = [
  {
    id: 'a1',
    name: 'Al-Aman Voyages',
    logoEmoji: '🕋',
    location: 'Paris 10e',
    since: 2004,
    rating: 4.8,
    reviews: 1240,
    agrée: true,
    description: 'Leader français du voyage spirituel depuis 2004. Plus de 15 000 pèlerins accompagnés. Service de qualité, hôtels 4★ et 5★ proches des lieux saints. Encadrement francophone sur place.',
    website: '#',
    phone: '01 40 XX XX XX',
    tags: ['leader', 'francophone', 'hajj', 'omra'],
  },
  {
    id: 'a2',
    name: 'Nour Voyages',
    logoEmoji: '🌙',
    location: 'Lyon 7e',
    since: 2010,
    rating: 4.7,
    reviews: 876,
    agrée: true,
    description: 'Agence lyonnaise spécialisée dans les voyages spirituels. Forte présence en Auvergne-Rhône-Alpes. Groupes familiaux et groupes de sœurs disponibles. Accompagnateur islamologue sur chaque groupe.',
    website: '#',
    phone: '04 XX XX XX XX',
    tags: ['lyon', 'famille', 'sœurs', 'islamologue'],
  },
  {
    id: 'a3',
    name: 'Safa & Marwa Travel',
    logoEmoji: '⭐',
    location: 'Marseille 13e',
    since: 2008,
    rating: 4.9,
    reviews: 2100,
    agrée: true,
    description: 'Référence dans le sud de la France. Service premium avec hôtels 5★ face à la Kaaba. Guide érudit présent 24h/24. Séances de rappel et cours pendant le séjour. Spécialiste Hajj Ifrad et Qiran.',
    website: '#',
    phone: '04 91 XX XX XX',
    tags: ['premium', 'marseille', '5-étoiles', 'érudit', 'hajj'],
  },
  {
    id: 'a4',
    name: 'Baraka Voyages',
    logoEmoji: '🤲',
    location: 'Bobigny (93)',
    since: 2015,
    rating: 4.5,
    reviews: 430,
    agrée: true,
    description: 'Agence accessible et solidaire. Tarifs compétitifs avec qualité garantie. Forte présence en Seine-Saint-Denis. Facilités de paiement échelonné (3× sans frais). Accompagnement spécial personnes âgées.',
    website: '#',
    phone: '01 XX XX XX XX',
    tags: ['accessible', '93', 'paiement-échelonné', 'seniors'],
  },
  {
    id: 'a5',
    name: 'Iqra Travel',
    logoEmoji: '📖',
    location: 'Paris 18e',
    since: 2012,
    rating: 4.6,
    reviews: 680,
    agrée: true,
    description: 'Voyages spirituels avec dimension éducative. Programme de préparation au Hajj en ligne (6 semaines). Encadrement par des imams diplômés. Groupes jeunes adultes et groupes mixtes disponibles.',
    website: '#',
    phone: '01 XX XX XX XX',
    tags: ['éducatif', 'jeunes', 'imams', 'préparation'],
  },
];

export const hajjPackages: HajjPackage[] = [
  // ─── HAJJ ───
  {
    id: 'pkg1',
    agenceId: 'a1',
    type: 'hajj',
    name: 'Hajj Prestige 5★',
    stars: 5,
    duration: 21,
    departCities: ['Paris', 'Lyon', 'Marseille'],
    price: 8500,
    priceDouble: 8200,
    priceTriple: 7900,
    priceQuad: 7600,
    priceSingle: 9200,
    distanceMasjidHaram: 150,
    distanceMasjidNabawi: 200,
    includes: ['Vol AR Paris–Jeddah', 'Hôtel 5★ face Haram', 'Pension complète', 'Transport sur place', 'Encadrement francophone', 'Visa Hajj', 'Sacrifice (Udhiyya)', 'Mallette Hajj'],
    excludes: ['Vaccins', 'Dépenses personnelles', 'Excursions optionnelles'],
    description: 'Notre formule Hajj haut de gamme. Hôtel 5 étoiles à 150m de la Masjid Al-Haram, pension complète, guide érudit présent 24h/24. Idéal pour les personnes souhaitant accomplir ce pilier dans les meilleures conditions.',
    places: 60,
    placesRestantes: 12,
    departure: 'Juin 2026',
    featured: true,
    promo: undefined,
    hotelMakkah: 'Fairmont Makkah Clock Tower',
    hotelMadinah: 'Pullman ZamZam Madinah',
  },
  {
    id: 'pkg2',
    agenceId: 'a1',
    type: 'hajj',
    name: 'Hajj Confort 4★',
    stars: 4,
    duration: 21,
    departCities: ['Paris', 'Lyon'],
    price: 6200,
    priceDouble: 5900,
    priceTriple: 5600,
    priceQuad: 5300,
    distanceMasjidHaram: 500,
    distanceMasjidNabawi: 300,
    includes: ['Vol AR', 'Hôtel 4★', 'Demi-pension', 'Transport', 'Encadrement', 'Visa Hajj', 'Sacrifice'],
    excludes: ['Pension complète (option +300€)', 'Vaccins', 'Dépenses perso'],
    description: 'Le rapport qualité-prix idéal. Hôtel 4★ à 500m de la Kaaba avec navette régulière. Groupe francophone encadré par un accompagnateur expérimenté.',
    places: 100,
    placesRestantes: 34,
    departure: 'Juin 2026',
    featured: false,
    hotelMakkah: 'Hilton Suites Makkah',
    hotelMadinah: 'Anwar Al Madinah Mövenpick',
  },
  {
    id: 'pkg3',
    agenceId: 'a3',
    type: 'hajj',
    name: 'Hajj Royal — Face Kaaba',
    stars: 5,
    duration: 25,
    departCities: ['Marseille', 'Paris'],
    price: 11500,
    priceDouble: 11000,
    priceSingle: 12500,
    distanceMasjidHaram: 50,
    distanceMasjidNabawi: 100,
    includes: ['Vol Business class', 'Suite hôtel 5★ vue Kaaba', 'Pension complète premium', 'Transferts VIP', 'Guide islamologue privé', 'Visa', 'Sacrifice', 'Ziyarat Madinah & La Mecque', 'Cadeau spirituel personnalisé'],
    excludes: ['Vaccins obligatoires', 'Dépenses personnelles'],
    description: 'L\'expérience Hajj ultime. Chambre avec vue directe sur la Kaaba, service 5 étoiles, guide islamologue dédié au groupe. Programme complet de ziyarat des lieux saints.',
    places: 30,
    placesRestantes: 5,
    departure: 'Juin 2026',
    featured: true,
    hotelMakkah: 'Conrad Makkah (vue Kaaba)',
    hotelMadinah: 'Oberoi Madinah',
  },
  {
    id: 'pkg4',
    agenceId: 'a4',
    type: 'hajj',
    name: 'Hajj Solidaire 3★',
    stars: 3,
    duration: 18,
    departCities: ['Paris'],
    price: 4800,
    priceDouble: 4500,
    priceTriple: 4200,
    priceQuad: 3900,
    distanceMasjidHaram: 1200,
    distanceMasjidNabawi: 600,
    includes: ['Vol AR', 'Hôtel 3★', 'Petit-déjeuner', 'Bus navette toutes les heures', 'Encadrement', 'Visa', 'Sacrifice'],
    excludes: ['Repas midi/soir', 'Vaccins', 'Dépenses perso'],
    description: 'Formule accessible pour que personne ne renonce au Hajj pour des raisons financières. Hôtel simple mais propre, navette régulière vers le Haram. Paiement en 6× sans frais possible.',
    places: 200,
    placesRestantes: 87,
    departure: 'Juin 2026',
    promo: '🎁 -200€ si inscription avant le 1er avril',
    hotelMakkah: 'Al Safwah Hotel',
    hotelMadinah: 'Boudl Al Aseel',
  },

  // ─── OMRA RAMADAN ───
  {
    id: 'pkg5',
    agenceId: 'a2',
    type: 'omra-ramadan',
    name: 'Omra Ramadan — 10 dernières nuits',
    stars: 4,
    duration: 12,
    departCities: ['Lyon', 'Paris'],
    price: 2900,
    priceDouble: 2700,
    priceTriple: 2500,
    distanceMasjidHaram: 300,
    includes: ['Vol AR', 'Hôtel 4★', 'Petit-déjeuner + Iftar', 'Transport', 'Visa Omra', 'Encadrement'],
    excludes: ['Suhoor (option +150€)', 'Dépenses perso'],
    description: 'Vivez les 10 dernières nuits de Ramadan à la Mecque. Inclus le 27 (Laylat al-Qadr potentielle). Ambiance spirituelle incomparable, départ depuis Lyon ou Paris.',
    places: 80,
    placesRestantes: 23,
    departure: 'Ramadan 2026 (Mars–Avril)',
    featured: true,
    hotelMakkah: 'Marriott Makkah',
    hotelMadinah: undefined,
  },
  {
    id: 'pkg6',
    agenceId: 'a5',
    type: 'omra-ramadan',
    name: 'Omra Ramadan Complète',
    stars: 4,
    duration: 21,
    departCities: ['Paris', 'Bordeaux'],
    price: 3800,
    priceDouble: 3500,
    priceTriple: 3200,
    distanceMasjidHaram: 400,
    distanceMasjidNabawi: 250,
    includes: ['Vol AR', 'Hôtel 4★ La Mecque + Madinah', 'Iftar + Suhoor inclus', 'Transport La Mecque–Madinah', 'Visa', 'Programme spirituel quotidien', 'Cours de sciences islamiques'],
    excludes: ['Dépenses personnelles'],
    description: 'Omra pendant tout Ramadan avec programme spirituel complet. Cours de sciences islamiques chaque soir avec l\'accompagnateur. Visite Madinah incluse. Idéal pour un Ramadan transformateur.',
    places: 50,
    placesRestantes: 18,
    departure: 'Ramadan 2026',
    promo: '📚 Cours offerts (valeur 200€)',
    hotelMakkah: 'Le Méridien Makkah',
    hotelMadinah: 'Grand Plaza Madinah',
  },

  // ─── OMRA HORS SAISON ───
  {
    id: 'pkg7',
    agenceId: 'a1',
    type: 'omra-hors-saison',
    name: 'Omra Été — Juillet 2026',
    stars: 4,
    duration: 10,
    departCities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
    price: 1800,
    priceDouble: 1650,
    priceTriple: 1500,
    distanceMasjidHaram: 400,
    distanceMasjidNabawi: 350,
    includes: ['Vol AR', 'Hôtel 4★', 'Petit-déjeuner', 'Transport aéroport', 'Visa'],
    excludes: ['Repas midi/soir', 'Encadrement (option +100€)', 'Dépenses perso'],
    description: 'Profitez de la période estivale pour accomplir l\'Omra. Moins de foule qu\'en Ramadan, prix attractifs. Idéal pour les familles ou les personnes qui n\'ont pas pu partir en Ramadan.',
    places: 150,
    placesRestantes: 92,
    departure: 'Juillet 2026',
    promo: undefined,
    hotelMakkah: 'Hilton Makkah Convention Hotel',
    hotelMadinah: 'Sheraton Madinah Hotel',
  },
  {
    id: 'pkg8',
    agenceId: 'a4',
    type: 'omra-express',
    name: 'Omra Express 5 jours',
    stars: 3,
    duration: 5,
    departCities: ['Paris'],
    price: 950,
    priceDouble: 880,
    distanceMasjidHaram: 800,
    includes: ['Vol AR low-cost', 'Hôtel 3★', 'Visa', 'Transport aéroport'],
    excludes: ['Repas', 'Encadrement', 'Visite Madinah'],
    description: 'Pour les actifs qui veulent accomplir l\'Omra rapidement. Départ vendredi soir, retour mardi matin. La Mecque uniquement. Option idéale pour un week-end prolongé spirituel.',
    places: 40,
    placesRestantes: 15,
    departure: 'Toute l\'année (sur demande)',
    promo: '⚡ Places limitées chaque départ',
    hotelMakkah: 'Al Rawda Royal Inn',
    hotelMadinah: undefined,
  },
];
