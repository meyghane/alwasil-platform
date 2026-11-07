import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Annoncer auprès de la communauté Al-Wasil',
  description: 'Découvrir les formats et conditions pour présenter une offre ou un service aux visiteurs d’Al-Wasil.',
  alternates: { canonical: 'https://al-wasil.fr/annonceurs' },
  openGraph: { title: 'Annoncer auprès de la communauté Al-Wasil', description: 'Formats et informations pour présenter une offre sur Al-Wasil.', url: 'https://al-wasil.fr/annonceurs', type: 'website' },
};

export default function AnnonceursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
