export type PiscineType = 'municipale' | 'privee' | 'associative';

export type Piscine = {
  id: string;
  name: string;
  type: PiscineType;
  adresse: string;
  ville: string;
  department: string;
  creneaux: Creneau[];
  tarif?: string;
  phone?: string;
  website?: string;
  maps?: string;
  description: string;
  confirmed: boolean; // créneaux confirmés récemment
  lastVerified?: string; // date de dernière vérification
  tags: string[];
  note?: string;
  rating?: number;
  reviews?: number;
};

export type Creneau = {
  jour: string;
  horaire: string;
  info?: string; // ex: "Femmes uniquement", "Mixte accepté"
};

export const piscines: Piscine[] = [
  {
    id: 'p1',
    name: 'Piscine Molitor',
    type: 'privee',
    adresse: '2 avenue de la Porte Molitor',
    ville: 'Paris',
    department: '75',
    creneaux: [
      { jour: 'Tous les jours', horaire: '7h–22h', info: 'Burkini accepté toute la semaine — politique inclusive' },
    ],
    tarif: '35€ adulte / accès journée',
    phone: '01 56 07 08 50',
    website: 'https://www.mltr.fr',
    maps: '#',
    description: 'Piscine privée historique du 16e arrondissement. Politique d\'inclusion explicite depuis 2020 : maillots couvrants acceptés en dehors des heures de compétition.',
    confirmed: true,
    lastVerified: '2026-01',
    tags: ['paris', '75', '16e', 'privée', 'luxe'],
    note: 'Tarif élevé mais cadre exceptionnel. Politique burkini affichée sur le site.',
    rating: 4.4,
    reviews: 1230,
  },
  {
    id: 'p2',
    name: 'Centre Aquatique de Clichy-la-Garenne',
    type: 'municipale',
    adresse: '1 rue Martre',
    ville: 'Clichy-la-Garenne',
    department: '92',
    creneaux: [
      { jour: 'Mercredi', horaire: '14h–17h', info: 'Créneau femmes burkini' },
      { jour: 'Samedi', horaire: '18h–20h', info: 'Créneau femmes burkini' },
    ],
    tarif: '3,50€ (tarif municipal)',
    phone: '01 47 15 XX XX',
    maps: '#',
    description: 'Piscine municipale proposant des créneaux réservés aux femmes où le burkini est autorisé. Créneau très fréquenté — arriver en avance recommandé.',
    confirmed: true,
    lastVerified: '2025-11',
    tags: ['92', 'clichy', 'créneau-femmes', 'municipal', 'abordable'],
    rating: 3.9,
    reviews: 87,
  },
  {
    id: 'p3',
    name: 'Piscine des Roches — Noisy-le-Grand',
    type: 'municipale',
    adresse: '1 allée de la Mare Huguet',
    ville: 'Noisy-le-Grand',
    department: '93',
    creneaux: [
      { jour: 'Dimanche', horaire: '9h–11h', info: 'Créneau burkini mixte — tous publics couvrants acceptés' },
      { jour: 'Mardi', horaire: '19h30–21h', info: 'Créneau femmes, burkini autorisé' },
    ],
    tarif: '3€',
    phone: '01 43 04 XX XX',
    maps: '#',
    description: 'L\'une des rares piscines du 93 avec un créneau burkini mixte le dimanche matin. Accueil bienveillant, staff formé à l\'accueil de tous publics.',
    confirmed: true,
    lastVerified: '2026-02',
    tags: ['93', 'noisy-le-grand', 'créneau-mixte', 'dimanche'],
    note: 'Créneau mixte dimanche matin = rare en IdF, à ne pas manquer.',
    rating: 4.2,
    reviews: 143,
  },
  {
    id: 'p4',
    name: 'Centre Aquatique Intercommunal — Corbeil-Essonnes',
    type: 'municipale',
    adresse: '2 impasse du Stade',
    ville: 'Corbeil-Essonnes',
    department: '91',
    creneaux: [
      { jour: 'Samedi', horaire: '10h–12h', info: 'Créneau femmes — burkini toléré' },
      { jour: 'Jeudi', horaire: '20h–21h30', info: 'Créneau femmes' },
    ],
    tarif: '2,80€',
    maps: '#',
    description: 'Piscine intercommunale de l\'Essonne. Créneaux femmes bien établis depuis 2018. Personnel respectueux.',
    confirmed: false,
    lastVerified: '2025-09',
    tags: ['91', 'essonne', 'corbeil', 'créneau-femmes'],
    note: '⚠️ Créneaux à reconfirmer — vérifier avant de vous déplacer.',
    rating: 3.7,
    reviews: 42,
  },
  {
    id: 'p5',
    name: 'Piscine Municipale — Aubervilliers',
    type: 'municipale',
    adresse: '8 allée de la Commune de Paris',
    ville: 'Aubervilliers',
    department: '93',
    creneaux: [
      { jour: 'Lundi & Jeudi', horaire: '19h–21h', info: 'Créneau femmes, maillots couvrants autorisés' },
    ],
    tarif: '3€',
    phone: '01 48 39 XX XX',
    maps: '#',
    description: 'Piscine de proximité à Aubervilliers avec créneaux femmes en soirée. Burkini accepté sur les créneaux dédiés.',
    confirmed: true,
    lastVerified: '2026-01',
    tags: ['93', 'aubervilliers', 'créneau-femmes', 'soir'],
    rating: 3.8,
    reviews: 61,
  },
  {
    id: 'p6',
    name: 'Centre Nautique de Mantes-la-Jolie',
    type: 'municipale',
    adresse: '1 rue de la Piscine',
    ville: 'Mantes-la-Jolie',
    department: '78',
    creneaux: [
      { jour: 'Mercredi', horaire: '12h–14h', info: 'Créneau femmes burkini' },
      { jour: 'Dimanche', horaire: '8h–10h', info: 'Créneau burkini — tous publics' },
    ],
    tarif: '3,20€',
    maps: '#',
    description: 'Centre nautique avec deux créneaux burkini par semaine. Le créneau dominical mixte est une rareté dans les Yvelines.',
    confirmed: true,
    lastVerified: '2025-12',
    tags: ['78', 'mantes', 'yvelines', 'dimanche', 'mixte'],
    rating: 4.0,
    reviews: 95,
  },
  {
    id: 'p7',
    name: "Aqua'Vallée — Grigny",
    type: 'municipale',
    adresse: '50 route de Corbeil',
    ville: 'Grigny',
    department: '91',
    creneaux: [
      { jour: 'Vendredi', horaire: '18h–20h', info: 'Créneau femmes, burkini accepté' },
    ],
    tarif: '2,50€',
    maps: '#',
    description: 'Petit centre aquatique de Grigny avec créneau femmes le vendredi soir. Tarif très accessible, moins connu donc moins bondé.',
    confirmed: false,
    lastVerified: '2025-07',
    tags: ['91', 'grigny', 'vendredi', 'abordable'],
    note: '⚠️ Créneau à confirmer — appeler avant.',
    rating: 3.5,
    reviews: 28,
  },
  {
    id: 'p8',
    name: 'Piscine Tournesol — Stains',
    type: 'municipale',
    adresse: '37 avenue Lénine',
    ville: 'Stains',
    department: '93',
    creneaux: [
      { jour: 'Samedi', horaire: '9h–11h', info: 'Créneau femmes burkini' },
      { jour: 'Mardi', horaire: '18h30–20h30', info: 'Créneau femmes' },
    ],
    tarif: '3€',
    maps: '#',
    description: 'Piscine de quartier avec un bon accueil. Créneau du samedi matin très apprécié par les familles.',
    confirmed: true,
    lastVerified: '2026-01',
    tags: ['93', 'stains', 'samedi-matin', 'famille'],
    rating: 4.1,
    reviews: 74,
  },
];
