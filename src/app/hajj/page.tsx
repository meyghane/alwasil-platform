import { getHajjAgences, getHajjPackages } from '@/lib/db-queries';
import HajjClient from './HajjClient';

export const metadata = {
  title: 'Offres Hajj 2027 et Omra 2026-2027 en France | Al-Wasil',
  description: 'Découvrez des offres Hajj et Omra depuis la France, avec prix, départs, hôtels, distances et prestations détaillées. Al-Wasil vous accompagne dans votre demande de devis.',
  alternates: { canonical: 'https://al-wasil.fr/hajj' },
  openGraph: { title: 'Offres Hajj 2027 et Omra en France | Al-Wasil', description: 'Trouvez une offre Hajj ou Omra et demandez un devis accompagné par Al-Wasil.', url: 'https://al-wasil.fr/hajj', type: 'website' },
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
    { '@type': 'Question', name: 'Al-Wasil est-il une agence de voyage ?', acceptedAnswer: { '@type': 'Answer', text: 'Al-Wasil accompagne les visiteurs dans leur recherche et peut transmettre une demande de devis. Les conditions finales sont confirmées directement avec le partenaire concerné.' } },
    { '@type': 'Question', name: 'Que se passe-t-il après une demande de devis ?', acceptedAnswer: { '@type': 'Answer', text: 'Al-Wasil reçoit les informations utiles à votre projet, vérifie la demande puis la transmet au professionnel concerné. Le partenaire vous recontacte ensuite pour confirmer les disponibilités, le prix et les conditions.' } },
    { '@type': 'Question', name: 'Comment les offres sont-elles vérifiées ?', acceptedAnswer: { '@type': 'Answer', text: 'Chaque fiche conserve sa source, sa date de vérification et les informations disponibles. Les prix, places, documents et conditions restent à confirmer avec le professionnel avant toute réservation.' } },
    { '@type': 'Question', name: 'Les places restantes sont-elles garanties ?', acceptedAnswer: { '@type': 'Answer', text: 'Les places affichées correspondent à la dernière information disponible et doivent être confirmées avant toute réservation.' } },
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': 'https://al-wasil.fr/hajj#page', name: 'Offres Hajj 2027 et Omra 2026-2027 en France', url: 'https://al-wasil.fr/hajj', isPartOf: { '@id': 'https://al-wasil.fr/#website' } },
      { '@type': 'FAQPage', mainEntity: faq },
      ...hajjPackages.slice(0, 50).map(pkg => ({ '@type': 'Product', name: pkg.name, description: pkg.description, offers: { '@type': 'Offer', price: pkg.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: 'https://al-wasil.fr/hajj' } })),
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HajjClient hajjAgences={hajjAgences} hajjPackages={hajjPackages} /></>;
}
