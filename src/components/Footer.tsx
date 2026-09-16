import Link from 'next/link';
import { ArrowUpRight, BookOpen, CalendarDays, HeartHandshake, Users } from 'lucide-react';

const sections = [
  { title: 'Explorer', links: [['Événements', '/events'], ['Solidarité & cagnottes', '/solidarity'], ['Cours & instituts', '/education'], ['Librairies', '/librairies'], ['Hajj & Omra', '/hajj']] },
  { title: 'Services', links: [['Emploi', '/jobs'], ['Santé & accompagnement', '/sante'], ['Piscines burkini', '/piscines'], ['Justice & droits', '/justice']] },
  { title: 'Participer', links: [['Proposer une fiche', '/contact?type=initiative'], ['Devenir annonceur', '/annonceurs'], ['Nous contacter', '/contact']] },
  { title: 'Al-Wasil', links: [['Le blog', '/blog'], ['Le guide', '/guide'], ['Mentions légales', '/legal#mentions'], ['Confidentialité', '/legal#confidentialite']] },
];
const highlights = [
  { icon: CalendarDays, title: 'Se retrouver', text: 'Des événements à découvrir.' },
  { icon: HeartHandshake, title: 'S’entraider', text: 'Des initiatives à soutenir.' },
  { icon: BookOpen, title: 'Apprendre', text: 'Des cours et des instituts.' },
  { icon: Users, title: 'Contribuer', text: 'Une ressource à partager ?' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#f5f5f3', color: '#171717' }}>
      <div style={{ background: '#080808', color: '#fff' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '22px clamp(20px, 4vw, 56px)', display: 'flex', flexWrap: 'wrap', gap: '24px 32px' }}>
          {highlights.map(({ icon: Icon, title, text }) => (
            <div key={title} style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <Icon size={25} strokeWidth={1.4} color="#ECFF58" aria-hidden="true" />
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.045em' }}>{title}</p>
                <p style={{ fontSize: 11, color: '#c9c9c9', marginTop: 3 }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '48px clamp(20px, 4vw, 56px) 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px 48px', paddingBottom: 40 }}>
          <div style={{ flex: '1.5 1 240px', maxWidth: 330 }}>
            <Link href="/" aria-label="Al-Wasil — Accueil" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 23, fontWeight: 800, letterSpacing: '-1px' }}>AL-WASIL</Link>
            <h2 style={{ marginTop: 12, fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>Gardons le lien</h2>
            <p style={{ marginTop: 10, fontSize: 12, lineHeight: 1.8, color: '#505050', maxWidth: 275 }}>Les ressources de la communauté musulmane, à portée de main. Une question ou une initiative à partager ?</p>
            <Link href="/contact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bcbcb8', marginTop: 18, maxWidth: 275, minHeight: 46, fontSize: 12 }}>
              <span style={{ padding: '0 14px' }}>Écrivez-nous</span>
              <span style={{ display: 'grid', placeItems: 'center', alignSelf: 'stretch', width: 46, background: '#ECFF58', color: '#080808' }}><ArrowUpRight size={19} aria-hidden="true" /></span>
            </Link>
          </div>
          {sections.map(section => (
            <nav key={section.title} aria-label={`Pied de page — ${section.title}`} style={{ flex: '1 1 140px' }}>
              <h2 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.035em', marginBottom: 14 }}>{section.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map(([label, href]) => (
                  <li key={href}><Link href={href} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 12, lineHeight: 1.5, color: '#404040' }}>{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #deded9', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px 28px', fontSize: 11, color: '#505050' }}>
          <p>© {new Date().getFullYear()} Al-Wasil. Tous droits réservés.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            <Link href="/legal#confidentialite" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>Confidentialité</Link>
            <Link href="/legal#cgu" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>Conditions d’utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
