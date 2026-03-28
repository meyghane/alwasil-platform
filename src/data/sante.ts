export type SanteSector = 'psy' | 'hijama' | 'roqya' | 'medecin' | 'dietetique';
export type ConsultMode = 'presentiel' | 'visio' | 'both';

export type PraticienPsy = {
  id: string;
  name: string;
  title: string; // Psychologue, Psychothérapeute, Coach...
  specialites: string[];
  langues: string[];
  location: string;
  department: string;
  visio: boolean;
  tariف?: string;
  conventionné: boolean;
  secteur?: '1' | '2' | '3' | 'non-conventionné';
  description: string;
  approche: string[]; // TCC, EMDR, psychanalyse, etc.
  muslimFocus: boolean; // orienté communauté / comprend le contexte islamique
  arabophone: boolean;
  gender: 'f' | 'm' | 'mixte';
  contact?: string;
  website?: string;
  tags: string[];
  rating?: number;
  reviews?: number;
};

export type PraticienHijama = {
  id: string;
  name: string;
  location: string;
  department: string;
  visio: false;
  tarif?: string;
  gender: 'f' | 'm' | 'mixte';
  certifié: boolean;
  certifOrg?: string; // organisme de certification
  description: string;
  disponibilité: string; // ex: "Sam-Dim", "Sur RDV"
  contact?: string;
  instagram?: string;
  website?: string;
  tags: string[];
};

export type PraticienRoqya = {
  id: string;
  name: string;
  title: string; // Cheikh, Mouqri', Imam...
  location: string;
  department?: string;
  visio: boolean;
  tarif: string; // souvent gratuit/donation
  gender: 'f' | 'm';
  école?: string; // salafi, maliki, etc.
  langues: string[];
  description: string;
  disponibilité: string;
  contact?: string;
  tags: string[];
  warning?: string; // avertissement si besoin
};

// ─── PSYCHOLOGUES ───────────────────────────────────────────

export const psyProfiles: PraticienPsy[] = [
  {
    id: 'psy1',
    name: 'Dr Yasmine Benali',
    title: 'Psychologue clinicienne',
    specialites: ['Anxiété', 'Dépression', 'Deuil', 'Trauma'],
    langues: ['Français', 'Arabe', 'Anglais'],
    location: 'Paris 11e',
    department: '75',
    visio: true,
    tariف: '70€/séance (45min)',
    conventionné: false,
    secteur: 'non-conventionné',
    description: 'Psychologue clinicienne spécialisée dans l\'accompagnement de personnes issues de la communauté musulmane. Comprend les enjeux identitaires, les conflits de valeurs et les problématiques de double culture.',
    approche: ['TCC', 'ACT', 'Mindfulness'],
    muslimFocus: true,
    arabophone: true,
    gender: 'f',
    tags: ['TCC', 'anxiété', 'double-culture', 'identité', 'trauma'],
    rating: 4.9,
    reviews: 42,
  },
  {
    id: 'psy2',
    name: 'Rachid Hammouchi',
    title: 'Psychothérapeute & Coach',
    specialites: ['Gestion du stress', 'Confiance en soi', 'Couple', 'Addiction'],
    langues: ['Français', 'Arabe dialectal', 'Tamazight'],
    location: 'Aubervilliers (93)',
    department: '93',
    visio: true,
    tariف: '55€/séance',
    conventionné: false,
    secteur: 'non-conventionné',
    description: 'Psychothérapeute et coach de vie, accompagne depuis 8 ans des hommes et femmes musulmans sur les thèmes de la confiance en soi, des relations et de la spiritualité intégrée.',
    approche: ['Coaching intégratif', 'PNL', 'Thérapie narrative'],
    muslimFocus: true,
    arabophone: true,
    gender: 'm',
    tags: ['coaching', 'couple', 'stress', 'homme', 'confiance'],
    rating: 4.7,
    reviews: 28,
  },
  {
    id: 'psy3',
    name: 'Amira Tazi',
    title: 'Psychologue — spécialiste enfants & ados',
    specialites: ['Enfants', 'Adolescents', 'Troubles scolaires', 'TDA/H', 'Harcèlement'],
    langues: ['Français', 'Arabe'],
    location: 'Évry-Courcouronnes (91)',
    department: '91',
    visio: false,
    tariف: '60€/séance',
    conventionné: false,
    description: 'Spécialisée dans les enfants et adolescents issus de familles musulmanes. Comprend les enjeux éducatifs, religieux et sociaux. Accompagnement des parents aussi proposé.',
    approche: ['TCC', 'Thérapie par le jeu', 'Approche systémique'],
    muslimFocus: true,
    arabophone: true,
    gender: 'f',
    tags: ['enfants', 'ados', 'TDA-H', 'scolaire', '91'],
    rating: 4.8,
    reviews: 19,
  },
  {
    id: 'psy4',
    name: 'Dr Soufiane Mekki',
    title: 'Psychiatre',
    specialites: ['Dépression', 'Trouble bipolaire', 'Schizophrénie', 'Anxiété sévère'],
    langues: ['Français', 'Arabe', 'Anglais'],
    location: 'Bobigny (93)',
    department: '93',
    visio: false,
    tariف: '30€ (secteur 1)',
    conventionné: true,
    secteur: '1',
    description: 'Psychiatre conventionné secteur 1, sensibilisé aux problématiques culturelles et religieuses. Prescripteur avec une approche bienveillante et non-stigmatisante.',
    approche: ['Médicamenteux', 'Psychoéducation', 'Suivi thérapeutique'],
    muslimFocus: true,
    arabophone: true,
    gender: 'm',
    tags: ['psychiatre', 'remboursé', 'dépression', 'médication', '93'],
    rating: 4.6,
    reviews: 55,
  },
  {
    id: 'psy5',
    name: 'Nadia Ouhab',
    title: 'Psychologue — trauma & EMDR',
    specialites: ['Trauma', 'PTSD', 'Violence conjugale', 'Deuil', 'Exil'],
    langues: ['Français', 'Kabyle', 'Arabe'],
    location: 'Villeurbanne (69)',
    department: '69',
    visio: true,
    tariف: '65€/séance',
    conventionné: false,
    description: 'Accompagnement de femmes victimes de violence, de personnes en deuil ou ayant vécu des traumatismes. Forte expérience avec les familles maghrébines et les parcours migratoires.',
    approche: ['EMDR', 'Thérapie sensorimotrice', 'TCC'],
    muslimFocus: true,
    arabophone: true,
    gender: 'f',
    tags: ['EMDR', 'trauma', 'femmes', 'violence', 'deuil', 'lyon'],
    rating: 5.0,
    reviews: 14,
  },
  {
    id: 'psy6',
    name: 'Hakim Berrada',
    title: 'Conseiller conjugal & familial',
    specialites: ['Couple', 'Divorce islamique', 'Communication familiale', 'Parentalité'],
    langues: ['Français', 'Arabe', 'Anglais'],
    location: 'Marseille (13)',
    department: '13',
    visio: true,
    tariف: '50€/séance individuelle — 70€/séance couple',
    conventionné: false,
    description: 'Conseiller conjugal et familial formé en France et au Maroc. Spécialiste des conflits de couple intégrant les valeurs islamiques. Médiation avant divorce, communication non-violente, reconstruction.',
    approche: ['CNV', 'Médiation', 'Approche islamique intégrée'],
    muslimFocus: true,
    arabophone: true,
    gender: 'm',
    tags: ['couple', 'mariage', 'divorce', 'famille', 'marseille'],
    rating: 4.8,
    reviews: 31,
  },
];

