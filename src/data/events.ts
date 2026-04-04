// ============================================================
// DONNÉES — Événements islamiques Île-de-France
// À enrichir avec de vraies données scrapées
// ============================================================

export type Event = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;        // ISO string
  endDate?: string;
  timeStart: string;   // ex: "14h00"
  timeEnd?: string;    // ex: "18h00"
  location: string;    // nom du lieu
  address?: string;
  city: string;
  department: string;  // '75','92','93','94','91','78','77','95','00'
  organizer: string;
  organizerUrl?: string;
  description: string;
  tags: string[];
  format: 'presentiel' | 'enligne' | 'hybride';
  registrationUrl?: string;
  isFree: boolean;
  price?: string;
  featured?: boolean;
};

export type EventCategory =
  | 'conference'
  | 'maraude'
  | 'cours'
  | 'iftar'
  | 'webinaire'
  | 'jeunesse'
  | 'famille'
  | 'collecte'
  | 'autre';

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  conference: 'Conférence',
  maraude: 'Maraude',
  cours: 'Cours / Formation',
  iftar: 'Iftar solidaire',
  webinaire: 'Webinaire',
  jeunesse: 'Jeunesse',
  famille: 'Famille',
  collecte: 'Collecte',
  autre: 'Autre',
};

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  conference: '#6366f1',
  maraude: '#ef4444',
  cours: '#5e17eb',
  iftar: '#f59e0b',
  webinaire: '#3b82f6',
  jeunesse: '#10b981',
  famille: '#ec4899',
  collecte: '#f97316',
  autre: '#6b7280',
};

export const DEPT_LABELS: Record<string, string> = {
  '75': 'Paris',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '91': 'Essonne',
  '95': "Val-d'Oise",
  '00': 'En ligne',
};

