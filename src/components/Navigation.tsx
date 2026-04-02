"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
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
      { href: '/salle-de-priere', icon: <MapPin size={16} />, label: 'Where Salat', desc: 'Trouve un espace de prière près de toi' },
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

const TEAL = '#0d9488';

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
      <nav style={{ borderBottom: '1px solid #e7e5e4', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: '#1c1917', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: TEAL, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <span style={{ fontSize: '20px' }}>W</span>
            </div>
            <span>Al-Wasil</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="nav-desktop">
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: '#57534e', fontWeight: 500, textDecoration: 'none', borderRadius: '6px', transition: 'all 0.15s' }}
                    onMouseOver={e => { e.currentTarget.style.color = TEAL; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#57534e'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    {group.icon} {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label} style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: openGroup === group.label ? TEAL : '#57534e', fontWeight: 500, background: openGroup === group.label ? '#f0fdfa' : 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {group.label}
                    <ChevronDown size={13} style={{ transition: 'transform 0.15s', transform: openGroup === group.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>

                  {openGroup === group.label && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', border: '1px solid #e7e5e4', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '0.5rem', minWidth: '220px', zIndex: 100 }}>
                      {group.items.map((item: NavItem) => {
                        const isWhereSalat = item.href === '/salle-de-priere';
                        return (
                          <Link key={item.href} href={item.href}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.1s', backgroundColor: isWhereSalat ? '#f0fdf4' : 'transparent' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = isWhereSalat ? '#dcfce7' : '#f0fdfa'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = isWhereSalat ? '#f0fdf4' : 'transparent'}
                            onClick={() => setOpenGroup(null)}>
                            <span style={{ color: isWhereSalat ? '#16a34a' : TEAL, marginTop: '1px', flexShrink: 0 }}>{item.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1c1917', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {item.label}
                                {isWhereSalat && (
                                  <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Nouveau
                                  </span>
                                )}
                              </div>
                              {item.desc && <div style={{ fontSize: '0.72rem', color: '#78716c', marginTop: '1px' }}>{item.desc}</div>}
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
            <Link href="/connexion" className="btn btn-outline nav-desktop" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', color: '#1c1917', borderColor: '#e7e5e4', backgroundColor: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link href="/connexion" className="btn btn-primary nav-desktop" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
              S&apos;inscrire
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn"
              style={{ background: 'none', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#1c1917', display: 'flex', alignItems: 'center' }}
              aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '4rem', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={() => setMenuOpen(false)}>
          <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4', padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#1c1917', borderRadius: '8px', textDecoration: 'none', borderBottom: '1px solid #f5f5f4' }}>
                    <span style={{ color: TEAL }}>{group.icon}</span> {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.5rem 0.25rem', marginTop: '0.25rem' }}>
                    {group.label}
                  </div>
                  {group.items.map((item: NavItem) => {
                    const isWhereSalat = item.href === '/salle-de-priere';
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', fontSize: '0.95rem', fontWeight: 500, color: '#1c1917', borderRadius: '8px', textDecoration: 'none', backgroundColor: isWhereSalat ? '#f0fdf4' : 'transparent' }}>
                        <span style={{ color: isWhereSalat ? '#16a34a' : TEAL }}>{item.icon}</span>
                        {item.label}
                        {isWhereSalat && (
                          <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                            Nouveau
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', border: '1px solid #e7e5e4', borderRadius: '8px', backgroundColor: 'white', color: '#1c1917', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>Connexion</Link>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '0.625rem', backgroundColor: TEAL, borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}>S&apos;inscrire</Link>
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