// ─── HIJAMA ─────────────────────────────────────────────────

export const hijamaProfiles: PraticienHijama[] = [
  {
    id: 'h1',
    name: 'Centre Al-Shifa',
    location: 'Saint-Denis (93)',
    department: '93',
    visio: false,
    tarif: 'À partir de 40€',
    gender: 'mixte',
    certifié: true,
    certifOrg: 'BCHA (British Cupping and Hijama Association)',
    description: 'Centre spécialisé hijama avec praticiens hommes et femmes. Matériel stérile à usage unique, protocoles sunnah respectés. Séances individuelles ou en groupe.',
    disponibilité: 'Mar–Sam, sur RDV',
    instagram: '#',
    website: '#',
    tags: ['saint-denis', '93', 'centre', 'homme-femme', 'certifié'],
  },
  {
    id: 'h2',
    name: 'Oum Khalid — Hijama pour femmes',
    location: 'Aubervilliers (93)',
    department: '93',
    visio: false,
    tarif: '35–50€ selon formule',
    gender: 'f',
    certifié: true,
    certifOrg: 'Formation Hijama Institut Paris',
    description: 'Praticienne spécialisée dans la hijama pour femmes uniquement. Cadre intimiste et bienveillant. Expliquer les étapes avant la séance, conseils post-hijama inclus.',
    disponibilité: 'Week-end + jeudi soir',
    instagram: '#',
    tags: ['femmes-only', '93', 'aubervilliers', 'intimiste'],
  },
  {
    id: 'h3',
    name: 'Abou Zayd Cupping',
    location: 'Vitry-sur-Seine (94)',
    department: '94',
    visio: false,
    tarif: '45€ (sèche) / 55€ (avec saignée)',
    gender: 'm',
    certifié: true,
    certifOrg: 'HCA France',
    description: 'Praticien homme, certifié, formation internationale. Hijama sèche et hijama avec saignée (sunnah). Points sunnah + points thérapeutiques selon besoin. Conseils diététiques offerts.',
    disponibilité: 'Lun–Sam, 9h–19h',
    instagram: '#',
    tags: ['homme', '94', 'vitry', 'saignée', 'sunnah'],
  },
  {
    id: 'h4',
    name: 'Hijama Bien-Être Lyon',
    location: 'Vénissieux (69)',
    department: '69',
    visio: false,
    tarif: '40€',
    gender: 'mixte',
    certifié: true,
    certifOrg: 'Institut de Médecine Prophétique',
    description: 'Centre de hijama à Lyon, accueil hommes et femmes (créneaux séparés). Approche médecine prophétique, huiles essentielles sunnah (habba sawda). Tarif réduit pour étudiants.',
    disponibilité: 'Sam–Dim + mardi soir',
    tags: ['lyon', 'vénissieux', 'médecine-prophétique', 'habba-sawda'],
  },
  {
    id: 'h5',
    name: 'Nour Al-Shifa — Hijama domicile',
    location: 'Île-de-France (déplacement)',
    department: '75',
    visio: false,
    tarif: '60€ (déplacement inclus)',
    gender: 'f',
    certifié: true,
    certifOrg: 'Formation BCHA UK',
    description: 'Praticienne certifiée se déplaçant à domicile en Île-de-France. Idéal pour femmes qui préfèrent être chez elles. Matériel stérile apporté, séance en toute confidentialité.',
    disponibilité: 'Sur RDV — délai 1 semaine',
    instagram: '#',
    tags: ['domicile', 'île-de-france', 'femmes', 'déplacement'],
  },
];