// Données mock (à remplacer par vraies données scrapées)
export const allEvents: Event[] = [
  {
    id: 'conf-ethique-travail',
    title: "Conférence : L'Éthique au Travail en Islam",
    category: 'conference',
    date: '2026-04-05',
    timeStart: '14h00',
    timeEnd: '17h00',
    location: 'Grande Mosquée de Paris',
    address: '2 bis Place du Puits de l\'Ermite',
    city: 'Paris 5e',
    department: '75',
    organizer: 'Institut Al-Ghazali',
    organizerUrl: 'https://www.mosqueedeparis.net',
    description: 'Conférence sur les valeurs islamiques dans le monde professionnel : honnêteté, relations au travail, halal et transactions.',
    tags: ['travail', 'éthique', 'adultes'],
    format: 'presentiel',
    isFree: true,
    featured: true,
  },
  {
    id: 'maraude-gare-nord',
    title: 'Maraude Solidaire — Gare du Nord',
    category: 'maraude',
    date: '2026-04-10',
    timeStart: '19h30',
    timeEnd: '22h00',
    location: 'Gare du Nord',
    address: 'Parvis de la Gare du Nord',
    city: 'Paris 10e',
    department: '75',
    organizer: 'Au Cœur de la Fraternité',
    description: 'Distribution de repas chauds et produits d\'hygiène aux personnes sans-abri. Venez avec votre bonne énergie !',
    tags: ['solidarité', 'sans-abri', 'bénévolat'],
    format: 'presentiel',
    registrationUrl: 'https://example.com',
    isFree: true,
    featured: true,
  },
  {
    id: 'webinaire-ia-2026',
    title: 'Webinaire : Comprendre les enjeux de l\'IA',
    category: 'webinaire',
    date: '2026-04-02',
    timeStart: '20h00',
    timeEnd: '21h30',
    location: 'En ligne (Zoom)',
    city: 'En ligne',
    department: '00',
    organizer: 'Muslim Tech Network',
    description: 'Tour d\'horizon des impacts de l\'intelligence artificielle sur la société et sur notre communauté. Questions/réponses en direct.',
    tags: ['technologie', 'IA', 'jeunes'],
    format: 'enligne',
    registrationUrl: 'https://example.com',
    isFree: true,
  },
  {
    id: 'maraude-vincennes',
    title: 'Maraude — Bois de Vincennes',
    category: 'maraude',
    date: '2026-04-12',
    timeStart: '18h30',
    timeEnd: '21h00',
    location: 'Bois de Vincennes — entrée Porte Dorée',
    city: 'Paris 12e',
    department: '75',
    organizer: 'Secours Islamique France',
    description: 'Distribution de repas et vêtements aux personnes vivant dans le Bois de Vincennes. Point de rendez-vous à la Porte Dorée. Bonne chaussure conseillée.',
    tags: ['solidarité', 'sans-abri', 'bénévolat', 'SIF'],
    format: 'presentiel',
    registrationUrl: 'https://example.com',
    isFree: true,
  },
  {
    id: 'maraude-saint-denis',
    title: 'Maraude mensuelle — Saint-Denis',
    category: 'maraude',
    date: '2026-04-19',
    timeStart: '20h00',
    timeEnd: '22h30',
    location: 'Centre-ville de Saint-Denis',
    city: 'Saint-Denis',
    department: '93',
    organizer: 'Association Al-Amal',
    description: 'Maraude mensuelle avec distribution de soupe chaude, pain et produits d\'hygiène. Rejoignez l\'équipe au point de départ.',
    tags: ['solidarité', 'sans-abri', '93', 'mensuel'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'maraude-nanterre',
    title: 'Maraude — Nanterre / La Défense',
    category: 'maraude',
    date: '2026-04-25',
    timeStart: '19h00',
    timeEnd: '21h30',
    location: 'Parvis de La Défense',
    city: 'Nanterre',
    department: '92',
    organizer: 'Bénévoles du 92',
    description: 'Distribution de repas et d\'essentiel aux personnes à la rue autour de La Défense. Préparation des sacs dès 18h30 pour les motivés !',
    tags: ['solidarité', 'sans-abri', '92', 'La Défense'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'jeunesse-conference-foi',
    title: 'Conférence Jeunes — Ma foi face aux défis du monde',
    category: 'jeunesse',
    date: '2026-04-18',
    timeStart: '14h00',
    timeEnd: '17h00',
    location: 'Centre culturel islamique — Aubervilliers',
    city: 'Aubervilliers',
    department: '93',
    organizer: 'JMF Île-de-France',
    description: 'Conférence pour les 18-35 ans : comment garder sa foi dans un monde moderne ? Réseaux sociaux, travail, relations… Débat ouvert avec deux intervenants.',
    tags: ['jeunesse', '18-35 ans', 'foi', 'conférence'],
    format: 'presentiel',
    isFree: true,
    featured: true,
  },
  {
    id: 'iftar-collectif-93',
    title: 'Iftar Collectif & Solidaire',
    category: 'iftar',
    date: '2026-04-08',
    timeStart: '19h45',
    location: 'Mosquée de Saint-Denis',
    city: 'Saint-Denis',
    department: '93',
    organizer: 'Association An-Nour',
    description: 'Iftar communautaire ouvert à tous. Repas partagé, dou\'a collectif. Invitez vos voisins !',
    tags: ['Ramadan', 'iftar', 'communauté'],
    format: 'presentiel',
    isFree: true,
    featured: true,
  },
  {
    id: 'conf-droits-musulmans',
    title: 'Conférence : Vos droits en tant que musulman en France',
    category: 'conference',
    date: '2026-04-12',
    timeStart: '15h00',
    timeEnd: '17h30',
    location: 'Salle communautaire',
    city: 'Créteil',
    department: '94',
    organizer: 'Collectif Justice & Foi',
    description: 'Un avocat et un imam répondent ensemble à vos questions : port du voile au travail, prière, discriminations, recours légaux.',
    tags: ['droits', 'laïcité', 'voile', 'travail'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'collecte-palestin-92',
    title: 'Collecte Humanitaire — Gaza',
    category: 'collecte',
    date: '2026-04-13',
    timeStart: '09h00',
    timeEnd: '17h00',
    location: 'Mosquée de Colombes',
    city: 'Colombes',
    department: '92',
    organizer: 'Human Appeal France',
    description: 'Collecte de dons pour les familles à Gaza. Vêtements, médicaments, et dons financiers. Reçu fiscal disponible.',
    tags: ['humanitaire', 'Gaza', 'collecte', 'don'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'collecte-vetements-printemps',
    title: 'Collecte vêtements & jouets — Printemps',
    category: 'collecte',
    date: '2026-04-20',
    timeStart: '10h00',
    timeEnd: '16h00',
    location: 'Mosquée de Montreuil',
    city: 'Montreuil',
    department: '93',
    organizer: 'Réseau Entraide 93',
    description: 'Collecte de vêtements (toutes tailles), jouets et livres pour redistribution aux familles dans le besoin. Tout don est bienvenu.',
    tags: ['collecte', 'vêtements', 'jouets', 'familles'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'collecte-alimentaire-95',
    title: 'Collecte alimentaire non-périssable — Sarcelles',
    category: 'collecte',
    date: '2026-04-27',
    timeStart: '09h00',
    timeEnd: '17h00',
    location: 'Mosquée Al-Rahma — Sarcelles',
    city: 'Sarcelles',
    department: '95',
    organizer: 'Association Rahma Solidarité',
    description: 'Dépôt de produits alimentaires non-périssables (conserves, pâtes, riz, huile, sucre). Redistribution aux familles du 95 dans le besoin.',
    tags: ['alimentaire', 'collecte', '95', 'familles'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'jeunesse-sport-93',
    title: 'Tournoi de foot inter-mosquées',
    category: 'jeunesse',
    date: '2026-04-19',
    timeStart: '10h00',
    timeEnd: '18h00',
    location: 'Stade municipal de Bobigny',
    city: 'Bobigny',
    department: '93',
    organizer: 'Jeunes Musulmans de France — IDF',
    description: 'Tournoi de football fraternité entre équipes des mosquées d\'Île-de-France. Remise de prix et barbecue halal.',
    tags: ['sport', 'foot', 'jeunesse', 'fraternité'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'conf-femme-islam',
    title: 'La Femme dans le Coran — Cycle de conférences',
    category: 'conference',
    date: '2026-04-20',
    timeStart: '14h00',
    timeEnd: '16h00',
    location: 'Centre Islamique de Mantes',
    city: 'Mantes-la-Jolie',
    department: '78',
    organizer: 'Réseau des Sœurs d\'Île-de-France',
    description: 'Cycle mensuel de conférences sur le statut de la femme dans le Coran et la Sunnah. Intervenante : Ustadha Fatima.',
    tags: ['femmes', 'Coran', 'sœurs'],
    format: 'presentiel',
    isFree: true,
  },
  {
    id: 'webinaire-tajwid-live',
    title: 'Session live Tajwid — Correction individuelle',
    category: 'webinaire',
    date: '2026-04-26',
    timeStart: '20h00',
    timeEnd: '21h30',
    location: 'En ligne (Zoom)',
    city: 'En ligne',
    department: '00',
    organizer: 'Sheikh Ahmed — Professeur Égypte',
    description: 'Session de correction de récitation en direct. Chaque participant lit quelques versets et reçoit une correction personnalisée.',
    tags: ['Tajwid', 'Coran', 'récitation', 'en ligne'],
    format: 'enligne',
    registrationUrl: 'https://example.com',
    isFree: false,
    price: '5€',
  },
];
