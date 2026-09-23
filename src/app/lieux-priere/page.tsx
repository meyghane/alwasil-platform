import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import LieuxPriereMap from '@/components/LieuxPriereMap';
import { getPublicMosques } from '@/lib/public-places';

export const metadata = {
  title: 'Lieux de prière en France | Al-Wasil',
  description: 'Mosquées et lieux de prière référencés en France, avec adresse et accès Google Maps.',
};

export default async function LieuxPrierePage() {
  const lieux = await getPublicMosques();
  return <main>
    <PageHeader title="Lieux de prière" titleAr="أماكن الصلاة" description="Mosquées et salles de prière près de chez vous, avec les informations disponibles." color="#ECFF58" emoji="" />
    <div className="container" style={{ maxWidth: 1100, padding: '2rem 1rem 5rem' }}>
      <div style={{ background: '#ECFF58', borderRadius: 18, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#080808' }}><strong>Trouver un lieu près de soi</strong><p style={{ margin: '.35rem 0 0', lineHeight: 1.5 }}>Sélectionne une fiche pour consulter son adresse et ouvrir l’itinéraire.</p></div>
      {!lieux.length ? <p style={{ color: '#57534e' }}>Les lieux sont en cours de référencement.</p> : <LieuxPriereMap lieux={lieux} />}
      <p style={{ marginTop: '2rem', color: '#57534e', fontSize: '.85rem' }}>Une information est incomplète ? <Link href="/contact?type=mosquee" style={{ color: '#7652CA', fontWeight: 700 }}>Nous la signaler</Link>.</p>
    </div>
  </main>;
}
