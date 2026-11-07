import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacter Al-Wasil',
  description: 'Contacter l’équipe Al-Wasil, proposer une ressource ou signaler une correction sur le site.',
  alternates: { canonical: 'https://al-wasil.fr/contact' },
  openGraph: { title: 'Contacter Al-Wasil', description: 'Proposer une ressource ou signaler une correction.', url: 'https://al-wasil.fr/contact', type: 'website' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
