// Définition des formulaires par catégorie
// Chaque champ correspond exactement à une colonne du Google Sheet

export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean' | 'number' | 'url' | 'tel' | 'email' | 'date';

export type FormField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
};

export type CategoryForm = {
  label: string;
  emoji: string;
  sheetTab: string;
  color: string;
  fields: FormField[];
};

const DEPT_OPTIONS = [
  '01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
  '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30',
  '31','32','33','34','35','36','37','38','39','40','41','42','43','44','45',
  '46','47','48','49','50','51','52','53','54','55','56','57','58','59','60',
  '61','62','63','64','65','66','67','68','69','70','71','72','73','74','75',
  '76','77','78','79','80','81','82','83','84','85','86','87','88','89','90',
  '91','92','93','94','95','971','972','973','974','976',
].map(d => ({ value: d, label: d }));

export const CATEGORY_FORMS: Record<string, CategoryForm> = {

  piscine: {
    label: 'Piscine burkini',
    emoji: '🏊',
    sheetTab: 'Piscines',
    color: '#c9973a',
    fields: [
      { key: 'name',         label: 'Nom de la piscine',   type: 'text',     required: true },
      { key: 'type',         label: 'Type',                type: 'select',   required: true, options: [{ value: 'municipale', label: 'Municipale' }, { value: 'privee', label: 'Privée' }, { value: 'associative', label: 'Associative' }] },
      { key: 'adresse',      label: 'Adresse',             type: 'text',     required: true },
      { key: 'ville',        label: 'Ville',               type: 'text',     required: true },
      { key: 'department',   label: 'Département',         type: 'select',   required: true, options: DEPT_OPTIONS },
      { key: 'creneaux',     label: 'Créneaux', type: 'textarea', required: true, placeholder: 'Samedi 8h-10h (Femmes uniquement) | Dimanche 9h-11h', hint: 'Séparer les créneaux par |' },
      { key: 'tarif',        label: 'Tarif',               type: 'text',     placeholder: 'ex: 4€ l\'entrée' },
      { key: 'phone',        label: 'Téléphone',           type: 'tel' },
      { key: 'website',      label: 'Site web',            type: 'url' },
      { key: 'maps',         label: 'Lien Google Maps',    type: 'url' },
      { key: 'description',  label: 'Description',         type: 'textarea', required: true },
      { key: 'confirmed',    label: 'Créneaux confirmés ?',type: 'boolean' },
      { key: 'lastVerified', label: 'Date de vérification',type: 'date' },
      { key: 'note',         label: 'Note importante',     type: 'textarea', hint: 'Info à afficher en alerte sur la fiche' },
      { key: 'tags',         label: 'Tags',                type: 'text',     placeholder: 'burkini,femmes,idf', hint: 'Séparés par virgule' },
    ],
  },

  institut: {
    label: 'Institut / Mosquée',
    emoji: '📚',
    sheetTab: 'Education',
    color: '#c9973a',
    fields: [
      { key: 'name',        label: 'Nom',          type: 'text',        required: true },
      { key: 'type',        label: 'Type',         type: 'select',      required: true, options: [{ value: 'institut', label: 'Institut' }, { value: 'mosquee', label: 'Mosquée' }, { value: 'professeur', label: 'Professeur' }, { value: 'en-ligne', label: 'Formation en ligne' }, { value: 'cercle', label: 'Cercle de science' }] },
      { key: 'address',     label: 'Adresse',      type: 'text' },
      { key: 'city',        label: 'Ville',        type: 'text',        required: true },
      { key: 'department',  label: 'Département',  type: 'select',      required: true, options: DEPT_OPTIONS },
      { key: 'courses',     label: 'Cours proposés', type: 'multiselect', options: [{ value: 'coran', label: 'Coran' }, { value: 'tajwid', label: 'Tajwid' }, { value: 'arabe', label: 'Langue arabe' }, { value: 'sciences-islamiques', label: 'Sciences islamiques' }, { value: 'fiqh', label: 'Fiqh' }, { value: 'aqida', label: 'Aqida' }, { value: 'sirah', label: 'Sirah' }, { value: 'tafsir', label: 'Tafsir' }, { value: 'hadith', label: 'Hadith' }, { value: 'enfants', label: 'Enfants' }, { value: 'memorisation', label: 'Mémorisation (Hifz)' }] },
      { key: 'audience',    label: 'Public',       type: 'multiselect', options: [{ value: 'hommes', label: 'Hommes' }, { value: 'femmes', label: 'Femmes' }, { value: 'enfants', label: 'Enfants' }, { value: 'mixte', label: 'Mixte' }] },
      { key: 'format',      label: 'Format',       type: 'multiselect', options: [{ value: 'presentiel', label: 'Présentiel' }, { value: 'distanciel', label: 'En ligne' }, { value: 'hybride', label: 'Hybride' }] },
      { key: 'website',     label: 'Site web',     type: 'url' },
      { key: 'phone',       label: 'Téléphone',    type: 'tel' },
      { key: 'email',       label: 'Email',        type: 'email' },
      { key: 'description', label: 'Description',  type: 'textarea',    required: true },
      { key: 'tags',        label: 'Tags',         type: 'text',        placeholder: 'coran,paris,femmes', hint: 'Séparés par virgule' },
      { key: 'verified',    label: 'Vérifié par Al-Wasil ?', type: 'boolean' },
    ],
  },

  evenement: {
    label: 'Événement',
    emoji: '📅',
    sheetTab: 'Events',
    color: '#f59e0b',
    fields: [
      { key: 'title',           label: 'Titre',              type: 'text',      required: true },
      { key: 'category',        label: 'Catégorie',          type: 'select',    required: true, options: [{ value: 'conference', label: 'Conférence' }, { value: 'maraude', label: 'Maraude' }, { value: 'cours', label: 'Cours' }, { value: 'iftar', label: 'Iftar solidaire' }, { value: 'webinaire', label: 'Webinaire' }, { value: 'jeunesse', label: 'Jeunesse' }, { value: 'famille', label: 'Famille' }, { value: 'collecte', label: 'Collecte' }, { value: 'autre', label: 'Autre' }] },
      { key: 'date',            label: 'Date',               type: 'date',      required: true },
      { key: 'timeStart',       label: 'Heure de début',     type: 'text',      placeholder: '14h00', required: true },
      { key: 'timeEnd',         label: 'Heure de fin',       type: 'text',      placeholder: '18h00' },
      { key: 'location',        label: 'Nom du lieu',        type: 'text',      required: true },
      { key: 'address',         label: 'Adresse',            type: 'text' },
      { key: 'city',            label: 'Ville',              type: 'text',      required: true },
      { key: 'department',      label: 'Département',        type: 'select',    required: true, options: DEPT_OPTIONS },
      { key: 'organizer',       label: 'Organisateur',       type: 'text',      required: true },
      { key: 'organizerUrl',    label: 'Site organisateur',  type: 'url' },
      { key: 'format',          label: 'Format',             type: 'select',    options: [{ value: 'presentiel', label: 'Présentiel' }, { value: 'enligne', label: 'En ligne' }, { value: 'hybride', label: 'Hybride' }] },
      { key: 'registrationUrl', label: 'Lien d\'inscription',type: 'url' },
      { key: 'isFree',          label: 'Gratuit ?',          type: 'boolean' },
      { key: 'price',           label: 'Prix',               type: 'text',      placeholder: '5€', hint: 'Si payant' },
      { key: 'description',     label: 'Description',        type: 'textarea',  required: true },
      { key: 'tags',            label: 'Tags',               type: 'text',      placeholder: 'conference,paris,islam' },
    ],
  },

  emploi: {
    label: 'Offre d\'emploi',
    emoji: '💼',
    sheetTab: 'Emploi',
    color: '#1540ff',
    fields: [
      { key: 'title',       label: 'Intitulé du poste',  type: 'text',        required: true },
      { key: 'company',     label: 'Entreprise',         type: 'text',        required: true },
      { key: 'location',    label: 'Ville',              type: 'text',        required: true },
      { key: 'department',  label: 'Département',        type: 'select',      options: DEPT_OPTIONS },
      { key: 'remote',      label: 'Télétravail',        type: 'select',      options: [{ value: 'full', label: 'Full remote' }, { value: 'hybrid', label: 'Hybride' }, { value: 'on-site', label: 'Sur site' }] },
      { key: 'type',        label: 'Type de contrat',    type: 'select',      required: true, options: [{ value: 'cdi', label: 'CDI' }, { value: 'cdd', label: 'CDD' }, { value: 'freelance', label: 'Freelance' }, { value: 'stage', label: 'Stage' }, { value: 'alternance', label: 'Alternance' }, { value: 'benevole', label: 'Bénévolat' }] },
      { key: 'sector',      label: 'Secteur',            type: 'select',      options: [{ value: 'tech', label: 'Tech' }, { value: 'sante', label: 'Santé' }, { value: 'education', label: 'Éducation' }, { value: 'commerce', label: 'Commerce' }, { value: 'juridique', label: 'Juridique' }, { value: 'humanitaire', label: 'Humanitaire' }, { value: 'finance', label: 'Finance' }, { value: 'communication', label: 'Communication' }, { value: 'autre', label: 'Autre' }] },
      { key: 'friendly',    label: 'Conditions',         type: 'multiselect', options: [{ value: 'voile-ok', label: 'Voile accepté' }, { value: 'priere-ok', label: 'Prière OK' }, { value: 'full-friendly', label: 'Full friendly' }] },
      { key: 'salary',      label: 'Salaire',            type: 'text',        placeholder: '35-40k€' },
      { key: 'url',         label: 'Lien vers l\'offre', type: 'url',         required: true },
      { key: 'description', label: 'Description',        type: 'textarea',    required: true },
      { key: 'tags',        label: 'Tags',               type: 'text',        placeholder: 'tech,cdi,paris' },
    ],
  },

  psy: {
    label: 'Praticien — Psy',
    emoji: '🧠',
    sheetTab: 'Sante_psy',
    color: '#c9973a',
    fields: [
      { key: 'name',         label: 'Nom complet',         type: 'text',        required: true },
      { key: 'title',        label: 'Titre',               type: 'text',        required: true, placeholder: 'Psychologue, Psychothérapeute...' },
      { key: 'specialites',  label: 'Spécialités',         type: 'text',        placeholder: 'Anxiété, Trauma, Couple', hint: 'Séparées par virgule' },
      { key: 'langues',      label: 'Langues',             type: 'text',        placeholder: 'Français, Arabe', hint: 'Séparées par virgule' },
      { key: 'location',     label: 'Ville / Quartier',    type: 'text',        required: true },
      { key: 'department',   label: 'Département',         type: 'select',      required: true, options: DEPT_OPTIONS },
      { key: 'visio',        label: 'Consultation en visio ?', type: 'boolean' },
      { key: 'tarif',        label: 'Tarif',               type: 'text',        placeholder: '60€ / séance' },
      { key: 'conventionne', label: 'Conventionné SS ?',   type: 'boolean' },
      { key: 'secteur',      label: 'Secteur',             type: 'select',      options: [{ value: '1', label: 'Secteur 1' }, { value: '2', label: 'Secteur 2' }, { value: '3', label: 'Secteur 3' }, { value: 'non-conventionne', label: 'Non conventionné' }] },
      { key: 'approche',     label: 'Approche thérapeutique', type: 'text',     placeholder: 'TCC, EMDR, Psychanalyse' },
      { key: 'muslimFocus',  label: 'Orienté communauté musulmane ?', type: 'boolean' },
      { key: 'arabophone',   label: 'Arabophone ?',        type: 'boolean' },
      { key: 'gender',       label: 'Genre',               type: 'select',      options: [{ value: 'f', label: 'Femme' }, { value: 'm', label: 'Homme' }, { value: 'mixte', label: 'Mixte' }] },
      { key: 'contact',      label: 'Contact (tel ou email)', type: 'text' },
      { key: 'website',      label: 'Site web',            type: 'url' },
      { key: 'description',  label: 'Description',         type: 'textarea',    required: true },
      { key: 'tags',         label: 'Tags',                type: 'text',        placeholder: 'psy,anxiete,paris' },
    ],
  },

  hijama: {
    label: 'Praticien — Hijama',
    emoji: '💆',
    sheetTab: 'sante_hijama',
    color: '#ef4444',
    fields: [
      { key: 'name',          label: 'Nom complet',         type: 'text',     required: true },
      { key: 'location',      label: 'Ville',               type: 'text',     required: true },
      { key: 'department',    label: 'Département',         type: 'select',   required: true, options: DEPT_OPTIONS },
      { key: 'tarif',         label: 'Tarif',               type: 'text',     placeholder: '60€' },
      { key: 'gender',        label: 'Genre',               type: 'select',   options: [{ value: 'f', label: 'Femme' }, { value: 'm', label: 'Homme' }, { value: 'mixte', label: 'Mixte' }] },
      { key: 'certifie',      label: 'Certifié ?',          type: 'boolean' },
      { key: 'certifOrg',     label: 'Organisme de certification', type: 'text' },
      { key: 'disponibilite', label: 'Disponibilités',      type: 'text',     placeholder: 'Sam-Dim, Sur RDV', required: true },
      { key: 'contact',       label: 'Téléphone / email',   type: 'text' },
      { key: 'instagram',     label: 'Instagram (@compte)', type: 'text' },
      { key: 'website',       label: 'Site web',            type: 'url' },
      { key: 'description',   label: 'Description',         type: 'textarea', required: true },
      { key: 'tags',          label: 'Tags',                type: 'text',     placeholder: 'hijama,paris,femmes' },
    ],
  },

  roqya: {
    label: 'Praticien — Roqya',
    emoji: '📿',
    sheetTab: 'Sante_roqya',
    color: '#c9973a',
    fields: [
      { key: 'name',         label: 'Nom / Pseudo',        type: 'text',     required: true },
      { key: 'title',        label: 'Titre',               type: 'text',     placeholder: 'Cheikh, Mouqri\', Imam' },
      { key: 'location',     label: 'Ville',               type: 'text',     required: true },
      { key: 'department',   label: 'Département',         type: 'select',   required: true, options: DEPT_OPTIONS },
      { key: 'visio',        label: 'Roqya à distance ?',  type: 'boolean' },
      { key: 'tarif',        label: 'Tarif',               type: 'text',     placeholder: 'Gratuit, Don libre...' },
      { key: 'gender',       label: 'Genre',               type: 'select',   options: [{ value: 'f', label: 'Femme' }, { value: 'm', label: 'Homme' }] },
      { key: 'contact',      label: 'Contact',             type: 'text' },
      { key: 'description',  label: 'Description',         type: 'textarea', required: true },
      { key: 'tags',         label: 'Tags',                type: 'text',     placeholder: 'roqya,paris,femmes' },
    ],
  },

  librairie: {
    label: 'Librairie',
    emoji: '📖',
    sheetTab: 'Librairies',
    color: '#d97706',
    fields: [
      { key: 'name',        label: 'Nom',                 type: 'text',        required: true },
      { key: 'type',        label: 'Type',                type: 'select',      required: true, options: [{ value: 'physique', label: 'Physique' }, { value: 'en-ligne', label: 'En ligne' }, { value: 'mixte', label: 'Physique + En ligne' }] },
      { key: 'adresse',     label: 'Adresse',             type: 'text' },
      { key: 'ville',       label: 'Ville',               type: 'text',        required: true },
      { key: 'department',  label: 'Département',         type: 'select',      required: true, options: DEPT_OPTIONS },
      { key: 'horaires',    label: 'Horaires',            type: 'text',        placeholder: 'Lun-Sam 10h-19h' },
      { key: 'fermeture',   label: 'Fermeture',           type: 'text',        placeholder: 'Fermé dimanche' },
      { key: 'phone',       label: 'Téléphone',           type: 'tel' },
      { key: 'website',     label: 'Site web',            type: 'url' },
      { key: 'instagram',   label: 'Instagram (@compte)', type: 'text' },
      { key: 'maps',        label: 'Lien Google Maps',    type: 'url' },
      { key: 'specialites', label: 'Spécialités',         type: 'multiselect', options: [{ value: 'coran-tafsir', label: 'Coran / Tafsir' }, { value: 'hadith', label: 'Hadith' }, { value: 'fiqh', label: 'Fiqh' }, { value: 'arabe', label: 'Langue arabe' }, { value: 'enfants', label: 'Enfants' }, { value: 'histoire-islam', label: 'Histoire islam' }, { value: 'spiritualite', label: 'Spiritualité' }, { value: 'livres-francais', label: 'Livres français' }, { value: 'vetements', label: 'Vêtements' }, { value: 'accessoires', label: 'Accessoires' }, { value: 'parfums-huiles', label: 'Parfums / Huiles' }] },
      { key: 'langues',     label: 'Langues vendues',     type: 'text',        placeholder: 'FR, AR, EN', hint: 'Séparées par virgule' },
      { key: 'online',      label: 'Vente en ligne ?',    type: 'boolean' },
      { key: 'livraison',   label: 'Livraison ?',         type: 'boolean' },
      { key: 'note',        label: 'Note',                type: 'text',        placeholder: 'Espace femmes séparé...' },
      { key: 'description', label: 'Description',         type: 'textarea',    required: true },
      { key: 'tags',        label: 'Tags',                type: 'text',        placeholder: 'librairie,paris,arabe' },
    ],
  },

  cagnotte: {
    label: 'Cagnotte solidarité',
    emoji: '🤲',
    sheetTab: 'Solidarite_cagnotte',
    color: '#ef4444',
    fields: [
      { key: 'title',       label: 'Titre de la cagnotte', type: 'text',     required: true },
      { key: 'organizer',   label: 'Organisateur',         type: 'text',     required: true },
      { key: 'platform',    label: 'Plateforme',           type: 'select',   required: true, options: [{ value: 'launchgood', label: 'LaunchGood' }, { value: 'helloasso', label: 'HelloAsso' }, { value: 'leetchi', label: 'Leetchi' }, { value: 'direct', label: 'Paiement direct' }] },
      { key: 'url',         label: 'Lien de la cagnotte',  type: 'url',      required: true },
      { key: 'category',    label: 'Catégorie',            type: 'select',   options: [{ value: 'gaza', label: 'Gaza' }, { value: 'orphelins', label: 'Orphelins' }, { value: 'maraude', label: 'Maraude' }, { value: 'sante', label: 'Santé' }, { value: 'education', label: 'Éducation' }, { value: 'famille', label: 'Famille en difficulté' }, { value: 'autre', label: 'Autre' }] },
      { key: 'goal',        label: 'Objectif (€)',         type: 'number' },
      { key: 'raised',      label: 'Montant collecté (€)', type: 'number' },
      { key: 'currency',    label: 'Devise',               type: 'select',   options: [{ value: 'EUR', label: 'EUR (€)' }, { value: 'USD', label: 'USD ($)' }] },
      { key: 'country',     label: 'Pays bénéficiaire',    type: 'text' },
      { key: 'description', label: 'Description',          type: 'textarea', required: true },
    ],
  },

  agence_hajj: {
    label: 'Agence Hajj / Omra',
    emoji: '✈️',
    sheetTab: 'HajjOmra_agences',
    color: '#c9973a',
    fields: [
      { key: 'name',        label: 'Nom de l\'agence',  type: 'text',     required: true },
      { key: 'location',    label: 'Ville',             type: 'text',     required: true },
      { key: 'since',       label: 'Année de création', type: 'number' },
      { key: 'agree',       label: 'Agréée ?',          type: 'boolean' },
      { key: 'phone',       label: 'Téléphone',         type: 'tel' },
      { key: 'website',     label: 'Site web',          type: 'url' },
      { key: 'description', label: 'Description',       type: 'textarea', required: true },
      { key: 'tags',        label: 'Tags',              type: 'text',     placeholder: 'hajj,omra,paris' },
    ],
  },
};

export const CATEGORIES_LIST = Object.entries(CATEGORY_FORMS).map(([key, form]) => ({
  key,
  ...form,
}));
