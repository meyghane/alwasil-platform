import { getHajjAgences, getHajjPackages } from '@/lib/db-queries';
import HajjClient from './HajjClient';

export const metadata = {
  title: 'Offres Hajj 2027 et Omra 2026-2027 en France | Al-Wasil',
  description: 'Comparez des offres Hajj et Omra depuis la France : périodes, départs, prix et prestations. Contactez Al-Wasil pour demander une mise en relation.',
  alternates: { canonical: 'https://al-wasil.fr/hajj' },
  openGraph: { title: 'Offres Hajj 2027 et Omra en France | Al-Wasil', description: 'Comparez les offres Hajj et Omra puis contactez Al-Wasil pour être mis en relation.', url: 'https://al-wasil.fr/hajj', type: 'website' },
};

// Les offres sont modérées dans Neon et doivent apparaître juste après
// leur validation depuis Telegram ou l'admin.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HajjPage() {
  const [hajjAgences, hajjPackages] = await Promise.all([
    getHajjAgences(),
    getHajjPackages(),
  ]);
  const faq = [
    { '@type': 'Question', name: 'Comment choisir une offre Hajj ou Omra ?', acceptedAnswer: { '@type': 'Answer', text: 'Comparez le départ, les dates, le prix par personne, les hôtels, la distance du Haram, les prestations incluses et la date de mise à jour de l’offre.' } },
    { '@type': 'Question', name: 'Al-Wasil est-il une agence de voyage ?', acceptedAnswer: { '@type': 'Answer', text: 'Non. Al-Wasil présente des offres et organise, sur demande, une mise en relation avec l’agence concernée. Le contrat et le paiement sont conclus avec l’agence.' } },
    { '@type': 'Question', name: 'Comment demander une mise en relation ?', acceptedAnswer: { '@type': 'Answer', text: 'Contactez Al-Wasil depuis la fiche de l’offre. Al-Wasil étudie votre demande et organise la mise en relation avec l’agence concernée. Les coordonnées directes des agences ne sont pas affichées sur le site.' } },
    { '@type': 'Question', name: 'Comment les offres sont-elles vérifiées ?', acceptedAnswer: { '@type': 'Answer', text: 'Chaque fiche conserve sa source, sa date de vérification et les informations disponibles. Les prix, places, documents et conditions restent à confirmer avec le professionnel avant toute réservation.' } },
    { '@type': 'Question', name: 'Les places restantes sont-elles garanties ?', acceptedAnswer: { '@type': 'Answer', text: 'Les places affichées correspondent à la dernière information disponible et doivent être confirmées avant toute réservation.' } },
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': 'https://al-wasil.fr/hajj#page', name: 'Offres Hajj 2027 et Omra 2026-2027 en France', url: 'https://al-wasil.fr/hajj', isPartOf: { '@id': 'https://al-wasil.fr/#website' } },
      { '@type': 'FAQPage', mainEntity: faq },
      ...hajjPackages.slice(0, 50).map(pkg => ({ '@type': 'Product', name: pkg.name, description: pkg.description, offers: { '@type': 'Offer', price: pkg.price, priceCurrency: 'EUR', url: `https://al-wasil.fr/hajj/offres/${pkg.id}` } })),
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><HajjClient hajjAgences={hajjAgences} hajjPackages={hajjPackages} /></>;
}
