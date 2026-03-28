"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, HandHeart, Briefcase, ShieldCheck, User, Heart, Plane, Menu, X, Library } from 'lucide-react';

const NAV_LINKS = [
  { href: '/education', icon: <BookOpen size={17} />, label: 'Éducation' },
  { href: '/events', icon: <Calendar size={17} />, label: 'Événements' },
  { href: '/solidarity', icon: <HandHeart size={17} />, label: 'Solidarité' },
  { href: '/jobs', icon: <Briefcase size={17} />, label: 'Emploi' },
  { href: '/sante', icon: <Heart size={17} />, label: 'Santé' },
  { href: '/librairies', icon: <Library size={17} />, label: 'Librairies' },
  { href: '/hajj', icon: <Plane size={17} />, label: 'Hajj & Omra' },
  { href: '/justice', icon: <ShieldCheck size={17} />, label: 'Justice' },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        borderBottom: '1px solid #e7e5e4',
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: '#1c1917' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#0d9488', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <span style={{ fontSize: '20px' }}>W</span>
            </div>
            <span style={{ color: '#1c1917' }}>Al-Wasil</span>
          </Link>

          {/* Desktop Menu — masqué sur mobile */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <NavLink key={l.href} href={l.href} icon={l.icon} label={l.label} />
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/connexion" className="btn btn-outline nav-desktop" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', color: '#1c1917', borderColor: '#e7e5e4', backgroundColor: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link href="/connexion" className="btn btn-primary nav-desktop" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
              S&apos;inscrire
            </Link>
            {/* Burger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-mobile-btn"
              style={{ background: 'none', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#1c1917', display: 'flex', alignItems: 'center' }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 40,
        }} onClick={() => setMenuOpen(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e7e5e4',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
          }} onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 0.5rem', fontSize: '1rem', fontWeight: 500,
                  color: '#1c1917', borderRadius: '8px', textDecoration: 'none',
                  borderBottom: '1px solid #f5f5f4',
                }}>
                <span style={{ color: '#0d9488' }}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', border: '1px solid #e7e5e4', borderRadius: '8px', backgroundColor: 'white', color: '#1c1917', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>
                Connexion
              </Link>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', backgroundColor: '#0d9488', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile-btn { display: none !important; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link href={href} style={{
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.85rem', color: '#57534e', fontWeight: 500, transition: 'color 0.2s',
    textDecoration: 'none',
  }}
    onMouseOver={e => (e.currentTarget.style.color = '#0d9488')}
    onMouseOut={e => (e.currentTarget.style.color = '#57534e')}
  >
    {icon} {label}
  </Link>
);

export default Navigation;
