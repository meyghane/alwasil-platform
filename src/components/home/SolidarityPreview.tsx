import Link from 'next/link';
import { ArrowUpRight, HeartHandshake } from 'lucide-react';
import { getVoyagesHumanitaires } from '@/lib/db-queries';

export default async function SolidarityPreview() {
  const voyages = await getVoyagesHumanitaires();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = voyages.filter(v => v.nextDeparture && /^\d{4}-\d{2}-\d{2}$/.test(v.nextDeparture) && v.nextDeparture > today)
    .sort((a, b) => a.nextDeparture!.localeCompare(b.nextDeparture!))[0];
  // Source organisateur consultée le 16/09/2026. Ne pas annoncer de places disponibles.
  const verifiedMission = today < '2026-11-08';
  const cards = [
    { label: 'Voyage humanitaire', title: upcoming?.title ?? (verifiedMission ? 'Une mission en Algérie' : 'Les prochains départs'),
      text: upcoming ? `${upcoming.organizer} · Départ le ${new Date(upcoming.nextDeparture!).toLocaleDateString('fr-FR')}` : verifiedMission ? 'Oumma & Rahma · 8–14 novembre 2026. Une mission à soutenir.' : 'Consultez les missions et les dates auprès des associations.',
      href: upcoming ? '/solidarity#voyages' : verifiedMission ? 'https://www.oummaetrahma.org/aide-humanitaire-en-algerie/' : '/solidarity#voyages', image: '/images/testimonials/hajj-flight.png' },
    { label: 'Maraudes', title: 'Donner un peu de son temps', text: 'Rencontrez les équipes et découvrez les actions près de chez vous.', href: '/solidarity#maraudes', image: '/images/testimonials/solidarite.png' },
    { label: 'Mosquées', title: 'Bâtir un lieu qui rassemble', text: 'Découvrez les collectes pour les lieux de prière.', href: '/solidarity#mosquee', image: '/images/brand/mosque-v2.png' },
    { label: 'Orphelins', title: 'Accompagner dans la durée', text: 'Découvrez les programmes de soutien et de parrainage.', href: '/solidarity#orphelins', image: '/images/testimonials/education-library.png' },
    { label: 'Palestine', title: 'Soutenir les familles', text: 'Retrouvez les appels à la solidarité et les collectes humanitaires.', href: '/solidarity#palestine', image: '/images/testimonials/solidarite.png' },
  ];
  return <section aria-labelledby="solidarity-preview-title" style={{ background: '#f5f3f8', padding: '64px 0 48px', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 24px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6540b5', fontSize: 12, fontWeight: 600 }}><HeartHandshake size={17} /> SOLIDARITÉ</span>
        <h2 id="solidarity-preview-title" style={{ fontSize: 'clamp(30px, 4.5vw, 60px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-.05em', margin: '16px 0', textTransform: 'uppercase' }}>Un geste pour vous.<br/><span style={{ color: '#7652CA' }}>Beaucoup pour les autres.</span></h2>
        <p style={{ color: '#59565f', fontSize: 14, lineHeight: 1.6 }}>Du temps, un don, un engagement : trouvez votre façon d’agir.</p>
      </div>
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'clamp(260px, 27vw, 330px)', gap: 14, overflowX: 'auto', scrollSnapType: 'x proximity', padding: '28px 0 40px' }}>
        {cards.map((card, index) => <Link key={card.label} href={card.href} style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', aspectRatio: '0.9', borderRadius: 20, overflow: 'hidden', padding: 22, color: '#fff', background: '#080808', transform: index % 2 ? 'translateY(-16px)' : 'translateY(8px)', scrollSnapAlign: 'start' }}>
          <img src={card.image} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,.25), rgba(8,8,8,.12) 25%, rgba(8,8,8,.95) 100%)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><span style={{ background: index % 2 ? '#7652CA' : '#ECFF58', color: index % 2 ? '#fff' : '#080808', padding: '7px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{card.label}</span><ArrowUpRight size={21} /></div>
          <div style={{ position: 'relative' }}><h3 style={{ fontSize: 25, lineHeight: 1.1, fontWeight: 500, letterSpacing: '-.035em', marginBottom: 10 }}>{card.title}</h3><p style={{ fontSize: 12, lineHeight: 1.55, color: '#fff' }}>{card.text}</p></div>
        </Link>)}
      </div>
      <div style={{ textAlign: 'center' }}><Link href="/solidarity" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, borderRadius: 999, padding: '14px 24px', background: '#080808', color: '#ECFF58', fontSize: 14, fontWeight: 600 }}>Voir plus de projets solidaires <ArrowUpRight size={18}/></Link><p style={{ marginTop: 12, fontSize: 11, color: '#59565f' }}>Images d’illustration · Dates et modalités à confirmer auprès des organisateurs.</p></div>
    </div>
  </section>;
}
