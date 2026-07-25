import {
  getCagnottes,
  getInitiatives,
  getVisiteMalades,
  getVoyagesHumanitaires,
  getAssociations,
} from '@/lib/db-queries';
import SolidarityClient from './SolidarityClient';

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
