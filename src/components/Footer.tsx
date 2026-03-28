'use client';

import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Ressources',
    links: [
      { href: '/education', label: '📚 Éducation & Cours' },
      { href: '/events', label: '📅 Événements' },
      { href: '/solidarity', label: '🤲 Solidarité & Cagnottes' },
      { href: '/librairies', label: '📖 Librairies islamiques' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/jobs', label: '💼 Emploi — Voile & Prière OK' },
      { href: '/sante', label: '🧠 Santé — Psy, Hijama, Roqya' },
      { href: '/piscines', label: '🌊 Piscines Burkini' },
      { href: '/hajj', label: '🕋 Hajj & Omra' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { href: '/justice', label: '⚖️ Justice & Droits' },
      { href: '/annonceurs', label: '📣 Annonceurs' },
      { href: '/contact?type=initiative', label: '💡 Proposer une initiative' },
      { href: '/contact?type=general', label: '✉️ Newsletter' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '/legal#confidentialite', label: 'Confidentialité & RGPD' },
      { href: '/legal#cgu', label: 'Conditions d\'utilisation' },
      { href: '/contact', label: 'Nous contacter' },
      { href: '/legal#mentions', label: 'Mentions légales' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid #e7e5e4', backgroundColor: '#fafaf9', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3rem 1rem 2rem' }}>

        {/* Grid links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {SECTIONS.map(section => (
            <div key={section.title}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#78716c', marginBottom: '0.875rem' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.links.map(link => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} style={{ fontSize: '0.85rem', color: '#57534e', textDecoration: 'none', lineHeight: 1.4 }}
                      onMouseOver={e => (e.currentTarget.style.color = '#0d9488')}
                      onMouseOut={e => (e.currentTarget.style.color = '#57534e')}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#0d9488', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
              W
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917', margin: 0 }}>Al-Wasil — الواصل</p>
              <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0 }}>La plateforme de la communauté musulmane française</p>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#a8a29e' }}>© {year} Al-Wasil. Tous droits réservés.</p>
        </div>

        {/* Espace pub footer */}
        <div style={{ marginTop: '1.5rem', padding: '0.875rem', borderRadius: '0.75rem', border: '2px dashed #e7e5e4', textAlign: 'center' }}>
          <Link href="/annonceurs" style={{ fontSize: '0.78rem', color: '#a8a29e', textDecoration: 'none' }}>
            📣 Emplacement publicitaire disponible — <strong style={{ color: '#0d9488' }}>Annoncez sur Al-Wasil →</strong>
          </Link>
        </div>
      </div>
    </footer>
  );
}
