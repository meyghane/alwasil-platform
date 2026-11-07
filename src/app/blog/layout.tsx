import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Al-Wasil : guides et ressources pour les musulmans',
  description: 'Guides pratiques sur l’apprentissage, les droits, la santé et les ressources utiles aux musulmans en France.',
  alternates: { canonical: 'https://al-wasil.fr/blog' },
  openGraph: { title: 'Blog Al-Wasil : guides et ressources', description: 'Guides pratiques et ressources pour les musulmans en France.', url: 'https://al-wasil.fr/blog', type: 'website' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
