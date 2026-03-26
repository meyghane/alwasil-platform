// ============================================================
// DONNÉES — Solidarité & Cagnottes communautaires
// Sources : LaunchGood (API), HelloAsso, initiatives locales
// Filtre : uniquement projets communauté musulmane
// ============================================================

export type Cagnotte = {
  id: string;
  title: string;
  organizer: string;
  platform: 'launchgood' | 'helloasso' | 'leetchi' | 'direct';
  url: string;
  description: string;
  category: CagnotteCategory;
  raised?: number;       // montant collecté (€ ou $)
  goal?: number;         // objectif (€ ou $)
  currency: 'EUR' | 'USD';
  backers?: number;      // nombre de donateurs
  imageKeyword: string;  // mot-clé pour Unsplash
  country?: string;      // pays bénéficiaire
  featured?: boolean;
  verified: boolean;     // vérifié par équipe Al-Wasil
  daysLeft?: number;
};

export type Initiative = {
  id: string;
  title: string;
  type: InitiativeType;
  organizer: string;
  city: string;
  department: string;
  description: string;
  contactUrl?: string;
  phone?: string;
  imageKeyword: string;
  tags: string[];
  recurring: boolean;
  nextDate?: string;
};

export type CagnotteCategory =
  | 'palestine'
  | 'afrique'
  | 'mosquee'
  | 'famille'
  | 'education'
  | 'eau-puits'
  | 'orphelins'
  | 'urgence';

export type InitiativeType =
  | 'maraude'
  | 'repas-solidaire'
  | 'visite-ehpad'
  | 'aide-familles'
  | 'collecte'
  | 'bénévolat';

export const CAGNOTTE_CAT_LABELS: Record<CagnotteCategory, string> = {
  'palestine': '🇵🇸 Palestine',
  'afrique': '🌍 Afrique',
  'mosquee': '🕌 Mosquées',
  'famille': '👨‍👩‍👧 Familles',
  'education': '📚 Éducation',
  'eau-puits': '💧 Eau & Puits',
  'orphelins': '🤲 Orphelins',
  'urgence': '🚨 Urgence',
};

export const CAGNOTTE_CAT_COLORS: Record<CagnotteCategory, string> = {
  'palestine': '#10b981',
  'afrique': '#f59e0b',
  'mosquee': '#6366f1',
  'famille': '#ec4899',
  'education': '#0d9488',
  'eau-puits': '#3b82f6',
  'orphelins': '#8b5cf6',
  'urgence': '#ef4444',
};

