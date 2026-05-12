"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Calendar, HandHeart, Briefcase, 
  ShieldCheck, Heart, Plane, Menu, X, 
  Library, ChevronDown, Waves, PenLine, 
  Globe, Info
} from 'lucide-react';

type NavItem = { href: string; icon: React.ReactNode; label: string; desc?: string };
type NavGroup = { label: string; items: NavItem[] } | { href: string; icon: React.ReactNode; label: string };

const NAV: NavGroup[] = [
  {
    label: 'Vie Spirituelle',
    items: [
      { href: '/hajj', icon: <Plane size={16} />, label: 'Hajj & Omra', desc: 'Agences, comparatifs et guides' },
      { href: '/guide', icon: <Info size={16} />, label: 'Mes Premiers Pas', desc: 'Bases de l\'islam pour débuter' },
    ],
  },
  {
    label: 'Savoir',
    items: [
      { href: '/education', icon: <BookOpen size={16} />, label: 'Apprentissage', desc: 'Cours, instituts, arabe, Coran' },
      { href: '/librairies', icon: <Library size={16} />, label: 'Librairies', desc: 'Librairies islamiques en France' },
      { href: '/blog', icon: <PenLine size={16} />, label: 'Blog & Articles', desc: 'Guides pratiques et actualités' },
    ],
  },
  {
    label: 'Services & Emploi',
    items: [
      { href: '/jobs', icon: <Briefcase size={16} />, label: 'Emploi', desc: 'Offres voile OK, prière acceptée' },
      { href: '/sante', icon: <Heart size={16} />, label: 'Santé', desc: 'Psy, hijama, praticiens musulmans' },
      { href: '/piscines', icon: <Waves size={16} />, label: 'Piscines', desc: 'Créneaux privés ou burkini' },
      { href: '/justice', icon: <ShieldCheck size={16} />, label: 'Droit & Justice', desc: 'Droits, discrimination, ressources' },
    ],
  },
  {
    label: 'Communauté',
    items: [
      { href: '/events', icon: <Calendar size={16} />, label: 'Événements', desc: 'Conférences, iftars, rencontres' },
      { href: '/solidarity', icon: <HandHeart size={16} />, label: 'Solidarité', desc: 'Cagnottes, maraudes, associations' },
    ],
  },
];

const PRIMARY = '#0d9488';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter(label: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenGroup(label);
  }
  function handleMouseLeave() {
    timerRef.current = setTimeout(() => setOpenGroup(null), 150);
  }

  return (
    <>
      <nav className="nav-container">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>

          {/* Logo — texte seul, sans icône */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Al-Wasil</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', marginTop: '2px' }}>الواصل</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="nav-desktop">
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} className="nav-link">
                    {group.icon} {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label} style={{ position: 'relative' }} onMouseEnter={() => handleMouseEnter(group.label)} onMouseLeave={handleMouseLeave}>
                  <button className={`nav-group-btn ${openGroup === group.label ? 'active' : ''}`}>
                    {group.label}
                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: openGroup === group.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>

                  {openGroup === group.label && (
                    <div className="dropdown-menu">
                      {group.items.map((item: NavItem) => (
                        <Link key={item.href} href={item.href} className="dropdown-item" onClick={() => setOpenGroup(null)}>
                          <span className="dropdown-icon">{item.icon}</span>
                          <div>
                            <div className="dropdown-label">{item.label}</div>
                            {item.desc && <div className="dropdown-desc">{item.desc}</div>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/admin" className="nav-desktop login-link">
              Admin
            </Link>
            <Link href="/contact?type=general" className="btn btn-primary join-btn">
              Proposer une fiche
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            {NAV.map(group => {
              if ('href' in group) {
                return (
                  <Link key={group.href} href={group.href} onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                    <span style={{ color: PRIMARY }}>{group.icon}</span> {group.label}
                  </Link>
                );
              }
              return (
                <div key={group.label} className="mobile-nav-group">
                  <div className="mobile-group-title">{group.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {group.items.map((item: NavItem) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="mobile-dropdown-item">
                        <span style={{ color: PRIMARY }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="mobile-footer">
              <Link href="/contact?type=general" onClick={() => setMenuOpen(false)} className="mobile-btn-primary">Proposer une fiche</Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-container {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background-color: #051c0e;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.8rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.80);
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: #fff;
          background-color: rgba(255,255,255,0.08);
        }
        .nav-group-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.8rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.80);
          font-weight: 500;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-group-btn.active, .nav-group-btn:hover {
          color: #fff;
          background-color: rgba(255,255,255,0.08);
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          border: 1px solid #e7e5e4;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          min-width: 240px;
          z-index: 100;
        }
        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.7rem 0.8rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f0fdfa;
        }
        .dropdown-icon {
          color: ${PRIMARY};
          margin-top: 2px;
          flex-shrink: 0;
        }
        .dropdown-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1c1917;
        }
        .dropdown-desc {
          font-size: 0.72rem;
          color: #78716c;
          margin-top: 1px;
          line-height: 1.3;
        }
        .login-link {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .login-link:hover {
          background-color: rgba(255,255,255,0.08);
        }
        .join-btn {
          font-size: 0.875rem;
          text-decoration: none;
          padding: 0.6rem 1.25rem;
          background-color: #fff;
          color: #051c0e;
          border-radius: 8px;
          font-weight: 700;
          box-shadow: 0 0 12px rgba(255,255,255,0.15);
        }
        .nav-mobile-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
        }
        .mobile-drawer-overlay {
          position: fixed;
          top: 4.5rem;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.4);
          z-index: 40;
        }
        .mobile-drawer {
          background-color: #ffffff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-height: calc(100vh - 4.5rem);
          overflow-y: auto;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #1c1917;
          text-decoration: none;
        }
        .mobile-group-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #a8a29e;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .mobile-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #44403c;
          border-radius: 8px;
          text-decoration: none;
        }
        .mobile-footer {
          border-top: 1px solid #f5f5f4;
          padding-top: 1.25rem;
          display: flex;
          gap: 0.75rem;
        }
        .mobile-btn-outline {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e7e5e4;
          border-radius: 8px;
          color: #1c1917;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
        }
        .mobile-btn-primary {
          flex: 1;
          padding: 0.75rem;
          background-color: ${PRIMARY};
          border-radius: 8px;
          color: white;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
        }
        .nav-desktop { display: flex !important; }
        .nav-mobile-btn { display: none !important; }
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
