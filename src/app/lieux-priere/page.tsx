import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { getMosquees } from '@/lib/sheets';

export const metadata = {
  title: 'Lieux de prière en France | Al-Wasil',
  description: 'Mosquées et lieux de prière référencés en France, avec adresse et accès Google Maps.',
};

export default async function LieuxPrierePage() {
  const lieux = (await getMosquees()).slice(0, 60);
  return <main>
    <PageHeader title="Lieux de prière" titleAr="أماكن الصلاة" description="Mosquées et salles de prière près de chez vous, avec les informations disponibles." color="#ECFF58" emoji="" />
    <div className="container" style={{ maxWidth: 1100, padding: '2rem 1rem 5rem' }}>
      <div style={{ background: '#ECFF58', borderRadius: 18, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#080808' }}><strong>Trouver un lieu près de soi</strong><p style={{ margin: '.35rem 0 0', lineHeight: 1.5 }}>Sélectionne une fiche pour consulter son adresse et ouvrir l’itinéraire.</p></div>
      {!lieux.length ? <p style={{ color: '#57534e' }}>Les lieux sont en cours de référencement.</p> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 14 }}>{lieux.map((lieu, index) => { const address = [lieu.adresse, lieu.ville].filter(Boolean).join(', '); const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || lieu.nom)}`; return <article key={lieu.id_osm || `${lieu.nom}-${index}`} style={{ border: '1px solid #e7e5e4', borderTop: '4px solid #ECFF58', borderRadius: 18, padding: '1.1rem', background: 'white' }}><h2 style={{ fontSize: '1rem', margin: '0 0 .6rem' }}>{lieu.nom}</h2><p style={{ display: 'flex', gap: 6, alignItems: 'flex-start', color: '#57534e', fontSize: '.86rem', lineHeight: 1.45, minHeight: 42 }}><MapPin size={15} style={{ flexShrink: 0, marginTop: 2 }} />{address || 'Adresse à préciser'}</p><a href={maps} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#080808', fontWeight: 700, fontSize: '.85rem' }}>Itinéraire Google Maps <ArrowRight size={15} /></a></article>; })}</div>}
      <p style={{ marginTop: '2rem', color: '#57534e', fontSize: '.85rem' }}>Une information est incomplète ? <Link href="/contact?type=mosquee" style={{ color: '#7652CA', fontWeight: 700 }}>Nous la signaler</Link>.</p>
    </div>
  </main>;
}