// ─── ROQYA ──────────────────────────────────────────────────

export const roqyaProfiles: PraticienRoqya[] = [
  {
    id: 'r1',
    name: 'Cheikh Abdallah As-Suyuti',
    title: 'Mouqri\' certifié',
    location: 'Montreuil (93)',
    department: '93',
    visio: true,
    tarif: 'Don libre (sadaqa)',
    gender: 'm',
    école: 'Sunnah (méthodologie des savants)',
    langues: ['Arabe', 'Français'],
    description: 'Pratique la roqya char\'iyya selon la sunnah du Prophète ﷺ. Lecture du Coran uniquement, pas de talismans ni de méthodes innovées. Formation auprès de savants reconnus. Accompagnement spirituel inclus.',
    disponibilité: 'Mer–Sam sur RDV',
    tags: ['roqya-char\'iyya', 'sunnah', 'visio-ok', 'coran', '93'],
    warning: undefined,
  },
  {
    id: 'r2',
    name: 'Oum Ibrahim — Roqya pour femmes',
    title: 'Praticienne Roqya',
    location: 'Paris 18e',
    department: '75',
    visio: true,
    tarif: 'Gratuit / donation libre',
    gender: 'f',
    école: 'Méthodologie Ahl As-Sunnah',
    langues: ['Français', 'Arabe', 'Wolof'],
    description: 'Femme proposant la roqya char\'iyya exclusivement pour sœurs. Lecture du Coran, doua\' et conseils spirituels. Accompagnement bienveillant pour les sœurs souffrant de sorcellerie, mauvais œil ou possession.',
    disponibilité: 'Vendredi–Dimanche',
    tags: ['femmes', 'roqya', 'visio-ok', 'wolof', 'paris'],
  },
  {
    id: 'r3',
    name: 'Imam Yassine Idrissi',
    title: 'Imam & praticien roqya',
    location: 'Stains (93)',
    department: '93',
    visio: false,
    tarif: 'Don libre',
    gender: 'm',
    école: 'Maliki',
    langues: ['Arabe', 'Français', 'Tamazight'],
    description: 'Imam de mosquée pratiquant la roqya sur rendez-vous après la prière du Asr. Approche douce, écoute, lecture et conseils. Pas de séances en dehors de la mosquée.',
    disponibilité: 'Dim–Jeu après Asr (environ 17h)',
    tags: ['imam', 'mosquée', 'maliki', '93', 'stains'],
  },
  {
    id: 'r4',
    name: 'Cheikh Abu Mus\'ab',
    title: 'Spécialiste roqya — sihr & ayn',
    location: 'Lyon (69)',
    department: '69',
    visio: true,
    tarif: 'Don libre',
    gender: 'm',
    école: 'Sunnah',
    langues: ['Arabe', 'Français'],
    description: 'Praticien expérimenté spécialisé dans les cas de sorcellerie (sihr) et mauvais œil (ayn). Protocole complet : diagnostic, lecture, conseils. Suivi sur plusieurs séances si nécessaire. Visio acceptée pour premiers échanges.',
    disponibilité: 'Sur RDV uniquement',
    tags: ['sihr', 'ayn', 'sorcellerie', 'lyon', 'visio'],
  },
];
