// ============================================================
// DONNÉES — Espaces de prière (particuliers & commerçants)
// Feature "Musalliyin" — Phase 1 : données fictives
// ============================================================

export type TypeLieu = 'particulier' | 'commercant' | 'restaurant' | 'bureau';
export type Priere = 'fajr' | 'dhohr' | 'asr' | 'maghrib' | 'icha';

export type DispoPreiere = {
  placesH: number;
  placesF: number;
  reservesH: number;
  reservesF: number;
};

export type EspacePriere = {
  id: string;
  prenom: string;       // prénom de l'hôte (pas de nom complet)
  type: TypeLieu;
  quartier: string;
  ville: string;
  department: string;
  coords: { lat: number; lng: number };
  description: string;
  ablutions: boolean;
  entreeF?: boolean;     // entrée séparée pour les femmes
  pexelsId: number;      // ID photo Pexels
  prieres: Record<Priere, DispoPreiere | null>; // null = non disponible pour cette prière
  rating: number;
  avis: number;
  gratuit: true;         // toujours gratuit (FissabiliLlah)
};

// Temps de prière approximatifs Paris (avril 2026)
export const HORAIRES_PARIS: Record<Priere, string> = {
  fajr: '05h22',
  dhohr: '13h52',
  asr: '17h18',
  maghrib: '20h41',
  icha: '22h05',
};

export const PRIERE_LABELS: Record<Priere, string> = {
  fajr: 'Fajr',
  dhohr: 'Dhohr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  icha: 'Icha',
};

export const TYPE_LABELS: Record<TypeLieu, string> = {
  particulier: 'Particulier',
  commercant: 'Commerçant',
  restaurant: 'Restaurant',
  bureau: 'Bureau / Espace',
};

export const TYPE_COLORS: Record<TypeLieu, string> = {
  particulier: '#c9973a',
  commercant: '#6366f1',
  restaurant: '#f59e0b',
  bureau: '#3b82f6',
};

