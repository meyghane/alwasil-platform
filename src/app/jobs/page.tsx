import { getJobOffers, getTalentProfiles } from '@/lib/db-queries';
import JobsClient from './JobsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offres d’emploi inclusives et Muslim-friendly | Al-Wasil',
  description: 'Parcourez les offres d’emploi référencées par secteur et département, avec les informations communiquées par les recruteurs.',
  alternates: { canonical: 'https://al-wasil.fr/jobs' },
  openGraph: { title: 'Offres d’emploi inclusives | Al-Wasil', description: 'Offres référencées par secteur et département.', url: 'https://al-wasil.fr/jobs', type: 'website' },
};

export const revalidate = 3600;

export default async function JobsPage() {
  const [jobOffers, talentProfiles] = await Promise.all([
    getJobOffers(),
    getTalentProfiles(),
  ]);
  return <JobsClient jobOffers={jobOffers} talentProfiles={talentProfiles} />;
}
