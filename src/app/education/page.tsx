import { getInstituts } from '@/lib/db-queries';
import EducationClient from './EducationClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours d’arabe, Coran et sciences islamiques | Al-Wasil',
  description: 'Recherchez des instituts, mosquées et cours d’arabe, de Coran ou de sciences islamiques par ville, département et format, en présentiel ou à distance.',
  alternates: { canonical: 'https://al-wasil.fr/education' },
  openGraph: { title: 'Cours d’arabe, Coran et sciences islamiques | Al-Wasil', description: 'Recherchez des instituts et cours par ville, département et format.', url: 'https://al-wasil.fr/education', type: 'website' },
};

// Les validations éditoriales doivent devenir visibles dès la publication.
export const dynamic = 'force-dynamic';

export default async function EducationPage() {
  const instituts = await getInstituts();
  return <EducationClient instituts={instituts} />;
}
