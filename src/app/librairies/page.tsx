import { getLibrairies } from '@/lib/db-queries';
import LibrairiesClient from './LibrairiesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Librairies arabes et musulmanes | Al-Wasil',
  description: 'Trouvez une librairie arabe ou musulmane par ville, département et spécialité : Coran, livres islamiques, langue arabe et jeunesse. Vérifiez les informations avant de vous déplacer.',
  alternates: { canonical: 'https://al-wasil.fr/librairies' },
  openGraph: { title: 'Librairies arabes et musulmanes | Al-Wasil', description: 'Trouvez une librairie par ville, département et spécialité.', url: 'https://al-wasil.fr/librairies', type: 'website' },
};

export const revalidate = 3600;

export default async function LibrairiesPage() {
  const librairies = await getLibrairies();
  return <LibrairiesClient librairies={librairies} />;
}
