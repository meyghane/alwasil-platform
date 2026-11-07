import { getPublicPools } from '@/lib/public-places';
import PiscinesClient from './PiscinesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Piscines et créneaux burkini en France | Al-Wasil',
  description: 'Consultez les piscines référencées et vérifiez auprès des gestionnaires les tenues autorisées, créneaux et conditions d’accès.',
  alternates: { canonical: 'https://al-wasil.fr/piscines' },
  openGraph: { title: 'Piscines et créneaux burkini | Al-Wasil', description: 'Consultez les piscines référencées et leurs conditions d’accès.', url: 'https://al-wasil.fr/piscines', type: 'website' },
};

export default async function PiscinesPage() {
  return <PiscinesClient piscines={await getPublicPools()} />;
}
