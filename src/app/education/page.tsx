import { getInstituts } from '@/lib/db-queries';
import EducationClient from './EducationClient';

// Les validations éditoriales doivent devenir visibles dès la publication.
export const dynamic = 'force-dynamic';

export default async function EducationPage() {
  const instituts = await getInstituts();
  return <EducationClient instituts={instituts} />;
}
