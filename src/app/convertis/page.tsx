import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, MapPin, type LucideIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Convertis | Al-Wasil',
  description: 'Ressources et premiers repères pour les personnes qui découvrent ou souhaitent mieux comprendre l’islam.',
};

const CONVERTI_CARDS: Array<{ title: string; text: string; icon: LucideIcon; href: string }> = [
  { title: 'Les bases', text: 'Comprendre la shahada, les piliers et les premières pratiques.', icon: BookOpen, href: '/guide' },
  { title: 'Prier près de chez soi', text: 'Trouver une mosquée ou une salle de prière autour de toi.', icon: MapPin, href: '/lieux-priere' },
  { title: 'Être accompagné', text: 'Découvrir les ressources et associations accessibles.', icon: Heart, href: '/solidarity' },
];

export default function ConvertisPage() {
  return <main>
    <PageHeader title="Convertis" titleAr="المهتدون" description="Des premiers repères, des ressources accessibles et des lieux pour avancer accompagné." color="#ECFF58" emoji="" />
    <div className="container" style={{ maxWidth: 1050, padding: '2rem 1rem 5rem' }}>
      <section style={{ background: '#080808', color: 'white', borderRadius: 24, padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ECFF58', marginBottom: 12 }}><Heart size={22} /> <strong>Premiers pas</strong></div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', margin: '0 0 .75rem', letterSpacing: '-.04em' }}>Avancer à son rythme, sans rester seul.</h2>
        <p style={{ maxWidth: 680, color: '#e5e5e5', lineHeight: 1.65, marginBottom: 1.25 + 'rem' }}>Retrouve les bases de la foi, de la prière et de la vie quotidienne, puis identifie les lieux et les personnes qui peuvent t’accompagner localement.</p>
        <Link href="/guide" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ECFF58', color: '#080808', borderRadius: 999, padding: '12px 18px', fontWeight: 700, textDecoration: 'none' }}>Ouvrir le guide Premiers pas <ArrowRight size={16} /></Link>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
        {CONVERTI_CARDS.map(({ title, text, icon: Icon, href }) => <Link key={title} href={href} style={{ textDecoration: 'none', color: '#080808', border: '1px solid #e7e5e4', borderRadius: 18, padding: '1.25rem', background: 'white' }}><div style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#ECFF58', marginBottom: 14 }}><Icon size={19} /></div><h3 style={{ margin: '0 0 .45rem' }}>{title}</h3><p style={{ margin: 0, color: '#57534e', lineHeight: 1.5, fontSize: '.9rem' }}>{text}</p></Link>)}
      </div>
    </div>
  </main>;
}
