import {
  getPsyProfiles,
  getHijamaProfiles,
  getRoqyaProfiles,
  getMedicalProfiles,
} from '@/lib/db-queries';
import SanteClient from './SanteClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Santé et accompagnement adaptés au public musulman | Al-Wasil',
  description: 'Recherchez des professionnels de santé et de l’accompagnement par spécialité, département et format, avec les informations publiées sur leurs fiches.',
  alternates: { canonical: 'https://al-wasil.fr/sante' },
  openGraph: { title: 'Santé et accompagnement | Al-Wasil', description: 'Recherchez des professionnels par spécialité, département et format.', url: 'https://al-wasil.fr/sante', type: 'website' },
};

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
