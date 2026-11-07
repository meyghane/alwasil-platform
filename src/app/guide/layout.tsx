import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide des premiers pas dans l’islam | Al-Wasil',
  description: 'Repères pour découvrir les bases de l’islam, la prière et les ressources d’apprentissage et d’accompagnement.',
  alternates: { canonical: 'https://al-wasil.fr/guide' },
  openGraph: { title: 'Guide des premiers pas dans l’islam | Al-Wasil', description: 'Repères sur les bases, la prière et les ressources d’accompagnement.', url: 'https://al-wasil.fr/guide', type: 'website' },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
