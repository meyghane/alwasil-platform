"use client";

import Link from 'next/link';
import { BookOpen, Calendar, HandHeart, Briefcase, ShieldCheck, User } from 'lucide-react';

const Navigation = () => {
  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border-color)', 
      backgroundColor: 'rgba(255,255,255,0.8)', 
      backdropFilter: 'blur(10px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            backgroundColor: 'var(--primary-color)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white' 
          }}>
            <span style={{ fontSize: '20px' }}>W</span>
          </div>
          <span className="hidden-mobile">Al-Wasil</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <NavLink href="/education" icon={<BookOpen size={18} />} label="Éducation" />
          <NavLink href="/events" icon={<Calendar size={18} />} label="Événements" />
          <NavLink href="/solidarity" icon={<HandHeart size={18} />} label="Solidarité" />
          <NavLink href="/jobs" icon={<Briefcase size={18} />} label="Emploi" />
          <NavLink href="/justice" icon={<ShieldCheck size={18} />} label="Justice" />
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
            <span className="hidden-mobile">Connexion</span>
            <span style={{ display: 'block', padding: '2px' }} className="mobile-only"><User size={20}/></span> 
          </button>
          <button className="btn btn-primary hidden-mobile" style={{ fontSize: '0.875rem' }}>S'inscrire</button>
        </div>
      </div>
      <style>{`
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>
    </nav>
  );
};

const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link href={href} style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem', 
    fontSize: '0.9rem', 
    color: 'var(--text-secondary)',
    fontWeight: 500,
    transition: 'color 0.2s' 
  }}
  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
  >
    {icon} {label}
  </Link>
);

export default Navigation;
