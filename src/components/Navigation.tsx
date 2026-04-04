"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, HandHeart, Briefcase, ShieldCheck, Heart, Plane, Menu, X, Library, ChevronDown, Waves, MapPin, PenLine } from 'lucide-react';

type NavItem = { href: string; icon: React.ReactNode; label: string; desc?: string };
type NavGroup = { label: string; items: NavItem[] } | { href: string; icon: React.ReactNode; label: string };

const NAV: NavGroup[] = [
  {
    label: 'Apprendre',
    items: [
      { href: '/education', icon: <BookOpen size={16} />, label: 'Apprentissage', desc: 'Cours, instituts, arabe, Coran' },
      { href: '/guide', icon: <Library size={16} />, label: 'Mes Premiers Pas', desc: 'Les bases de l\'islam pour débuter' },
      { href: '/librairies', icon: <Library size={16} />, label: 'Librairies', desc: 'Librairies islamiques en France' },
      { href: '/blog', icon: <PenLine size={16} />, label: 'Blog', desc: 'Guides pratiques, droits, bons plans' },
    ],
  },
  {
    label: 'Communauté',
    items: [
      { href: '/events', icon: <Calendar size={16} />, label: 'Événements', desc: 'Conférences, portes ouvertes, iftar' },
      { href: '/solidarity', icon: <HandHeart size={16} />, label: 'Solidarité', desc: 'Cagnottes, maraudes, associations' },
    ],
  },
  {
    label: 'Services',
    items: [
      { href: '/sante', icon: <Heart size={16} />, label: 'Santé', desc: 'Psy, hijama, sage-femmes, médecins' },
      { href: '/piscines', icon: <Waves size={16} />, label: 'Piscines Burkini', desc: 'Créneaux burkini en Île-de-France' },
      { href: '/jobs', icon: <Briefcase size={16} />, label: 'Emploi', desc: 'Offres voile OK, prière acceptée' },
      { href: '/justice', icon: <ShieldCheck size={16} />, label: 'Justice', desc: 'Droits, discrimination, ressources' },
    ],
  },
  { href: '/hajj', icon: <Plane size={17} />, label: 'Hajj & Omra' },
];

const PRIMARY = '#5e17eb';
const PRIMARY_LIGHT = '#f3eeff';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter(label: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenGroup(label);
  }
  function handleMouseLeave() {
    timerRef.current = setTimeout(() => setOpenGroup(null), 120);
  }

  return (
    <>
      <nav style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <Image src="/logo-alwassil.png" alt="Al-Wasil" height={48} width={48} style={{ height: '48px', width: '48px', objectFit: 'contain' }} priority />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#0a0a0a', letterSpacing: '-0.02em' }}>Al-Wasil</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="nav-desktop">
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: '#0a0a0a', fontWeight: 600, fontFamily: 'Poppins, sans-serif', textDecoration: 'none', borderRadius: '6px', transition: 'all 0.15s' }}
                    onMouseOver={e => { e.currentTarget.style.color = PRIMARY; e.currentTarget.style.backgroundColor = PRIMARY_LIGHT; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    {group.icon} {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label} style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: openGroup === group.label ? PRIMARY : '#0a0a0a', fontWeight: 600, fontFamily: 'Poppins, sans-serif', background: openGroup === group.label ? PRIMARY_LIGHT : 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {group.label}
                    <ChevronDown size={13} style={{ transition: 'transform 0.15s', transform: openGroup === group.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>

                  {openGroup === group.label && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', border: '2px solid #0a0a0a', borderRadius: '12px', boxShadow: '4px 4px 0px #0a0a0a', padding: '0.5rem', minWidth: '220px', zIndex: 100 }}>
                      {group.items.map((item: NavItem) => {
                        const isWhereSalat = item.href === '/salle-de-priere';
                        return (
                          <Link key={item.href} href={item.href}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.1s', backgroundColor: isWhereSalat ? '#f0fff8' : 'transparent' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = isWhereSalat ? '#d4fbe8' : PRIMARY_LIGHT}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = isWhereSalat ? '#f0fff8' : 'transparent'}
                            onClick={() => setOpenGroup(null)}>
                            <span style={{ color: isWhereSalat ? '#00bf63' : PRIMARY, marginTop: '1px', flexShrink: 0 }}>{item.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {item.label}
                                {isWhereSalat && (
                                  <span style={{ backgroundColor: '#00bf63', color: 'white', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Nouveau
                                  </span>
                                )}
                              </div>
                              {item.desc && <div style={{ fontSize: '0.72rem', color: '#6b6b6b', marginTop: '1px' }}>{item.desc}</div>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Where Salat — bouton standalone */}
            <Link href="/salle-de-priere" className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #5e17eb 0%, #1540ff 100%)', color: 'white', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', textDecoration: 'none', boxShadow: '3px 3px 0px #0a0a0a', whiteSpace: 'nowrap', letterSpacing: '0.01em', border: '2px solid #0a0a0a' }}>
              <span style={{ fontSize: '0.9rem' }}>🕌</span> Where Salat
            </Link>
            <Link href="/connexion" className="btn btn-outline nav-desktop" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', color: '#0a0a0a', borderColor: '#0a0a0a', backgroundColor: 'white', textDecoration: 'none', fontFamily: 'Poppins, sans-serif', fontWeight: 600, border: '2px solid #0a0a0a', boxShadow: '2px 2px 0px #0a0a0a', borderRadius: '8px' }}>
              Connexion
            </Link>
            <Link href="/connexion" className="nav-desktop" style={{ fontSize: '0.875rem', textDecoration: 'none', padding: '0.5rem 0.75rem', backgroundColor: PRIMARY, color: 'white', borderRadius: '8px', fontWeight: 700, fontFamily: 'Poppins, sans-serif', border: '2px solid #0a0a0a', boxShadow: '2px 2px 0px #0a0a0a' }}>
              Rejoindre la bêta
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn"
              style={{ background: 'none', border: '2px solid #0a0a0a', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#0a0a0a', display: 'flex', alignItems: 'center' }}
              aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} onClick={() => setMenuOpen(false)}>
          <div style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #0a0a0a', padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', fontSize: '1rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', color: '#0a0a0a', borderRadius: '8px', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: PRIMARY }}>{group.icon}</span> {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.5rem 0.25rem', marginTop: '0.25rem' }}>
                    {group.label}
                  </div>
                  {group.items.map((item: NavItem) => {
                    const isWhereSalat = item.href === '/salle-de-priere';
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif', color: '#0a0a0a', borderRadius: '8px', textDecoration: 'none', backgroundColor: isWhereSalat ? '#f0fff8' : 'transparent' }}>
                        <span style={{ color: isWhereSalat ? '#00bf63' : PRIMARY }}>{item.icon}</span>
                        {item.label}
                        {isWhereSalat && (
                          <span style={{ backgroundColor: '#00bf63', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                            Nouveau
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
            {/* Where Salat mobile */}
            <Link href="/salle-de-priere" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'linear-gradient(135deg, #5e17eb 0%, #1540ff 100%)', border: '2px solid #0a0a0a', borderRadius: '10px', color: 'white', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textDecoration: 'none', marginTop: '0.5rem' }}>
              <span>🕌</span> Where Salat
            </Link>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', border: '2px solid #0a0a0a', borderRadius: '8px', backgroundColor: 'white', color: '#0a0a0a', fontWeight: 600, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>Connexion</Link>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', backgroundColor: PRIMARY, border: '2px solid #0a0a0a', borderRadius: '8px', color: 'white', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>Rejoindre la bêta</Link>
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
}
