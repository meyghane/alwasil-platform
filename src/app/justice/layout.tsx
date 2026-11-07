import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Droits, laïcité et recours en France | Al-Wasil',
  description: 'Repères et ressources sur les droits, la laïcité et les recours liés aux situations rencontrées par les musulmans en France.',
  alternates: { canonical: 'https://al-wasil.fr/justice' },
  openGraph: { title: 'Droits et recours en France | Al-Wasil', description: 'Repères sur les droits, la laïcité et les recours.', url: 'https://al-wasil.fr/justice', type: 'website' },
};

export default function JusticeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
