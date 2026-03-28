export type JobType = 'cdi' | 'cdd' | 'freelance' | 'stage' | 'alternance' | 'benevole';
export type JobSector = 'tech' | 'sante' | 'education' | 'commerce' | 'juridique' | 'humanitaire' | 'finance' | 'communication' | 'autre';
export type FriendlyLevel = 'voile-ok' | 'priere-ok' | 'full-friendly';

export type JobOffer = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string; // emoji fallback
  location: string;
  department?: string;
  remote: 'full' | 'hybrid' | 'on-site';
  type: JobType;
  sector: JobSector;
  friendly: FriendlyLevel[];
  salary?: string;
  description: string;
  tags: string[];
  postedBy?: string; // membre communauté qui recommande
  postedDate: string;
  url: string;
  featured?: boolean;
  cmn?: boolean; // via CMN (Cadre Musulman Network)
};

export type TalentProfile = {
  id: string;
  name: string;
  initials: string;
  role: string;
  sector: JobSector;
  location: string;
  remote: boolean;
  skills: string[];
  bio: string;
  available: boolean;
  cmn?: boolean;
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  freelance: 'Freelance',
  stage: 'Stage',
  alternance: 'Alternance',
  benevole: 'Bénévolat',
};

export const JOB_SECTOR_LABELS: Record<JobSector, string> = {
  tech: '💻 Tech & Digital',
  sante: '🏥 Santé',
  education: '📚 Éducation',
  commerce: '🛍️ Commerce & Retail',
  juridique: '⚖️ Juridique',
  humanitaire: '🤲 Humanitaire',
  finance: '💼 Finance & Compta',
  communication: '📣 Communication',
  autre: '🔧 Autre',
};

export const FRIENDLY_LABELS: Record<FriendlyLevel, string> = {
  'voile-ok': '🧕 Voile accepté',
  'priere-ok': '🕌 Prière acceptée',
  'full-friendly': '⭐ 100% Muslim Friendly',
};

export const FRIENDLY_COLORS: Record<FriendlyLevel, string> = {
  'voile-ok': '#8b5cf6',
  'priere-ok': '#059669',
  'full-friendly': '#f59e0b',
};

export const REMOTE_LABELS: Record<string, string> = {
  full: '🏠 Full remote',
  hybrid: '🔀 Hybride',
  'on-site': '📍 Présentiel',
};

export const jobOffers: JobOffer[] = [
  {
    id: 'j1',
    title: 'Développeur·euse Full Stack (React / Node.js)',
    company: 'Anavrin Technologies',
    companyLogo: '💻',
    location: 'Paris 11e',
    department: '75',
    remote: 'hybrid',
    type: 'cdi',
    sector: 'tech',
    friendly: ['voile-ok', 'priere-ok', 'full-friendly'],
    salary: '45–55k€',
    description: 'Startup tech islamique cherche dev fullstack passionné·e. Stack moderne, équipe bienveillante, respect des obligations religieuses (prière, voile, Ramadan). Environnement halal (aucun alcool en événements d\'entreprise).',
    tags: ['react', 'nodejs', 'typescript', 'startup'],
    postedBy: 'Ibrahim M. (CMN)',
    postedDate: '2026-03-20',
    url: '#',
    featured: true,
    cmn: true,
  },
  {
    id: 'j2',
    title: 'Infirmier·ère diplômé·e d\'État',
    company: 'Clinique Val de Seine',
    companyLogo: '🏥',
    location: 'Versailles (78)',
    department: '78',
    remote: 'on-site',
    type: 'cdi',
    sector: 'sante',
    friendly: ['voile-ok', 'priere-ok'],
    salary: '2 200–2 800€ net/mois',
    description: 'Clinique privée cherche IDE. Direction sensibilisée à la diversité, port du voile toléré, salle de prière disponible dans l\'établissement. Planning adapté pour Ramadan.',
    tags: ['ide', 'soins', 'clinique', 'ile-de-france'],
    postedBy: 'Fatima K.',
    postedDate: '2026-03-18',
    url: '#',
    featured: false,
  },
  {
    id: 'j3',
    title: 'Comptable / Assistant·e Financier·ère',
    company: 'Cabinet Hilal Expertise',
    companyLogo: '💼',
    location: 'Montreuil (93)',
    department: '93',
    remote: 'hybrid',
    type: 'cdi',
    sector: 'finance',
    friendly: ['voile-ok', 'priere-ok', 'full-friendly'],
    salary: '32–40k€',
    description: 'Cabinet comptable dirigé par des musulmans, environnement 100% halal. Comptabilité générale, TVA, bilans. Bac+2 minimum. Maîtrise Sage et Excel requise.',
    tags: ['comptabilite', 'finance', 'sage', 'bilan'],
    postedBy: 'Youssef A.',
    postedDate: '2026-03-15',
    url: '#',
    cmn: true,
  },
  {
    id: 'j4',
    title: 'Enseignant·e de mathématiques — Collège/Lycée',
    company: 'École privée Ibn Rushd',
    companyLogo: '📚',
    location: 'Évry-Courcouronnes (91)',
    department: '91',
    remote: 'on-site',
    type: 'cdi',
    sector: 'education',
    friendly: ['voile-ok', 'priere-ok', 'full-friendly'],
    salary: '2 100–2 600€ net',
    description: 'École privée islamique laïque cherche professeur de maths passionné·e. Les valeurs islamiques sont au cœur du projet éducatif. Ambiance familiale, petits effectifs.',
    tags: ['enseignement', 'maths', 'ecole-islamique', '91'],
    postedBy: 'Direction Ibn Rushd',
    postedDate: '2026-03-12',
    url: '#',
  },
  {
    id: 'j5',
    title: 'Chargé·e de Communication Digitale',
    company: 'Association Salam Action',
    companyLogo: '📣',
    location: 'Paris 18e / Remote',
    department: '75',
    remote: 'hybrid',
    type: 'cdi',
    sector: 'humanitaire',
    friendly: ['voile-ok', 'priere-ok', 'full-friendly'],
    salary: '30–36k€',
    description: 'Association humanitaire reconnue cherche un·e chargé·e de comm pour gérer réseaux sociaux, newsletters et campagnes de dons. Sens du service et valeurs islamiques partagées.',
    tags: ['social-media', 'communication', 'asso', 'humanitaire'],
    postedBy: undefined,
    postedDate: '2026-03-10',
    url: '#',
    cmn: false,
  },
  {
    id: 'j6',
    title: 'Avocat·e Collaborateur·rice — Droit Social',
    company: 'Cabinet Droit & Dignité',
    companyLogo: '⚖️',
    location: 'Paris 9e',
    department: '75',
    remote: 'hybrid',
    type: 'cdi',
    sector: 'juridique',
    friendly: ['voile-ok', 'priere-ok'],
    salary: '45–60k€',
    description: 'Cabinet spécialisé en droit du travail et discriminations. Cherche avocat collaborateur (Min. 2 ans d\'expérience). Expertise en discrimination religieuse très appréciée.',
    tags: ['droit-social', 'avocat', 'discrimination', 'paris'],
    postedBy: 'Mme Benali (CMN)',
    postedDate: '2026-03-08',
    url: '#',
    featured: true,
    cmn: true,
  },
  {
    id: 'j7',
    title: 'Développeur·euse Mobile (React Native)',
    company: 'HalalTech Labs',
    companyLogo: '📱',
    location: 'Full Remote',
    remote: 'full',
    type: 'freelance',
    sector: 'tech',
    friendly: ['voile-ok', 'priere-ok', 'full-friendly'],
    salary: '400–550€/jour',
    description: 'Mission freelance 3–6 mois sur une app de finances islamiques (zakat, investissement halal). Stack React Native + TypeScript. Démarrage dès que possible.',
    tags: ['react-native', 'mobile', 'freelance', 'fintech-halal'],
    postedBy: 'Karim D.',
    postedDate: '2026-03-05',
    url: '#',
  },
  {
    id: 'j8',
    title: 'Assistant·e Social·e',
    company: 'Mairie de Saint-Denis',
    companyLogo: '🏛️',
    location: 'Saint-Denis (93)',
    department: '93',
    remote: 'on-site',
    type: 'cdi',
    sector: 'sante',
    friendly: ['priere-ok'],
    salary: 'Grille FPT',
    description: 'Poste dans la fonction publique territoriale. Le port du voile n\'est pas autorisé (principe de neutralité FP) mais la direction est sensible au fait religieux et les horaires de prière sont respectés.',
    tags: ['social', 'fp', '93', 'aide-sociale'],
    postedBy: undefined,
    postedDate: '2026-03-01',
    url: '#',
  },
];

