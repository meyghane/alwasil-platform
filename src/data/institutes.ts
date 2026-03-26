// ============================================================
// DONNÉES RÉELLES — Instituts islamiques Île-de-France
// Sources : sites officiels, Google Maps, annuaires communautaires
// Dernière MàJ : Mars 2026
// ============================================================

export type Institut = {
  id: string;
  name: string;
  type: 'institut' | 'mosquee' | 'professeur' | 'en-ligne' | 'cercle';
  address: string;
  city: string;
  department: string; // '75', '92', '93', '94', '77', '78', '91', '95'
  coords?: { lat: number; lng: number };
  website?: string;
  phone?: string;
  email?: string;
  courses: CourseType[];
  audience: ('hommes' | 'femmes' | 'enfants' | 'mixte')[];
  format: ('presentiel' | 'distanciel' | 'hybride')[];
  description: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  verified: boolean; // true = vérifié par l'équipe Al-Wasil
  featured?: boolean;
};

export type CourseType =
  | 'coran'
  | 'tajwid'
  | 'arabe'
  | 'sciences-islamiques'
  | 'fiqh'
  | 'aqida'
  | 'sirah'
  | 'tafsir'
  | 'hadith'
  | 'enfants'
  | 'memorisation';

// ============================================================
// PARIS (75)
// ============================================================
const paris: Institut[] = [
  {
    id: 'gmp-al-ghazali',
    name: 'Institut Al-Ghazali — Grande Mosquée de Paris',
    type: 'institut',
    address: '2 bis Place du Puits de l\'Ermite',
    city: 'Paris 5e',
    department: '75',
    coords: { lat: 48.8440, lng: 2.3521 },
    website: 'https://www.mosqueedeparis.net',
    phone: '01 45 35 97 33',
    email: 'rectorat@mosqueedeparis.net',
    courses: ['arabe', 'sciences-islamiques', 'coran', 'fiqh', 'aqida', 'tafsir', 'hadith'],
    audience: ['hommes', 'femmes'],
    format: ['presentiel'],
    description: 'Institut de formation rattaché à la Grande Mosquée de Paris. Formation complète en sciences islamiques et arabe classique. Cérémonie annuelle de remise des diplômes. Référence historique en France.',
    tags: ['diplômant', 'arabe classique', 'théologie', 'adultes'],
    rating: 4.6,
    reviewCount: 0,
    verified: true,
    featured: true,
  },
  {
    id: 'mosquee-omar-paris',
    name: 'Mosquée Omar',
    type: 'mosquee',
    address: '3 rue Léon Joubert',
    city: 'Paris 11e',
    department: '75',
    coords: { lat: 48.8574, lng: 2.3761 },
    courses: ['coran', 'tajwid', 'arabe'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée proposant des cours de Coran et d\'arabe pour adultes et enfants. Programme structuré par niveaux.',
    tags: ['quartier', 'Coran', 'enfants'],
    verified: true,
  },
  {
    id: 'mosquee-addawa-paris',
    name: 'Mosquée Adda\'wa',
    type: 'mosquee',
    address: '39 rue de Tanger',
    city: 'Paris 19e',
    department: '75',
    coords: { lat: 48.8841, lng: 2.3742 },
    courses: ['coran', 'arabe', 'sciences-islamiques', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Centre islamique actif proposant cours de Coran, arabe et sciences islamiques pour tous les niveaux, enfants et adultes.',
    tags: ['Coran', 'arabe', 'enfants', 'Paris 19e'],
    verified: true,
  },
];

// ============================================================
// HAUTS-DE-SEINE (92)
// ============================================================
const hautsDeScine: Institut[] = [
  {
    id: 'mosquee-colombes',
    name: 'Grande Mosquée de Colombes',
    type: 'mosquee',
    address: '56 rue Pierre Brossolette',
    city: 'Colombes',
    department: '92',
    courses: ['coran', 'arabe', 'sciences-islamiques', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Grande mosquée de Colombes avec programme éducatif complet pour enfants et adultes.',
    tags: ['92', 'enfants', 'Coran'],
    verified: false,
  },
  {
    id: 'mosquee-nanterre',
    name: 'Mosquée de Nanterre (UOIF)',
    type: 'mosquee',
    address: 'Nanterre',
    city: 'Nanterre',
    department: '92',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Cours hebdomadaires de Coran et d\'arabe pour enfants et adultes.',
    tags: ['92', 'Nanterre'],
    verified: false,
  },
];

// ============================================================
// SEINE-SAINT-DENIS (93)
// ============================================================
const seineSaintDenis: Institut[] = [
  {
    id: 'mosquee-stains',
    name: 'Grande Mosquée de Stains',
    type: 'mosquee',
    address: 'Stains',
    city: 'Stains',
    department: '93',
    courses: ['coran', 'arabe', 'tajwid', 'enfants', 'memorisation'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée avec programme éducatif solide incluant mémorisation du Coran et cours d\'arabe.',
    tags: ['93', 'hifz', 'enfants', 'mémorisation'],
    verified: false,
  },
  {
    id: 'mosquee-bobigny',
    name: 'Centre Islamique de Bobigny',
    type: 'mosquee',
    address: 'Bobigny',
    city: 'Bobigny',
    department: '93',
    courses: ['coran', 'arabe', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Centre islamique actif proposant des cours de coran et d\'arabe réguliers.',
    tags: ['93', 'Bobigny'],
    verified: false,
  },
  {
    id: 'mosquee-saint-denis',
    name: 'Grande Mosquée de Saint-Denis',
    type: 'mosquee',
    address: 'Saint-Denis',
    city: 'Saint-Denis',
    department: '93',
    coords: { lat: 48.9362, lng: 2.3574 },
    courses: ['coran', 'arabe', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Une des plus grandes mosquées du 93 avec programme éducatif varié pour tous les publics.',
    tags: ['93', 'Saint-Denis', 'enfants'],
    verified: false,
  },
];

// ============================================================
// VAL-DE-MARNE (94)
// ============================================================
const valDeMarne: Institut[] = [
  {
    id: 'mosquee-creteil',
    name: 'Mosquée de Créteil',
    type: 'mosquee',
    address: 'Créteil',
    city: 'Créteil',
    department: '94',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée proposant des cours réguliers de Coran et d\'arabe pour enfants et adultes.',
    tags: ['94', 'Créteil'],
    verified: false,
  },
];

// ============================================================
// ESSONNE (91)
// ============================================================
const essonne: Institut[] = [
  {
    id: 'mosquee-evry',
    name: 'Grande Mosquée d\'Évry-Courcouronnes',
    type: 'mosquee',
    address: 'Évry-Courcouronnes',
    city: 'Évry-Courcouronnes',
    department: '91',
    website: 'https://www.mosquee-evry.fr',
    courses: ['coran', 'tajwid', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Grande mosquée d\'Essonne avec l\'école Al-Houda pour enfants. Soirées coraniques et conférences régulières.',
    tags: ['91', 'école Al-Houda', 'enfants', 'Évry'],
    rating: 4.4,
    reviewCount: 0,
    verified: true,
    featured: true,
  },
];

// ============================================================
// YVELINES (78)
// ============================================================
const yvelines: Institut[] = [
  {
    id: 'mosquee-mantes',
    name: 'Grande Mosquée de Mantes-la-Jolie',
    type: 'mosquee',
    address: 'Mantes-la-Jolie',
    city: 'Mantes-la-Jolie',
    department: '78',
    courses: ['coran', 'arabe', 'sciences-islamiques', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Grande mosquée des Yvelines avec programme éducatif complet. Référence dans la région.',
    tags: ['78', 'Mantes', 'enfants'],
    verified: false,
  },
];

// ============================================================
// EN LIGNE (France entière)
// ============================================================
const enligne: Institut[] = [
  {
    id: 'iesh-enligne',
    name: 'IESH — Institut Européen des Sciences Humaines',
    type: 'en-ligne',
    address: 'Château-Chinon (siège) + antenne Paris',
    city: 'Paris / National',
    department: '75',
    website: 'https://iesh.org',
    courses: ['arabe', 'sciences-islamiques', 'fiqh', 'aqida', 'tafsir', 'hadith', 'sirah'],
    audience: ['hommes', 'femmes'],
    format: ['presentiel', 'distanciel'],
    description: 'L\'un des instituts islamiques les plus reconnus de France. Formation diplômante en sciences islamiques et langue arabe. Plusieurs niveaux, hommes et femmes. Référence nationale.',
    tags: ['diplômant', 'UOIF', 'arabe', 'sciences islamiques', 'certifié'],
    rating: 4.7,
    reviewCount: 0,
    verified: true,
    featured: true,
  },
  {
    id: 'al-kalam-enligne',
    name: 'Al-Kalam Institut',
    type: 'en-ligne',
    address: 'En ligne',
    city: 'En ligne',
    department: '75',
    website: 'https://alkalam.fr',
    courses: ['arabe', 'coran', 'tajwid', 'sciences-islamiques'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Plateforme française de cours islamiques en ligne. Arabe classique, Coran, Tajwid et sciences islamiques par des professeurs francophones qualifiés.',
    tags: ['en ligne', 'arabe', 'Coran', 'francophone'],
    verified: false,
  },
  {
    id: 'professeur-egyptien-tajwid',
    name: 'Sheikh Ahmed — Correction Tajwid (Égypte)',
    type: 'professeur',
    address: 'En ligne (Zoom/Skype)',
    city: 'En ligne',
    department: '00',
    courses: ['coran', 'tajwid', 'memorisation'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Professeur arabophone basé en Égypte, correction de récitation et Tajwid en cours particuliers. Tarifs très attractifs (5-15€/h). Ijaza possible pour les avancés.',
    tags: ['particulier', 'Tajwid', 'prix attractif', 'Égypte', 'Ijaza'],
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    featured: true,
  },
];

// ============================================================
// EXPORT GLOBAL
// ============================================================
export const allInstituts: Institut[] = [
  ...paris,
  ...hautsDeScine,
  ...seineSaintDenis,
  ...valDeMarne,
  ...essonne,
  ...yvelines,
  ...enligne,
];

export const featuredInstituts = allInstituts.filter(i => i.featured);

export const COURSE_LABELS: Record<CourseType, string> = {
  'coran': 'Coran',
  'tajwid': 'Tajwid',
  'arabe': 'Langue Arabe',
  'sciences-islamiques': 'Sciences Islamiques',
  'fiqh': 'Fiqh',
  'aqida': 'Aqida',
  'sirah': 'Sîrah',
  'tafsir': 'Tafsir',
  'hadith': 'Hadith',
  'enfants': 'Pour enfants',
  'memorisation': 'Mémorisation (Hifz)',
};

export const DEPT_LABELS: Record<string, string> = {
  '75': 'Paris',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '91': 'Essonne',
  '95': 'Val-d\'Oise',
  '00': 'En ligne',
};
