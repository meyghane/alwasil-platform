export type LibrairieType = 'physique' | 'en-ligne' | 'mixte';
export type LibrairieSpecialite =
  | 'coran-tafsir'
  | 'hadith'
  | 'fiqh'
  | 'arabe'
  | 'enfants'
  | 'histoire-islam'
  | 'spiritualite'
  | 'livres-francais'
  | 'vetements'
  | 'accessoires'
  | 'parfums-huiles';

export type Librairie = {
  id: string;
  name: string;
  type: LibrairieType;
  description: string;
  adresse?: string;
  ville: string;
  department: string;
  arrondissement?: string;
  horaires?: string;
  fermeture?: string; // ex: "Fermé dimanche"
  phone?: string;
  website?: string;
  instagram?: string;
  maps?: string;
  specialites: LibrairieSpecialite[];
  langues: string[]; // langues des livres vendus
  tags: string[];
  featured?: boolean;
  online: boolean;
  livraison?: boolean;
  rating?: number;
  reviews?: number;
  note?: string; // info utile ex: "Espace femmes séparé"
};

export const SPECIALITE_LABELS: Record<LibrairieSpecialite, string> = {
  'coran-tafsir': '📖 Coran & Tafsir',
  'hadith': '📜 Hadith',
  'fiqh': '⚖️ Fiqh',
  'arabe': '🔤 Langue arabe',
  'enfants': '👶 Enfants',
  'histoire-islam': '🏛️ Histoire islamique',
  'spiritualite': '🌙 Spiritualité',
  'livres-francais': '🇫🇷 Livres en français',
  'vetements': '👘 Vêtements islamiques',
  'accessoires': '📿 Accessoires (tasbih, miswak…)',
  'parfums-huiles': '🌹 Parfums & huiles',
};

