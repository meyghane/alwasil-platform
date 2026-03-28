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

export type Association = {
  id: string;
  name: string;
  description: string;
  domaine: AssociationDomaine;
  url: string;
  city?: string;
  department?: string;
  national: boolean;
  logoEmoji: string;
  tags: string[];
};

export type VoyageHumanitaire = {
  id: string;
  title: string;
  destination: string;
  organizer: string;
  organizerUrl: string;
  description: string;
  duration: string;
  nextDeparture?: string;
  price?: string;
  places?: number;
  imageKeyword: string;
  tags: string[];
};

export type VisiteMalade = {
  id: string;
  title: string;
  lieu: string;      // EHPAD, hôpital, domicile
  typeLieu: 'ehpad' | 'hopital' | 'domicile' | 'prison';
  organizer: string;
  city: string;
  department: string;
  description: string;
  contactUrl?: string;
  phone?: string;
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

export type AssociationDomaine =
  | 'humanitaire'
  | 'social'
  | 'education'
  | 'sante'
  | 'droits'
  | 'jeunesse';

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

// ============================================================
// CAGNOTTES
// ============================================================
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
  {
    id: 'mosquee-construction-78',
    title: 'Construction mosquée — Versailles',
    organizer: 'Association Al-Barakah 78',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/v2/campaign/new_mosque_versailles',
    description: 'Premier lieu de culte digne à Versailles pour une communauté de 8 000 musulmans. La communauté attend depuis 20 ans.',
    category: 'mosquee',
    raised: 340000,
    goal: 800000,
    currency: 'EUR',
    backers: 4200,
    imageKeyword: 'mosque interior prayer',
    country: 'France',
    featured: true,
    verified: true,
    daysLeft: 180,
  },
  {
    id: 'orphelins-gaza',
    title: 'Parrainage orphelins — Gaza',
    organizer: 'Human Appeal France',
    platform: 'launchgood',
    url: 'https://www.launchgood.com/campaign/orphans_gaza',
    description: 'Des milliers d\'enfants ont perdu leurs parents. Parrainage mensuel pour leur scolarité et leur avenir.',
    category: 'orphelins',
    raised: 220000,
    goal: 500000,
    currency: 'USD',
    backers: 5800,
    imageKeyword: 'children education school',
    country: 'Palestine',
    featured: true,
    verified: true,
    daysLeft: 365,
  },
];

