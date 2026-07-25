import { getInstituts } from '@/lib/db-queries';
import EducationClient from './EducationClient';

export const revalidate = 3600;

export default async function EducationPage() {
  const instituts = await getInstituts();
  return <EducationClient instituts={instituts} />;
}