export const talentProfiles: TalentProfile[] = [
  {
    id: 't1',
    name: 'Aicha B.',
    initials: 'AB',
    role: 'Data Analyst',
    sector: 'tech',
    location: 'Paris',
    remote: true,
    skills: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
    bio: 'Data analyst 4 ans d\'expérience, disponible dès avril. Cherche entreprise respectueuse des obligations religieuses.',
    available: true,
    cmn: true,
  },
  {
    id: 't2',
    name: 'Omar L.',
    initials: 'OL',
    role: 'Juriste en droit des affaires',
    sector: 'juridique',
    location: 'Île-de-France',
    remote: false,
    skills: ['Contrats', 'M&A', 'Droit OHADA', 'Arabe juridique'],
    bio: 'Master 2 droit des affaires Paris II. Cherche cabinet ou entreprise en CDI. Disponible immédiatement.',
    available: true,
    cmn: true,
  },
  {
    id: 't3',
    name: 'Nour H.',
    initials: 'NH',
    role: 'UX Designer',
    sector: 'communication',
    location: 'Lyon (remote possible)',
    remote: true,
    skills: ['Figma', 'User Research', 'Design System', 'Accessibilité'],
    bio: '3 ans en agence, cherche mission freelance ou CDI dans entreprise éthique. Spécialité e-commerce et apps mobiles.',
    available: false,
    cmn: false,
  },
  {
    id: 't4',
    name: 'Yacine T.',
    initials: 'YT',
    role: 'Infirmier DE',
    sector: 'sante',
    location: 'Île-de-France',
    remote: false,
    skills: ['Soins infirmiers', 'Urgences', 'Pédiatrie', 'Gériatrie'],
    bio: 'IDE 6 ans d\'expérience CHU. Cherche poste dans structure respectant la pratique religieuse (salle de prière, voile toléré).',
    available: true,
    cmn: false,
  },
  {
    id: 't5',
    name: 'Salma K.',
    initials: 'SK',
    role: 'Chef de Projet Digital',
    sector: 'tech',
    location: 'Paris',
    remote: true,
    skills: ['Agile/Scrum', 'Jira', 'Marketing Digital', 'SEO'],
    bio: '5 ans chef de projet en startup. Disponible en avril. Cherche environnement bienveillant et mission à impact.',
    available: true,
    cmn: true,
  },
  {
    id: 't6',
    name: 'Adam F.',
    initials: 'AF',
    role: 'Expert-Comptable stagiaire',
    sector: 'finance',
    location: 'Seine-Saint-Denis',
    remote: false,
    skills: ['Comptabilité générale', 'Sage', 'Consolidation', 'Finance islamique'],
    bio: 'En cours de stage EC. Spécialisation finance islamique (zakat, sukuk). Cherche cabinet pour fin de stage.',
    available: true,
    cmn: false,
  },
];
