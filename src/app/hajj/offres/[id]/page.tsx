import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHajjPackages } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function HajjOfferPage({ params }: Props) {
  const { id } = await params;
  const packages = await getHajjPackages();
  const offer = packages.find(item => item.id === id);
  if (!offer) notFound();

  const title = `${offer.name} | Offre Hajj & Omra | Al-Wasil`;
  const description = `${offer.description} Départ : ${offer.departCities.join(', ')}. Prix indicatif : ${offer.price.toLocaleString('fr-FR')} € par personne.`;
  const sourcedRatings = (offer.externalReviews || []).filter(review => typeof review.rating === 'number' && review.rating > 0 && typeof review.reviewCount === 'number' && review.reviewCount > 0);
  const totalReviews = sourcedRatings.reduce((sum, review) => sum + (review.reviewCount || 0), 0);
  const aggregateRating = totalReviews > 0 ? { '@type': 'AggregateRating', ratingValue: sourcedRatings.reduce((sum, review) => sum + (review.rating || 0) * (review.reviewCount || 0), 0) / totalReviews, reviewCount: totalReviews, bestRating: 5, worstRating: 1 } : undefined;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: offer.name,
    description: offer.description,
    category: 'Voyage Hajj et Omra',
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(offer.lastVerifiedAt ? { dateModified: offer.lastVerifiedAt } : {}),
    offers: { '@type': 'Offer', url: `https://al-wasil.fr/hajj/offres/${encodeURIComponent(offer.id)}`, price: offer.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
  };
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Al-Wasil', item: 'https://al-wasil.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Hajj & Omra', item: 'https://al-wasil.fr/hajj' },
      { '@type': 'ListItem', position: 3, name: offer.name, item: `https://al-wasil.fr/hajj/offres/${encodeURIComponent(offer.id)}` },
    ],
  };

  return <main style={{ background: '#f0ebfa', minHeight: '100vh', padding: '2rem 1rem' }}><div className="container" style={{ maxWidth: 850 }}>
    <Link href="/hajj" style={{ color: '#543398', textDecoration: 'none' }}>← Retour aux offres Hajj & Omra</Link>
    <article style={{ background: 'white', borderRadius: 16, padding: 'clamp(1.25rem, 4vw, 2.5rem)', marginTop: '1.25rem', border: '1px solid #e2d7f5' }}>
      <span style={{ color: '#6540b5', fontWeight: 700, fontSize: '.8rem' }}>Offre {offer.type === 'hajj' ? 'Hajj 2027' : 'Omra'}</span>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', margin: '.55rem 0' }}>{offer.name}</h1>
      <p style={{ color: '#59565f', lineHeight: 1.65 }}>{offer.description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '.75rem', margin: '1.5rem 0', fontSize: '.9rem' }}>
        <div><strong>Prix indicatif</strong><br />{offer.price.toLocaleString('fr-FR')} € / personne</div>
        <div><strong>Durée</strong><br />{offer.duration} jours</div>
        <div><strong>Départ</strong><br />{offer.departCities.join(', ')}</div>
        <div><strong>Date ou période</strong><br />{offer.departure || 'À confirmer'}</div>
        {offer.airline && <div><strong>Compagnie aérienne</strong><br />{offer.airline}</div>}
        {offer.hotelMakkah && <div><strong>Hôtel à La Mecque</strong><br />{offer.hotelMakkah}</div>}
        {offer.hotelMadinah && <div><strong>Hôtel à Médine</strong><br />{offer.hotelMadinah}</div>}
        {offer.distanceMasjidHaram && <div><strong>Distance du Haram</strong><br />{offer.distanceMasjidHaram} m</div>}
        {offer.distanceMasjidNabawi && <div><strong>Distance du Nabawi</strong><br />{offer.distanceMasjidNabawi} m</div>}
      </div>
      {(offer.priceQuad || offer.priceTriple || offer.priceDouble || offer.priceSingle) && <section style={{ marginTop: '1.25rem' }}><h2 style={{ fontSize: '1.15rem' }}>Tarifs selon la chambre</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '.6rem' }}>{offer.priceQuad && <div><strong>Quadruple</strong><br />{offer.priceQuad.toLocaleString('fr-FR')} € / personne</div>}{offer.priceTriple && <div><strong>Triple</strong><br />{offer.priceTriple.toLocaleString('fr-FR')} € / personne</div>}{offer.priceDouble && <div><strong>Double</strong><br />{offer.priceDouble.toLocaleString('fr-FR')} € / personne</div>}{offer.priceSingle && <div><strong>Individuelle</strong><br />{offer.priceSingle.toLocaleString('fr-FR')} € / personne</div>}</div></section>}
      <h2 style={{ fontSize: '1.15rem' }}>Prestations indiquées</h2>
      <ul>{offer.includes.map(item => <li key={item}>{item}</li>)}</ul>
      {offer.excludes.length > 0 && <><h2 style={{ fontSize: '1.15rem' }}>Non inclus ou en supplément</h2><ul>{offer.excludes.map(item => <li key={item}>{item}</li>)}</ul></>}
      {offer.requiredDocuments && offer.requiredDocuments.length > 0 && <><h2 style={{ fontSize: '1.15rem' }}>Documents généralement requis</h2><ul>{offer.requiredDocuments.map(item => <li key={item}>{item}</li>)}</ul></>}
      {offer.lastVerifiedAt && <p style={{ fontSize: '.82rem', color: '#59565f' }}>Fiche actualisée le {new Date(offer.lastVerifiedAt).toLocaleDateString('fr-FR')}.</p>}
      {offer.externalReviews && offer.externalReviews.length > 0 && <section style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2d7f5' }}><h2 style={{ fontSize: '1.15rem' }}>Avis externes référencés</h2><p style={{ fontSize: '.82rem', color: '#59565f' }}>Ces avis proviennent de sources externes et ne constituent pas une garantie Al-Wasil.</p><ul>{offer.externalReviews.map((review, index) => <li key={`${review.source}-${index}`}><strong>{review.source}</strong>{review.rating ? ` · ${review.rating}/5` : ''}{review.reviewCount ? ` (${review.reviewCount} avis)` : ''} · relevé le {new Date(review.collectedAt).toLocaleDateString('fr-FR')}{review.summary ? ` : ${review.summary}` : ''}</li>)}</ul></section>}
      <p style={{ fontSize: '.8rem', color: '#59565f', marginTop: '1.5rem' }}>Les prix, disponibilités et conditions sont à confirmer avant réservation. Al-Wasil facilite la mise en relation et ne remplace pas le contrat avec l’agence.</p>
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1rem' }}><a href={`/contact?type=hajj-devis&offer_id=${encodeURIComponent(offer.id)}&partner_id=${encodeURIComponent(offer.agenceId)}`} style={{ background: '#7652CA', color: 'white', padding: '.75rem 1rem', borderRadius: 9, textDecoration: 'none', fontWeight: 700 }}>Demander un devis</a></div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, '\\u003c') }} />
  </div></main>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const offer = (await getHajjPackages()).find(item => item.id === id);
  if (!offer) return { title: 'Offre Hajj & Omra | Al-Wasil' };
  const canonical = `https://al-wasil.fr/hajj/offres/${encodeURIComponent(offer.id)}`;
  const metaDescription = `${offer.description} Départs : ${offer.departCities.join(', ')}. Prix indicatif à partir de ${offer.price.toLocaleString('fr-FR')} € par personne.`.slice(0, 160);
  return { title: `${offer.name} | Al-Wasil`, description: metaDescription, alternates: { canonical }, openGraph: { title: `${offer.name} | Al-Wasil`, description: metaDescription, url: canonical, type: 'article', modifiedTime: offer.lastVerifiedAt } };
}