// ============================================================
// MARAUDES & INITIATIVES
// ============================================================
export const initiatives: Initiative[] = [
  {
    id: 'maraude-paris-10',
    title: 'Maraude hebdomadaire — Paris 10e/11e',
    type: 'maraude',
    organizer: 'Au Cœur de la Fraternité',
    city: 'Paris',
    department: '75',
    description: 'Chaque dimanche soir, distribution de repas chauds et produits d\'hygiène aux personnes sans-abri autour de la Gare du Nord. Rejoins l\'équipe !',
    contactUrl: 'https://www.aucoeurfraternite.fr',
    imageKeyword: 'volunteer food distribution night',
    tags: ['sans-abri', 'repas', 'dimanche'],
    recurring: true,
    nextDate: '2026-03-30',
  },
  {
    id: 'maraude-st-lazare',
    title: 'Maraude Saint-Lazare — Paris 8e',
    type: 'maraude',
    organizer: 'Muslimes en Action',
    city: 'Paris',
    department: '75',
    description: 'Distribution de repas et couvertures chaque samedi soir autour de la Gare Saint-Lazare. Bénévoles bienvenus dès 19h.',
    contactUrl: 'https://www.helloasso.com/associations/muslimes-en-action',
    imageKeyword: 'volunteer food distribution night',
    tags: ['sans-abri', 'samedi', 'paris'],
    recurring: true,
    nextDate: '2026-03-28',
  },
  {
    id: 'maraude-93-bobigny',
    title: 'Maraude mensuelle — Bobigny',
    type: 'maraude',
    organizer: 'Association An-Nour Bobigny',
    city: 'Bobigny',
    department: '93',
    description: 'Maraude mensuelle dans les rues de Bobigny et communes voisines. Distribution alimentaire et écoute.',
    contactUrl: 'https://www.helloasso.com/associations/an-nour-bobigny',
    imageKeyword: 'volunteer food distribution night',
    tags: ['93', 'mensuel', 'alimentaire'],
    recurring: true,
    nextDate: '2026-04-04',
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

// ============================================================
// VISITES DE MALADES
// ============================================================
export const visiteMalades: VisiteMalade[] = [
  {
    id: 'visite-ehpad-bobigny',
    title: 'Visite bénévole — EHPAD Les Tilleuls Bobigny',
    lieu: 'EHPAD Les Tilleuls',
    typeLieu: 'ehpad',
    organizer: 'JMF — Jeunes Musulmans de France IDF',
    city: 'Bobigny',
    department: '93',
    description: 'Rendez visite à des personnes âgées isolées. Lecture, jeux de société, échanges. Une heure qui compte énormément pour eux.',
    contactUrl: 'https://www.jmf.fr',
    tags: ['EHPAD', 'personnes âgées', 'bénévolat'],
    recurring: true,
    nextDate: '2026-04-05',
  },
  {
    id: 'visite-hopital-lariboisiere',
    title: 'Visite patients — Hôpital Lariboisière',
    lieu: 'Hôpital Lariboisière',
    typeLieu: 'hopital',
    organizer: 'Collectif Bienfaiteurs Paris',
    city: 'Paris 10e',
    department: '75',
    description: 'Apporter du réconfort aux patients isolés hospitalisés. Formation courte obligatoire (30 min). Partenariat avec l\'aumônerie.',
    contactUrl: 'https://www.ap-hp.fr/benevoles',
    tags: ['hôpital', 'patients', 'réconfort'],
    recurring: true,
    nextDate: '2026-04-12',
  },
  {
    id: 'visite-domicile-91',
    title: 'Aide à domicile — Personnes âgées Essonne',
    lieu: 'Domicile particuliers',
    typeLieu: 'domicile',
    organizer: 'Secours Islamique France',
    city: 'Évry-Courcouronnes',
    department: '91',
    description: 'Aide à domicile pour personnes âgées ou malades : courses, compagnie, lectures. Vous choisissez vos créneaux.',
    contactUrl: 'https://www.secours-islamique.org/benevoles',
    tags: ['domicile', 'aide', 'Essonne'],
    recurring: true,
    nextDate: '2026-04-07',
  },
  {
    id: 'visite-prison-93',
    title: 'Visite et soutien — Maison d\'arrêt de Villepinte',
    lieu: 'Maison d\'arrêt de Villepinte',
    typeLieu: 'prison',
    organizer: 'Aumônerie Musulmane de France',
    city: 'Villepinte',
    department: '93',
    description: 'L\'aumônerie recrute des bénévoles pour rendre visite aux détenus musulmans. Formation prise en charge. Acte de pure charité.',
    contactUrl: 'https://www.aumonerie-musulmane.fr',
    tags: ['prison', 'détenus', 'aumônerie'],
    recurring: true,
    nextDate: '2026-04-10',
  },
  {
    id: 'visite-ehpad-vincennes',
    title: 'Thé & Compagnie — EHPAD Vincennes',
    lieu: 'EHPAD Résidence des Marronniers',
    typeLieu: 'ehpad',
    organizer: 'Sœurs Bienveillantes 94',
    city: 'Vincennes',
    department: '94',
    description: 'Atelier thé et conversation avec des résidentes âgées. Initiative portée par des sœurs, ouverte aux hommes et aux femmes.',
    contactUrl: 'https://www.helloasso.com/associations/soeurs-bienveillantes-94',
    tags: ['EHPAD', 'sœurs', 'convivialité'],
    recurring: true,
    nextDate: '2026-04-19',
  },
];

// ============================================================
// VOYAGES HUMANITAIRES
// ============================================================
export const voyagesHumanitaires: VoyageHumanitaire[] = [
  {
    id: 'voyage-gaza-sif',
    title: 'Mission humanitaire — Gaza',
    destination: 'Gaza, Palestine',
    organizer: 'Secours Islamique France',
    organizerUrl: 'https://www.secours-islamique.org/missions-humanitaires',
    description: 'Rejoignez une équipe médicale et logistique sur le terrain à Gaza. Profils médicaux, logistique, communication. Encadrement complet.',
    duration: '10 à 14 jours',
    nextDeparture: '2026-05-10',
    price: 'Pris en charge par SIF',
    places: 8,
    imageKeyword: 'humanitarian aid relief',
    tags: ['Gaza', 'médical', 'logistique', 'terrain'],
  },
  {
    id: 'voyage-mali-puits',
    title: 'Chantier solidaire — Construction de puits Mali',
    destination: 'Région de Kayes, Mali',
    organizer: 'Islamic Relief France',
    organizerUrl: 'https://www.islamic-relief.fr/agir/partir-en-mission',
    description: 'Participez à la construction d\'infrastructures hydrauliques dans les villages isolés du Mali. Aucune compétence technique requise.',
    duration: '8 jours',
    nextDeparture: '2026-07-15',
    price: '1 200€ (vol inclus)',
    places: 12,
    imageKeyword: 'water well africa',
    tags: ['Mali', 'puits', 'eau', 'construction'],
  },
  {
    id: 'voyage-maroc-seisme',
    title: 'Reconstruction — Zones sinistrées Maroc',
    destination: 'Al-Haouz, Maroc',
    organizer: 'Human Appeal France',
    organizerUrl: 'https://www.human-appeal.fr/missions',
    description: 'Les villages du Haut-Atlas reconstruisent après le séisme de 2023. Bénévoles pour chantier, logistique et soutien psychosocial.',
    duration: '7 jours',
    nextDeparture: '2026-06-01',
    price: '900€',
    places: 15,
    imageKeyword: 'humanitarian aid relief',
    tags: ['Maroc', 'reconstruction', 'séisme', 'bénévolat'],
  },
  {
    id: 'voyage-senegal-education',
    title: 'Volontariat éducation — Sénégal',
    destination: 'Dakar & Thiès, Sénégal',
    organizer: 'Association Baraka World',
    organizerUrl: 'https://www.barakaworld.org/volontariat',
    description: 'Enseignement du français et soutien scolaire dans des écoles coraniques de Dakar et Thiès. Profil enseignant privilégié.',
    duration: '2 à 4 semaines',
    nextDeparture: '2026-08-01',
    price: '600€',
    places: 20,
    imageKeyword: 'children education school',
    tags: ['Sénégal', 'éducation', 'enseignement', 'Afrique'],
  },
  {
    id: 'voyage-turquie-refugies',
    title: 'Mission soutien réfugiés — Turquie',
    destination: 'Istanbul & Gaziantep, Turquie',
    organizer: 'Islamic Relief France',
    organizerUrl: 'https://www.islamic-relief.fr/agir/partir-en-mission',
    description: 'Accompagnement de réfugiés syriens en Turquie : distribution alimentaire, cours de langue, soutien administratif.',
    duration: '10 jours',
    nextDeparture: '2026-05-25',
    price: '850€',
    places: 10,
    imageKeyword: 'humanitarian aid relief',
    tags: ['Turquie', 'réfugiés', 'Syrie', 'soutien'],
  },
];

// ============================================================
// ASSOCIATIONS
// ============================================================
export const associations: Association[] = [
  {
    id: 'human-appeal',
    name: 'Human Appeal France',
    description: 'ONG humanitaire internationale avec programme Gaza, orphelins, eau et urgences. Reçu fiscal.',
    domaine: 'humanitaire',
    url: 'https://www.human-appeal.fr',
    national: true,
    logoEmoji: '🌍',
    tags: ['Gaza', 'orphelins', 'eau', 'urgence'],
  },
  {
    id: 'islamic-relief',
    name: 'Islamic Relief France',
    description: 'Aide humanitaire d\'urgence et développement dans 40 pays. Présente en France. Reçu fiscal.',
    domaine: 'humanitaire',
    url: 'https://www.islamic-relief.fr',
    national: true,
    logoEmoji: '🤝',
    tags: ['international', 'urgence', 'développement'],
  },
  {
    id: 'sif',
    name: 'Secours Islamique France',
    description: 'ONG française d\'aide humanitaire et de développement solidaire. Active dans 26 pays.',
    domaine: 'humanitaire',
    url: 'https://www.secours-islamique.org',
    national: true,
    logoEmoji: '🌙',
    tags: ['humanitaire', 'France', 'développement'],
  },
  {
    id: 'jmf',
    name: 'Jeunes Musulmans de France',
    description: 'Association nationale de jeunesse musulmane. Événements, bénévolat, formation citoyenne.',
    domaine: 'jeunesse',
    url: 'https://www.jmf.fr',
    national: true,
    logoEmoji: '👨‍👩‍👧‍👦',
    tags: ['jeunesse', 'citoyenneté', 'bénévolat'],
  },
  {
    id: 'launchgood',
    name: 'LaunchGood',
    description: 'Plateforme de crowdfunding pour la communauté musulmane mondiale. Milliers de projets actifs.',
    domaine: 'humanitaire',
    url: 'https://www.launchgood.com',
    national: false,
    logoEmoji: '🚀',
    tags: ['crowdfunding', 'projets', 'communauté'],
  },
  {
    id: 'helloasso',
    name: 'HelloAsso',
    description: 'Plateforme de financement participatif pour associations françaises. Zéro frais pour les associations.',
    domaine: 'social',
    url: 'https://www.helloasso.com',
    national: true,
    logoEmoji: '💙',
    tags: ['crowdfunding', 'associations', 'France'],
  },
  {
    id: 'aumonerie-musulmane',
    name: 'Aumônerie Musulmane de France',
    description: 'Présence spirituelle dans les prisons, hôpitaux et établissements publics. Bénévoles bienvenus.',
    domaine: 'social',
    url: 'https://www.aumonerie-musulmane.fr',
    national: true,
    logoEmoji: '🕌',
    tags: ['prison', 'hôpital', 'spiritualité', 'bénévolat'],
  },
  {
    id: 'baraka-world',
    name: 'Baraka World',
    description: 'Voyages solidaires et volontariat international en Afrique et au Moyen-Orient.',
    domaine: 'humanitaire',
    url: 'https://www.barakaworld.org',
    national: true,
    logoEmoji: '✈️',
    tags: ['voyage solidaire', 'volontariat', 'Afrique'],
  },
  {
    id: 'collectif-contre-islamophobie',
    name: 'Collectif contre l\'Islamophobie en France (CCIF)',
    description: 'Observation, documentation et lutte contre les actes islamophobes. Signalement en ligne.',
    domaine: 'droits',
    url: 'https://www.islamophobie.net',
    national: true,
    logoEmoji: '⚖️',
    tags: ['islamophobie', 'droits', 'signalement'],
  },
  {
    id: 'coordination-musulmane',
    name: 'Coordination Nationale des Musulmans de France',
    description: 'Coordination d\'associations et de mosquées pour défendre les intérêts de la communauté.',
    domaine: 'droits',
    url: 'https://www.cnmf.fr',
    national: true,
    logoEmoji: '🏛️',
    tags: ['coordination', 'mosquées', 'droits'],
  },
];
