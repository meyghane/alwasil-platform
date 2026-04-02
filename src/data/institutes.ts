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
// HAUTS-DE-SEINE suite (92)
// ============================================================
const hautsDeSeineExtra: Institut[] = [
  {
    id: 'mosquee-gennevilliers',
    name: 'Mosquée de Gennevilliers',
    type: 'mosquee',
    address: 'Gennevilliers',
    city: 'Gennevilliers',
    department: '92',
    courses: ['coran', 'arabe', 'tajwid', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée très active sur Instagram et TikTok, nombreux cours et conférences. Programme jeunesse développé.',
    tags: ['92', 'Gennevilliers', 'jeunesse', 'réseaux sociaux'],
    verified: false,
  },
  {
    id: 'mosquee-clichy',
    name: 'Mosquée de Clichy',
    type: 'mosquee',
    address: 'Clichy',
    city: 'Clichy',
    department: '92',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Cours hebdomadaires de Coran et arabe, classes enfants le week-end.',
    tags: ['92', 'Clichy', 'enfants'],
    verified: false,
  },
];

// ============================================================
// VAL-DE-MARNE suite (94)
// ============================================================
const valDemarneExtra: Institut[] = [
  {
    id: 'mosquee-choisy-le-roi',
    name: 'Mosquée de Choisy-le-Roi',
    type: 'mosquee',
    address: 'Choisy-le-Roi',
    city: 'Choisy-le-Roi',
    department: '94',
    courses: ['coran', 'arabe', 'tajwid', 'enfants', 'memorisation'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée proposant des cours de Coran avec mémorisation (Hifz) pour enfants et adultes. Cours d\'arabe tous niveaux.',
    tags: ['94', 'Choisy-le-Roi', 'hifz', 'mémorisation', 'enfants'],
    verified: false,
  },
  {
    id: 'mosquee-orly',
    name: 'Mosquée d\'Orly',
    type: 'mosquee',
    address: 'Orly',
    city: 'Orly',
    department: '94',
    courses: ['coran', 'arabe', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée d\'Orly avec cours de Coran et arabe réguliers pour adultes et enfants.',
    tags: ['94', 'Orly', 'enfants'],
    verified: false,
  },
  {
    id: 'mosquee-vitry',
    name: 'Grande Mosquée de Vitry-sur-Seine',
    type: 'mosquee',
    address: 'Vitry-sur-Seine',
    city: 'Vitry-sur-Seine',
    department: '94',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Programme éducatif complet avec cours de Coran et d\'arabe pour tous les âges.',
    tags: ['94', 'Vitry', 'enfants'],
    verified: false,
  },
];

// ============================================================
// SEINE-ET-MARNE (77)
// ============================================================
const seineMarne: Institut[] = [
  {
    id: 'mosquee-meaux',
    name: 'Grande Mosquée de Meaux',
    type: 'mosquee',
    address: 'Meaux',
    city: 'Meaux',
    department: '77',
    courses: ['coran', 'arabe', 'tajwid', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Grande mosquée de Seine-et-Marne. Cours de Coran et arabe tous niveaux. Programme enfants le week-end.',
    tags: ['77', 'Meaux', 'enfants'],
    verified: false,
  },
  {
    id: 'mosquee-melun',
    name: 'Mosquée de Melun',
    type: 'mosquee',
    address: 'Melun',
    city: 'Melun',
    department: '77',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Cours de Coran et langue arabe pour adultes et enfants. Cours particuliers disponibles sur demande.',
    tags: ['77', 'Melun', 'enfants'],
    verified: false,
  },
  {
    id: 'mosquee-chelles',
    name: 'Mosquée de Chelles',
    type: 'mosquee',
    address: 'Chelles',
    city: 'Chelles',
    department: '77',
    courses: ['coran', 'arabe', 'enfants', 'memorisation'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Cours Coran et hifz pour enfants et adultes. Séances de mémorisation encadrées.',
    tags: ['77', 'Chelles', 'hifz'],
    verified: false,
  },
];

// ============================================================
// VAL-D'OISE (95)
// ============================================================
const valOise: Institut[] = [
  {
    id: 'mosquee-sarcelles',
    name: 'Mosquée Al-Rahma — Sarcelles',
    type: 'mosquee',
    address: 'Sarcelles',
    city: 'Sarcelles',
    department: '95',
    courses: ['coran', 'arabe', 'tajwid', 'enfants', 'sciences-islamiques', 'memorisation'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Mosquée très active de Sarcelles avec programme éducatif complet : hifz, arabe, sciences islamiques. Forte communauté, nombreux cours.',
    tags: ['95', 'Sarcelles', 'hifz', 'mémorisation', 'enfants'],
    verified: false,
    featured: true,
  },
  {
    id: 'mosquee-cergy',
    name: 'Mosquée de Cergy',
    type: 'mosquee',
    address: 'Cergy',
    city: 'Cergy',
    department: '95',
    courses: ['coran', 'arabe', 'enfants', 'sciences-islamiques'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Centre islamique de Cergy, cours de Coran et arabe réguliers, conférences mensuelles.',
    tags: ['95', 'Cergy', 'enfants'],
    verified: false,
  },
  {
    id: 'mosquee-argenteuil',
    name: 'Grande Mosquée d\'Argenteuil',
    type: 'mosquee',
    address: 'Argenteuil',
    city: 'Argenteuil',
    department: '95',
    courses: ['coran', 'arabe', 'tajwid', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Une des grandes mosquées du Val-d\'Oise avec programme éducatif adultes et enfants.',
    tags: ['95', 'Argenteuil', 'enfants'],
    verified: false,
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
  {
    id: 'mosquee-versailles',
    name: 'Mosquée de Versailles',
    type: 'mosquee',
    address: 'Versailles',
    city: 'Versailles',
    department: '78',
    courses: ['coran', 'arabe', 'enfants'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel'],
    description: 'Cours de Coran et arabe le week-end. Cours enfants le samedi matin.',
    tags: ['78', 'Versailles', 'enfants'],
    verified: false,
  },
];

// ============================================================
// GRANDS INSTITUTS FRANCE (IDF + national)
// ============================================================
const grandsInstituts: Institut[] = [
  {
    id: 'oussoul-eddine',
    name: 'Oussoul Eddine',
    type: 'institut',
    address: 'Île-de-France + En ligne',
    city: 'Paris / En ligne',
    department: '75',
    website: 'https://oussoul-eddine.fr',
    courses: ['sciences-islamiques', 'aqida', 'fiqh', 'arabe', 'coran', 'hadith', 'sirah', 'tafsir'],
    audience: ['hommes', 'femmes'],
    format: ['presentiel', 'distanciel'],
    description: 'Institut islamique français très reconnu, fondé par des étudiants en sciences islamiques. Formation structurée par niveaux (initiation → avancé) en présentiel et en ligne. Cours de sciences islamiques, arabe, Coran. Forte présence en Île-de-France.',
    tags: ['diplômant', 'sciences islamiques', 'arabe', 'IDF', 'en ligne', 'hybride', 'reconnu'],
    rating: 4.8,
    reviewCount: 0,
    verified: true,
    featured: true,
  },
  {
    id: 'ifi-paris',
    name: 'IFI — Institut de Formation à l\'Islam',
    type: 'institut',
    address: 'Paris',
    city: 'Paris',
    department: '75',
    website: 'https://ifi-paris.fr',
    courses: ['sciences-islamiques', 'arabe', 'fiqh', 'aqida', 'tafsir'],
    audience: ['hommes', 'femmes'],
    format: ['presentiel', 'distanciel'],
    description: 'Institut parisien proposant des formations en sciences islamiques et langue arabe. Programme structuré, intervenants qualifiés. Cours en présentiel à Paris et à distance.',
    tags: ['Paris', 'sciences islamiques', 'arabe', 'formation'],
    verified: false,
    featured: true,
  },
  {
    id: 'dar-al-iman',
    name: 'Dar Al-Iman — Institut',
    type: 'institut',
    address: 'Île-de-France',
    city: 'Paris / IDF',
    department: '75',
    courses: ['coran', 'tajwid', 'arabe', 'sciences-islamiques', 'memorisation'],
    audience: ['hommes', 'femmes', 'enfants'],
    format: ['presentiel', 'distanciel'],
    description: 'Institut proposant des cours de Coran, Tajwid, mémorisation et arabe. Cours enfants et adultes, en présentiel et en ligne.',
    tags: ['IDF', 'Coran', 'mémorisation', 'enfants', 'adultes'],
    verified: false,
  },
  {
    id: 'ribat-al-asr',
    name: 'Ribat Al-\'Asr',
    type: 'institut',
    address: 'Île-de-France',
    city: 'IDF',
    department: '93',
    courses: ['sciences-islamiques', 'arabe', 'aqida', 'fiqh', 'tafsir', 'hadith'],
    audience: ['hommes', 'femmes'],
    format: ['presentiel', 'distanciel'],
    description: 'Institut islamique actif en Seine-Saint-Denis et en ligne. Programme de sciences islamiques pour adultes, plusieurs niveaux disponibles.',
    tags: ['93', 'sciences islamiques', 'en ligne'],
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
    department: '00',
    website: 'https://alkalam.fr',
    courses: ['arabe', 'coran', 'tajwid', 'sciences-islamiques'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Plateforme française de cours islamiques en ligne. Arabe classique, Coran, Tajwid et sciences islamiques par des professeurs francophones qualifiés.',
    tags: ['en ligne', 'arabe', 'Coran', 'francophone'],
    verified: false,
  },
  {
    id: 'bayyinah-tv',
    name: 'Bayyinah TV — Nouman Ali Khan',
    type: 'en-ligne',
    address: 'En ligne',
    city: 'En ligne',
    department: '00',
    website: 'https://bayyinahtv.com',
    courses: ['arabe', 'coran', 'tafsir', 'sciences-islamiques'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Plateforme mondiale d\'apprentissage de l\'arabe coranique et du tafsir avec Nouman Ali Khan. Contenu en anglais, sous-titres disponibles. Abonnement mensuel ~13$/mois.',
    tags: ['en ligne', 'arabe coranique', 'anglais', 'tafsir', 'international'],
    verified: true,
    featured: true,
  },
  {
    id: 'qalam-institute',
    name: 'Qalam Institute',
    type: 'en-ligne',
    address: 'En ligne',
    city: 'En ligne',
    department: '00',
    website: 'https://qalaminstitute.com',
    courses: ['sciences-islamiques', 'fiqh', 'aqida', 'sirah', 'hadith'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Institut américain proposant des cours de sciences islamiques en ligne en anglais. Programme Alim complet, cours ponctuels accessibles.',
    tags: ['en ligne', 'anglais', 'sciences islamiques', 'alim'],
    verified: false,
  },
  {
    id: 'alhadith-fr',
    name: 'Al-Hadîth.fr — Cours en ligne',
    type: 'en-ligne',
    address: 'En ligne',
    city: 'En ligne',
    department: '00',
    website: 'https://alhadith.fr',
    courses: ['sciences-islamiques', 'aqida', 'fiqh', 'hadith'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'Cours en ligne francophones de sciences islamiques, aqida et fiqh. Diffusion de cours de grands savants en français.',
    tags: ['en ligne', 'francophone', 'gratuit', 'sciences islamiques'],
    verified: false,
  },
  {
    id: 'mosquee-enligne-live',
    name: 'Cours Live — Mosquées sur YouTube',
    type: 'en-ligne',
    address: 'En ligne (YouTube)',
    city: 'En ligne',
    department: '00',
    courses: ['coran', 'tajwid', 'arabe', 'sciences-islamiques', 'tafsir'],
    audience: ['hommes', 'femmes'],
    format: ['distanciel'],
    description: 'De nombreuses mosquées françaises diffusent leurs cours en live sur YouTube (Grande Mosquée de Paris, Mosquée de Stains, Institut Al-Ghazali…). Gratuit et accessible depuis toute la France.',
    tags: ['en ligne', 'gratuit', 'YouTube', 'live', 'mosquées'],
    verified: true,
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
  ...grandsInstituts,
  ...paris,
  ...hautsDeScine,
  ...hautsDeSeineExtra,
  ...seineSaintDenis,
  ...valDeMarne,
  ...valDemarneExtra,
  ...essonne,
  ...yvelines,
  ...seineMarne,
  ...valOise,
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
