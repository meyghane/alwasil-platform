import { getJobOffers, getTalentProfiles } from '@/lib/db-queries';
import JobsClient from './JobsClient';

export const revalidate = 3600;

export default async function JobsPage() {
  const [jobOffers, talentProfiles] = await Promise.all([
    getJobOffers(),
    getTalentProfiles(),
  ]);
  return <JobsClient jobOffers={jobOffers} talentProfiles={talentProfiles} />;
}
