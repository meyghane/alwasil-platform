import {
  getCagnottes,
  getInitiatives,
  getVisiteMalades,
  getVoyagesHumanitaires,
  getAssociations,
} from '@/lib/db-queries';
import SolidarityClient from './SolidarityClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solidarité musulmane : initiatives, associations et collectes | Al-Wasil',
  description: 'Trouvez des initiatives solidaires, associations et collectes liées à la communauté musulmane, avec leurs sources et modalités officielles.',
  alternates: { canonical: 'https://al-wasil.fr/solidarity' },
  openGraph: { title: 'Solidarité musulmane | Al-Wasil', description: 'Initiatives, associations et collectes avec leurs modalités.', url: 'https://al-wasil.fr/solidarity', type: 'website' },
};

export const revalidate = 3600;

export default async function SolidarityPage() {
  const [cagnottes, initiatives, visiteMalades, voyagesHumanitaires, associations] =
    await Promise.all([
      getCagnottes(),
      getInitiatives(),
      getVisiteMalades(),
      getVoyagesHumanitaires(),
      getAssociations(),
    ]);

  return (
    <SolidarityClient
      cagnottes={cagnottes}
      initiatives={initiatives}
      visiteMalades={visiteMalades}
      voyagesHumanitaires={voyagesHumanitaires}
      associations={associations}
    />
  );
}