// Données actuelles — à enrichir via API LaunchGood / HelloAsso
export const cagnottes: Cagnotte[] = [
  {
    id: 'gaza-urgence',
    title: 'Aide d\'urgence — Familles de Gaza',
    organizer: 'Human Appeal France',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/campaign/help_gaza_families',
    description: 'Aide alimentaire, médicale et abris d\'urgence pour les familles déplacées à Gaza. Reçu fiscal disponible.',
    category: 'palestine',
    raised: 142000,
    goal: 200000,
    currency: 'USD',
    backers: 3842,
    imageKeyword: 'hope solidarity hands',
    country: 'Palestine',
    featured: true,
    verified: true,
    daysLeft: 45,
  },
  {
    id: 'puits-afrique',
    title: 'Construction de puits — Mali & Sénégal',
    organizer: 'Secours Islamique France',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/campaign/water_wells_africa',
    description: 'Un puits = des centaines de familles alimentées en eau potable. L\'eau comme sadaqa jariya.',
    category: 'eau-puits',
    raised: 28500,
    goal: 50000,
    currency: 'EUR',
    backers: 612,
    imageKeyword: 'water well africa',
    country: 'Mali / Sénégal',
    featured: true,
    verified: true,
    daysLeft: 30,
  },
  {
    id: 'mosquee-paris-reno',
    title: 'Rénovation Salle de Prière — Mosquée Al-Fath',
    organizer: 'Association Al-Fath',
    platform: 'helloasso',
    url: 'https://www.helloasso.com/associations/al-fath',
    description: 'La salle de prière principale a besoin d\'une rénovation urgente pour accueillir les frères et sœurs dans de meilleures conditions.',
    category: 'mosquee',
    raised: 11200,
    goal: 25000,
    currency: 'EUR',
    backers: 189,
    imageKeyword: 'mosque interior prayer',
    country: 'France',
    verified: false,
    daysLeft: 60,
  },
  {
    id: 'corans-prison',
    title: 'Distribution de Corans en prison',
    organizer: 'Aumônerie Musulmane de France',
    platform: 'helloasso',
    url: 'https://www.helloasso.com/associations/aumonerie-musulmane',
    description: 'Offrir le Coran et des livres islamiques aux détenus musulmans. Chaque livre peut changer une vie.',
    category: 'education',
    raised: 4300,
    goal: 8000,
    currency: 'EUR',
    backers: 97,
    imageKeyword: 'quran book reading',
    country: 'France',
    verified: true,
    daysLeft: 20,
  },
  {
    id: 'orphelins-syrie',
    title: 'Parrainage d\'orphelins — Syrie',
    organizer: 'La Maison des Orphelins',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/campaign/orphan_sponsorship_syria',
    description: 'Parrainez un orphelin syrien : scolarité, nourriture et soins médicaux. À partir de 1€/jour.',
    category: 'orphelins',
    raised: 67000,
    goal: 100000,
    currency: 'EUR',
    backers: 1240,
    imageKeyword: 'children education school',
    country: 'Syrie',
    featured: true,
    verified: true,
    daysLeft: 90,
  },
  {
    id: 'famille-sinistr-93',
    title: 'Famille sinistrée suite à incendie — Aubervilliers',
    organizer: 'Collectif Entraide 93',
    platform: 'leetchi',
    url: 'https://www.leetchi.com/c/famille-aubervilliers',
    description: 'Une famille de 5 enfants a tout perdu dans un incendie. Aide pour relogement et équipement urgent.',
    category: 'famille',
    raised: 3200,
    goal: 6000,
    currency: 'EUR',
    backers: 78,
    imageKeyword: 'family solidarity community',
    country: 'France',
    verified: false,
    daysLeft: 15,
  },
  {
    id: 'soudan-urgence',
    title: 'Urgence Soudan — Déplacés de guerre',
    organizer: 'Islamic Relief France',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/campaign/sudan_emergency',
    description: 'Le conflit au Soudan a forcé des millions de personnes à fuir. Aide alimentaire d\'urgence.',
    category: 'urgence',
    raised: 89000,
    goal: 150000,
    currency: 'USD',
    backers: 2100,
    imageKeyword: 'humanitarian aid relief',
    country: 'Soudan',
    featured: true,
    verified: true,
    daysLeft: 30,
  },
  {
    id: 'ecole-coranique-93',
    title: 'Financement école coranique — Saint-Denis',
    organizer: 'Madrassa An-Nour',
    platform: 'helloasso',
    url: 'https://www.helloasso.com/associations/madrassa-an-nour',
    description: 'Aider à financer le loyer et le matériel pédagogique pour 80 enfants qui apprennent le Coran et l\'arabe.',
    category: 'education',
    raised: 5800,
    goal: 12000,
    currency: 'EUR',
    backers: 134,
    imageKeyword: 'children learning arabic quran',
    country: 'France',
    verified: false,
    daysLeft: 40,
  },
];

export const initiatives: Initiative[] = [
  {
    id: 'maraude-paris-10',
    title: 'Maraude hebdomadaire — Paris 10e/11e',
    type: 'maraude',
    organizer: 'Au Cœur de la Fraternité',
    city: 'Paris',
    department: '75',
    description: 'Chaque dimanche soir, distribution de repas chauds et produits d\'hygiène aux personnes sans-abri autour de la Gare du Nord. Rejoins l\'équipe !',
    contactUrl: 'https://example.com',
    imageKeyword: 'volunteer food distribution night',
    tags: ['sans-abri', 'repas', 'dimanche'],
    recurring: true,
    nextDate: '2026-03-30',
  },
  {
    id: 'repas-ramadan-93',
    title: 'Repas Ramadan solidaires — Bobigny',
    type: 'repas-solidaire',
    organizer: 'Association An-Nour Bobigny',
    city: 'Bobigny',
    department: '93',
    description: 'Pendant tout le Ramadan, repas gratuits offerts aux personnes isolées et aux étudiants. 50 repas/soir.',
    imageKeyword: 'ramadan iftar table food',
    tags: ['Ramadan', 'iftar', 'solidarité'],
    recurring: true,
    nextDate: '2026-04-01',
  },
  {
    id: 'visite-ehpad-créteil',
    title: 'Visites de personnes âgées — EHPAD Créteil',
    type: 'visite-ehpad',
    organizer: 'Collectif Fraternité 94',
    city: 'Créteil',
    department: '94',
    description: 'Visites mensuelles de personnes âgées isolées dans les EHPAD de Créteil. Sourire, lecture, présence bienveillante. Inscription ouverte.',
    imageKeyword: 'elderly people visit care',
    tags: ['personnes âgées', 'EHPAD', 'mensuel'],
    recurring: true,
    nextDate: '2026-04-05',
  },
  {
    id: 'collecte-vetements-92',
    title: 'Collecte vêtements & jouets — Nanterre',
    type: 'collecte',
    organizer: 'Mosquée de Nanterre',
    city: 'Nanterre',
    department: '92',
    description: 'Collecte de vêtements chauds et jouets pour familles dans le besoin. Dépôts acceptés à la mosquée les week-ends.',
    imageKeyword: 'clothes donation collection',
    tags: ['vêtements', 'jouets', 'familles'],
    recurring: false,
    nextDate: '2026-04-13',
  },
];
