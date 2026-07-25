import {
  getPsyProfiles,
  getHijamaProfiles,
  getRoqyaProfiles,
  getMedicalProfiles,
} from '@/lib/db-queries';
import SanteClient from './SanteClient';

export const revalidate = 3600;

export default async function SantePage() {
  const [psyProfiles, hijamaProfiles, roqyaProfiles, medicalProfiles] = await Promise.all([
    getPsyProfiles(),
    getHijamaProfiles(),
    getRoqyaProfiles(),
    getMedicalProfiles(),
  ]);

  return (
    <SanteClient
      psyProfiles={psyProfiles}
      hijamaProfiles={hijamaProfiles}
      roqyaProfiles={roqyaProfiles}
      medicalProfiles={medicalProfiles}
    />
  );
}
