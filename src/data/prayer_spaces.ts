export interface PrayerSpace {
  id: string;
  hostName: string;
  hostAvatar?: string;
  isVerified: boolean;
  title: string;
  description: string;
  address: string; // Sera masquée partiellement pour les non-connectés
  city: string;
  zipCode: string;
  type: 'room' | 'garage' | 'garden' | 'office';
  capacity: number;
  gender: 'men' | 'women' | 'mixed_separate';
  facilities: {
    wudu: boolean;
    prayerMats: boolean;
    independentAccess: boolean;
  };
  availability: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  reviewsCount: number;
  rating: number;
}

export const prayerSpaces: PrayerSpace[] = [
  {
    id: '1',
    hostName: 'Ahmed Y.',
    isVerified: true,
    title: 'Espace calme dans mon bureau à Saint-Denis',
    description: 'Je mets à disposition mon bureau pendant les heures de travail. C\'est un espace propre et calme, idéal pour les frères travaillant à proximité.',
    address: 'Rue de la République',
    city: 'Saint-Denis',
    zipCode: '93200',
    type: 'office',
    capacity: 2,
    gender: 'men',
    facilities: {
      wudu: true,
      prayerMats: true,
      independentAccess: false,
    },
    availability: {
      fajr: false,
      dhuhr: true,
      asr: true,
      maghrib: false,
      isha: false,
    },
    reviewsCount: 12,
    rating: 4.9,
  },
  {
    id: '2',
    hostName: 'Sarah B.',
    isVerified: true,
    title: 'Salon spacieux pour sœurs uniquement',
    description: 'Grande pièce dédiée avec tapis et Corans à disposition. Uniquement pour les sœurs habitant le quartier.',
    address: 'Avenue de Versailles',
    city: 'Paris',
    zipCode: '75016',
    type: 'room',
    capacity: 4,
    gender: 'women',
    facilities: {
      wudu: true,
      prayerMats: true,
      independentAccess: true,
    },
    availability: {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    },
    reviewsCount: 8,
    rating: 5.0,
  }
];