export const librairies: Librairie[] = [
  {
    id: 'lib1',
    name: 'Librairie Tawhid',
    type: 'mixte',
    description: 'L\'une des plus grandes librairies islamiques de France. Fondée en 1985 à Paris, elle propose plus de 5 000 références en français, arabe et anglais. Livres de sciences islamiques, manuels d\'arabe, CD, vêtements et accessoires.',
    adresse: '23 rue des Fossés-Saint-Bernard',
    ville: 'Paris',
    department: '75',
    arrondissement: '5e',
    horaires: 'Lun–Sam 10h–19h',
    fermeture: 'Dimanche fermé',
    phone: '01 43 25 05 85',
    website: 'https://www.tawhid.fr',
    instagram: 'https://www.instagram.com/librairie_tawhid',
    maps: '#',
    specialites: ['coran-tafsir', 'hadith', 'fiqh', 'arabe', 'enfants', 'livres-francais', 'vetements', 'accessoires'],
    langues: ['Français', 'Arabe', 'Anglais'],
    tags: ['référence', 'paris', 'grande-surface', 'fondée-1985'],
    featured: true,
    online: true,
    livraison: true,
    rating: 4.7,
    reviews: 1823,
    note: 'Livraison France et international disponible sur le site',
  },
  {
    id: 'lib2',
    name: 'Al-Bouraq Éditions & Librairie',
    type: 'mixte',
    description: 'Maison d\'édition et librairie spécialisée dans les traductions françaises de classiques islamiques. Large choix de livres de spiritualité, soufisme et textes fondamentaux traduits par des spécialistes.',
    adresse: '26 rue Merlin',
    ville: 'Paris',
    department: '75',
    arrondissement: '11e',
    horaires: 'Lun–Sam 10h–18h30',
    phone: '01 43 79 35 35',
    website: 'https://www.albouraq.com',
    maps: '#',
    specialites: ['spiritualite', 'livres-francais', 'histoire-islam', 'coran-tafsir'],
    langues: ['Français', 'Arabe'],
    tags: ['éditions', 'spiritualité', 'traductions', 'classiques'],
    featured: false,
    online: true,
    livraison: true,
    rating: 4.6,
    reviews: 412,
  },
  {
    id: 'lib3',
    name: 'Ennour Librairie',
    type: 'physique',
    description: 'Librairie islamique de référence à Saint-Denis. Grand choix de livres, manuels d\'arabe, Corans de toutes tailles, vêtements islamiques, parfums et accessoires. Accueil chaleureux, conseils personnalisés.',
    adresse: '12 rue de la Légion d\'Honneur',
    ville: 'Saint-Denis',
    department: '93',
    horaires: 'Lun–Sam 9h30–19h30, Dim 10h–17h',
    phone: '01 48 09 XX XX',
    instagram: '#',
    maps: '#',
    specialites: ['coran-tafsir', 'arabe', 'enfants', 'vetements', 'accessoires', 'parfums-huiles'],
    langues: ['Français', 'Arabe'],
    tags: ['saint-denis', '93', 'vêtements', 'parfums', 'ouvert-dimanche'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.5,
    reviews: 287,
    note: 'Ouvert le dimanche',
  },
  {
    id: 'lib4',
    name: 'Librairie du Savoir — As-Salam',
    type: 'physique',
    description: 'Petite librairie spécialisée dans les livres pédagogiques pour enfants et adolescents musulmans. Histoires des prophètes, activités, coloriages, Corans pour enfants, méthodes d\'arabe jeunesse.',
    adresse: '7 avenue du Président Wilson',
    ville: 'Bobigny',
    department: '93',
    horaires: 'Mar–Sam 10h–18h',
    fermeture: 'Lun et Dim fermés',
    instagram: '#',
    maps: '#',
    specialites: ['enfants', 'arabe', 'coran-tafsir'],
    langues: ['Français', 'Arabe'],
    tags: ['enfants', 'pédagogie', 'bobigny', '93', 'spécialisé'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.8,
    reviews: 134,
    note: 'Spécialisé enfants & adolescents',
  },
  {
    id: 'lib5',
    name: 'Al-Hadith Librairie',
    type: 'mixte',
    description: 'Librairie tournée vers les sciences islamiques traditionnelles. Fort stock en hadith, usul al-fiqh, aqida. Nombreux titres en arabe importés d\'Égypte, du Maroc et d\'Arabie Saoudite. Commandes spéciales possibles.',
    adresse: '45 boulevard de Belleville',
    ville: 'Paris',
    department: '75',
    arrondissement: '11e',
    horaires: 'Lun–Sam 10h–19h',
    phone: '01 43 57 XX XX',
    website: '#',
    maps: '#',
    specialites: ['hadith', 'fiqh', 'coran-tafsir', 'arabe'],
    langues: ['Arabe', 'Français'],
    tags: ['sciences-islamiques', 'arabe', 'import', 'commande-spéciale'],
    featured: false,
    online: true,
    livraison: true,
    rating: 4.4,
    reviews: 198,
    note: 'Importation directe depuis les pays arabes, commandes spéciales bienvenues',
  },
  {
    id: 'lib6',
    name: 'Islam & Savoirs',
    type: 'physique',
    description: 'Librairie familiale à Évry-Courcouronnes. Sélection de livres en français, manuels d\'arabe pour adultes et enfants, Corans, vêtements modestes et accessoires de prière. Ambiance conviviale.',
    adresse: '15 place des Terrasses de l\'Agora',
    ville: 'Évry-Courcouronnes',
    department: '91',
    horaires: 'Mar–Dim 10h–19h',
    fermeture: 'Lundi fermé',
    phone: '01 60 XX XX XX',
    instagram: '#',
    maps: '#',
    specialites: ['livres-francais', 'arabe', 'vetements', 'accessoires', 'enfants'],
    langues: ['Français', 'Arabe'],
    tags: ['évry', '91', 'famille', 'accessible'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 'lib7',
    name: 'Sabil Al-Ilm',
    type: 'physique',
    description: 'Librairie islamique au cœur de Clichy-sous-Bois, une des rares du 93 Est. Vaste rayon arabe, linguistique et sciences islamiques. Tenue modeste disponible, livres jeunesse bien fournis.',
    adresse: '3 rue de Montfermeil',
    ville: 'Clichy-sous-Bois',
    department: '93',
    horaires: 'Lun–Sam 9h–19h',
    instagram: '#',
    maps: '#',
    specialites: ['arabe', 'coran-tafsir', 'enfants', 'vetements'],
    langues: ['Arabe', 'Français'],
    tags: ['clichy-sous-bois', '93', 'est-idf'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.2,
    reviews: 67,
  },
  {
    id: 'lib8',
    name: 'Nour Al-Ilm — En ligne',
    type: 'en-ligne',
    description: 'Boutique 100% en ligne spécialisée dans les livres islamiques en français. Forte expertise éditoriale, newsletters avec recommandations de lecture, coffrets cadeaux islamiques. Livraison express en France.',
    ville: 'En ligne',
    department: '75',
    website: '#',
    instagram: '#',
    specialites: ['livres-francais', 'spiritualite', 'histoire-islam', 'enfants', 'coran-tafsir'],
    langues: ['Français'],
    tags: ['en-ligne', 'livraison-express', 'coffrets-cadeaux', 'newsletter'],
    featured: true,
    online: true,
    livraison: true,
    rating: 4.9,
    reviews: 543,
    note: 'Coffrets cadeaux islamiques personnalisables',
  },
  {
    id: 'lib9',
    name: 'Dار Al-Andalus — Librairie & Galerie',
    type: 'physique',
    description: 'Librairie-galerie d\'art islamique à Vincennes. Livres d\'art, calligraphie, histoire de la civilisation islamique, cartes géographiques du monde arabo-musulman. Lieu culturel autant que commercial.',
    adresse: '18 rue de Fontenay',
    ville: 'Vincennes',
    department: '94',
    horaires: 'Mar–Sam 11h–19h',
    fermeture: 'Lun et Dim fermés',
    phone: '01 43 XX XX XX',
    website: '#',
    maps: '#',
    specialites: ['histoire-islam', 'spiritualite', 'livres-francais'],
    langues: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    tags: ['galerie', 'art-islamique', 'calligraphie', 'vincennes', '94'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.7,
    reviews: 156,
    note: 'Expositions temporaires de calligraphie islamique',
  },
  {
    id: 'lib10',
    name: 'Al-Falah Librairie',
    type: 'physique',
    description: 'Librairie bien fournie à Mantes-la-Jolie. Grand rayon arabe, fiqh et Coran. Nombreux livres pour apprendre l\'arabe à tous les niveaux. Accessoires de prière, tapis, vêtements.',
    adresse: '5 rue Porte aux Saints',
    ville: 'Mantes-la-Jolie',
    department: '78',
    horaires: 'Lun–Sam 9h30–19h',
    maps: '#',
    specialites: ['arabe', 'coran-tafsir', 'fiqh', 'vetements', 'accessoires'],
    langues: ['Arabe', 'Français'],
    tags: ['mantes-la-jolie', '78', 'fiqh'],
    featured: false,
    online: false,
    livraison: false,
    rating: 4.1,
    reviews: 45,
  },
];
