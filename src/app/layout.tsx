import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const BASE_URL = 'https://alwasil-platform.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Al-Wasil — La plateforme de la communauté musulmane en France',
    template: '%s | Al-Wasil',
  },
  description: 'Emploi voile accepté, librairies islamiques, piscines burkini, Hajj & Omra, psychologues, hijama, roqya, événements et solidarité. La plateforme de référence pour les musulmans de France.',
  keywords: [
    'librairie islamique Paris', 'piscine burkini Île-de-France', 'emploi voile accepté',
    'hijama certifié Paris', 'psychologue musulman', 'roqya char\'iyya France',
    'Hajj 2026 France', 'Omra pas cher', 'agence Hajj comparateur',
    'cagnotte islamique', 'événements islamiques France', 'cours arabe Paris',
    'solidarité musulmane', 'plateforme communauté musulmane France', 'Al-Wasil',
  ],
  authors: [{ name: 'Al-Wasil' }],
  creator: 'Al-Wasil Platform',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Al-Wasil',
    title: 'Al-Wasil — La plateforme de la communauté musulmane en France',
    description: 'Emploi voile accepté, librairies islamiques, piscines burkini, Hajj & Omra, psychologues, hijama, événements et solidarité.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Al-Wasil' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Wasil — Communauté musulmane France',
    description: 'Emploi voile OK, librairies, piscines burkini, Hajj, psychologues, hijama…',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD — Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Al-Wasil',
              alternateName: 'الواصل',
              url: BASE_URL,
              description: 'Plateforme communautaire pour les musulmans de France : emploi, santé, éducation, solidarité, Hajj, librairies, piscines burkini.',
              inLanguage: 'fr-FR',
              audience: { '@type': 'Audience', audienceType: 'Muslims in France' },
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/education?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        <Navigation />
        <main style={{ minHeight: 'calc(100vh - 4rem - 300px)' }}>
          {children}
        </main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
