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
  cours: '#0d9488',
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
    date: '2026-03-28',
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
    date: '2026-03-29',
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
    id: 'cours-arabe-evry',
    title: 'Cours d\'arabe intensif — Niveau débutant',
    category: 'cours',
    date: '2026-04-05',
    timeStart: '10h00',
    timeEnd: '13h00',
    location: 'Grande Mosquée d\'Évry',
    city: 'Évry-Courcouronnes',
    department: '91',
    organizer: 'École Al-Houda',
    description: 'Session d\'introduction à l\'alphabet arabe et à la prononciation. Tous niveaux bienvenus, débutants prioritaires.',
    tags: ['arabe', 'débutant', 'adultes'],
    format: 'presentiel',
    isFree: false,
    price: '10€',
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
