'use client';

import Link from 'next/link';
import Image from 'next/image';

const SECTIONS = [
  {
    title: 'Ressources',
    links: [
      { href: '/education', label: '📚 Apprentissage & Cours' },
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
    <footer style={{ borderTop: '2px solid #0a0a0a', backgroundColor: '#0a0a0a', marginTop: '4rem', color: 'white' }}>
      <div className="container" style={{ padding: '3rem 1rem 2rem' }}>

        {/* Grid links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {SECTIONS.map(section => (
            <div key={section.title}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9a9a', marginBottom: '0.875rem' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.links.map(link => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} style={{ fontSize: '0.85rem', color: '#cccccc', textDecoration: 'none', lineHeight: 1.4 }}
                      onMouseOver={e => (e.currentTarget.style.color = '#6ee7b7')}
                      onMouseOut={e => (e.currentTarget.style.color = '#9a9a9a')}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Image src="/logo-alwasil.png" alt="al wasil" height={48} width={48} style={{ height: '48px', width: '48px', objectFit: 'contain' }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0 }}>La plateforme de la communauté musulmane française</p>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#6a6a6a' }}>© {year} Al-Wasil. Tous droits réservés.</p>
        </div>

        {/* Espace pub footer */}
        <div style={{ marginTop: '1.5rem', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #2a2a2a', textAlign: 'center' }}>
          <Link href="/annonceurs" style={{ fontSize: '0.78rem', color: '#9a9a9a', textDecoration: 'none' }}>
            📣 Emplacement publicitaire disponible — <strong style={{ color: '#6ee7b7' }}>Annoncez sur Al-Wasil →</strong>
          </Link>
        </div>
      </div>
    </footer>
  );
}