// ============================================================
// ESPACES (données fictives)
// ============================================================
export const espacesPriere: EspacePriere[] = [
  {
    id: 'ep-001',
    prenom: 'Yassine',
    type: 'particulier',
    quartier: 'Belleville',
    ville: 'Paris 20e',
    department: '75',
    coords: { lat: 48.8697, lng: 2.3872 },
    description: 'Salon spacieux, tapis de prière propres fournis. Entrée discrète par le couloir. Ambiance familiale. Ablutions dans la salle de bain.',
    ablutions: true,
    entreeF: false,
    pexelsId: 1571460,
    prieres: {
      fajr: null,
      dhohr: { placesH: 4, placesF: 3, reservesH: 2, reservesF: 1 },
      asr: { placesH: 4, placesF: 3, reservesH: 1, reservesF: 0 },
      maghrib: { placesH: 4, placesF: 3, reservesH: 3, reservesF: 2 },
      icha: { placesH: 4, placesF: 3, reservesH: 4, reservesF: 0 },
    },
    rating: 4.9,
    avis: 23,
    gratuit: true,
  },
  {
    id: 'ep-002',
    prenom: 'Fatima',
    type: 'particulier',
    quartier: 'La Chapelle',
    ville: 'Paris 18e',
    department: '75',
    coords: { lat: 48.8858, lng: 2.3581 },
    description: 'Pièce dédiée à la prière, séparée du reste de l\'appartement. Spécialement bienvenue aux sœurs. Tapis et voile de prière disponibles.',
    ablutions: true,
    entreeF: true,
    pexelsId: 2079249,
    prieres: {
      fajr: null,
      dhohr: { placesH: 2, placesF: 5, reservesH: 0, reservesF: 2 },
      asr: { placesH: 2, placesF: 5, reservesH: 1, reservesF: 4 },
      maghrib: { placesH: 2, placesF: 5, reservesH: 2, reservesF: 3 },
      icha: null,
    },
    rating: 5.0,
    avis: 41,
    gratuit: true,
  },
  {
    id: 'ep-003',
    prenom: 'Mohamed',
    type: 'commercant',
    quartier: 'Porte de Vincennes',
    ville: 'Paris 12e',
    department: '75',
    coords: { lat: 48.8489, lng: 2.4007 },
    description: 'Arrière-boutique disponible pour la prière. Bonne isolation acoustique. Robinet disponible pour le wudu. À 2 min de la station Porte de Vincennes.',
    ablutions: true,
    entreeF: false,
    pexelsId: 380330,
    prieres: {
      fajr: null,
      dhohr: { placesH: 6, placesF: 4, reservesH: 3, reservesF: 1 },
      asr: { placesH: 6, placesF: 4, reservesH: 2, reservesF: 2 },
      maghrib: { placesH: 6, placesF: 4, reservesH: 5, reservesF: 4 },
      icha: { placesH: 6, placesF: 4, reservesH: 2, reservesF: 1 },
    },
    rating: 4.7,
    avis: 17,
    gratuit: true,
  },
  {
    id: 'ep-004',
    prenom: 'Karima',
    type: 'particulier',
    quartier: 'Gennevilliers',
    ville: 'Gennevilliers',
    department: '92',
    coords: { lat: 48.9303, lng: 2.2962 },
    description: 'Grande pièce lumineuse au rez-de-chaussée. Espace femmes séparé avec porte. Tapis propres, qibla indiqué. Venez avec vos proches.',
    ablutions: true,
    entreeF: true,
    pexelsId: 1396122,
    prieres: {
      fajr: { placesH: 3, placesF: 5, reservesH: 1, reservesF: 2 },
      dhohr: { placesH: 3, placesF: 5, reservesH: 0, reservesF: 1 },
      asr: { placesH: 3, placesF: 5, reservesH: 2, reservesF: 3 },
      maghrib: { placesH: 3, placesF: 5, reservesH: 3, reservesF: 5 },
      icha: { placesH: 3, placesF: 5, reservesH: 1, reservesF: 2 },
    },
    rating: 4.8,
    avis: 56,
    gratuit: true,
  },
  {
    id: 'ep-005',
    prenom: 'Bilal',
    type: 'restaurant',
    quartier: 'Saint-Denis',
    ville: 'Saint-Denis',
    department: '93',
    coords: { lat: 48.9362, lng: 2.3574 },
    description: 'Restaurant halal avec espace prière à l\'étage (fermé en dehors des heures de repas). Wudu possible aux toilettes. Parking à proximité.',
    ablutions: false,
    entreeF: false,
    pexelsId: 3225517,
    prieres: {
      fajr: null,
      dhohr: { placesH: 8, placesF: 6, reservesH: 4, reservesF: 2 },
      asr: { placesH: 8, placesF: 6, reservesH: 3, reservesF: 3 },
      maghrib: { placesH: 8, placesF: 6, reservesH: 7, reservesF: 5 },
      icha: null,
    },
    rating: 4.5,
    avis: 34,
    gratuit: true,
  },
  {
    id: 'ep-006',
    prenom: 'Inès',
    type: 'particulier',
    quartier: 'Sarcelles',
    ville: 'Sarcelles',
    department: '95',
    coords: { lat: 48.9993, lng: 2.3795 },
    description: 'Appartement au calme, salon dédié à la prière avec tapis. Espace sœurs bienveillant. Ablutions disponibles. Immeuble avec ascenseur.',
    ablutions: true,
    entreeF: true,
    pexelsId: 271624,
    prieres: {
      fajr: { placesH: 2, placesF: 4, reservesH: 0, reservesF: 1 },
      dhohr: { placesH: 2, placesF: 4, reservesH: 1, reservesF: 2 },
      asr: { placesH: 2, placesF: 4, reservesH: 0, reservesF: 0 },
      maghrib: { placesH: 2, placesF: 4, reservesH: 2, reservesF: 4 },
      icha: { placesH: 2, placesF: 4, reservesH: 1, reservesF: 2 },
    },
    rating: 4.9,
    avis: 29,
    gratuit: true,
  },
  {
    id: 'ep-007',
    prenom: 'Rachid',
    type: 'bureau',
    quartier: 'La Défense',
    ville: 'Puteaux',
    department: '92',
    coords: { lat: 48.8934, lng: 2.2394 },
    description: 'Salle de réunion disponible pendant les heures de prière. Open space calme. Wudu possible. Idéal pour les travailleurs de La Défense.',
    ablutions: true,
    entreeF: false,
    pexelsId: 1181396,
    prieres: {
      fajr: null,
      dhohr: { placesH: 10, placesF: 8, reservesH: 6, reservesF: 3 },
      asr: { placesH: 10, placesF: 8, reservesH: 4, reservesF: 2 },
      maghrib: null,
      icha: null,
    },
    rating: 4.6,
    avis: 88,
    gratuit: true,
  },
  {
    id: 'ep-008',
    prenom: 'Nadia',
    type: 'particulier',
    quartier: 'Choisy-le-Roi',
    ville: 'Choisy-le-Roi',
    department: '94',
    coords: { lat: 48.7635, lng: 2.4090 },
    description: 'Maison avec jardin, grande pièce pour la prière. Espace hommes et femmes séparés. Ablutions disponibles avec robinet extérieur en été.',
    ablutions: true,
    entreeF: true,
    pexelsId: 1268558,
    prieres: {
      fajr: { placesH: 5, placesF: 5, reservesH: 2, reservesF: 1 },
      dhohr: { placesH: 5, placesF: 5, reservesH: 1, reservesF: 0 },
      asr: { placesH: 5, placesF: 5, reservesH: 3, reservesF: 2 },
      maghrib: { placesH: 5, placesF: 5, reservesH: 4, reservesF: 4 },
      icha: { placesH: 5, placesF: 5, reservesH: 2, reservesF: 3 },
    },
    rating: 5.0,
    avis: 19,
    gratuit: true,
  },
  {
    id: 'ep-009',
    prenom: 'Hamza',
    type: 'commercant',
    quartier: 'Château-Rouge',
    ville: 'Paris 18e',
    department: '75',
    coords: { lat: 48.8878, lng: 2.3497 },
    description: 'Épicerie halal avec local à l\'arrière pour la prière. Tapis fournis. Juste sous la mosquée du quartier pour les ablutions si besoin.',
    ablutions: false,
    entreeF: false,
    pexelsId: 1612351,
    prieres: {
      fajr: null,
      dhohr: { placesH: 5, placesF: 2, reservesH: 2, reservesF: 1 },
      asr: { placesH: 5, placesF: 2, reservesH: 1, reservesF: 0 },
      maghrib: { placesH: 5, placesF: 2, reservesH: 4, reservesF: 2 },
      icha: { placesH: 5, placesF: 2, reservesH: 3, reservesF: 1 },
    },
    rating: 4.4,
    avis: 12,
    gratuit: true,
  },
];
