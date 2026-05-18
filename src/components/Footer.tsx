'use client';

import Link from 'next/link';
import {
 BookOpen, Calendar, HeartHandshake, Library,
 Briefcase, Brain, Waves, Plane,
 ShieldCheck, Megaphone, Lightbulb, Mail,
 type LucideIcon,
} from 'lucide-react';

type FooterLink = { href: string; label: string; icon?: LucideIcon };
type FooterSection = { title: string; links: FooterLink[] };

const SECTIONS: FooterSection[] = [
 {
 title: 'Ressources',
 links: [
 { href: '/education', label: 'Apprentissage & Cours', icon: BookOpen },
 { href: '/events', label: 'Événements', icon: Calendar },
 { href: '/solidarity', label: 'Solidarité & Cagnottes', icon: HeartHandshake },
 { href: '/librairies', label: 'Librairies islamiques', icon: Library },
 ],
 },
 {
 title: 'Services',
 links: [
 { href: '/jobs', label: 'Emploi — Voile & Prière OK', icon: Briefcase },
 { href: '/sante', label: 'Santé — Psy, Hijama, Roqya', icon: Brain },
 { href: '/piscines', label: 'Piscines Burkini', icon: Waves },
 { href: '/hajj', label: 'Hajj & Omra', icon: Plane },
 ],
 },
 {
 title: 'Communauté',
 links: [
 { href: '/justice', label: 'Justice & Droits', icon: ShieldCheck },
 { href: '/annonceurs', label: 'Annonceurs', icon: Megaphone },
 { href: '/contact?type=initiative', label: 'Proposer une initiative', icon: Lightbulb },
 { href: '/contact?type=general', label: 'Newsletter', icon: Mail },
 ],
 },
 {
 title: 'Légal',
 links: [
 { href: '/legal#confidentialite', label: 'Confidentialité & RGPD' },
 { href: '/legal#cgu', label: "Conditions d'utilisation" },
 { href: '/contact', label: 'Nous contacter' },
 { href: '/legal#mentions', label: 'Mentions légales' },
 ],
 },
];

const GREEN = '#c9973a';

export default function Footer() {
 const year = new Date().getFullYear();
 return (
 <footer style={{ borderTop: 'none', backgroundColor: '#0a0a0a', color: 'white' }}>
 <div className="container" style={{ padding: '3rem 1rem 2rem' }}>

 {/* Grid liens */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
 {SECTIONS.map(section => (
 <div key={section.title}>
 <h4 style={{
 fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase',
 letterSpacing: '0.1em', color: '#555', marginBottom: '1rem',
 }}>
 {section.title}
 </h4>
 <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
 {section.links.map(link => {
 const Icon = link.icon;
 return (
 <li key={link.href + link.label}>
 <Link
 href={link.href}
 style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
 fontSize: '0.84rem', color: '#888', textDecoration: 'none',
 lineHeight: 1.4, transition: 'color 0.15s',
 }}
 onMouseOver={e => (e.currentTarget.style.color = GREEN)}
 onMouseOut={e => (e.currentTarget.style.color = '#888')}
 >
 {Icon && <Icon size={13} color={GREEN} strokeWidth={1.8} style={{ flexShrink: 0 }} />}
 {link.label}
 </Link>
 </li>
 );
 })}
 </ul>
 </div>
 ))}
 </div>

 {/* Divider */}
 <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
 <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Al-Wasil</span>
 <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em', marginTop: '2px' }}>الواصل</span>
 </div>
 <p style={{ fontSize: '0.75rem', color: '#555', margin: 0 }}>La plateforme de la communauté musulmane française</p>
 </div>
 <p style={{ fontSize: '0.75rem', color: '#444' }}>© {year} Al-Wasil. Tous droits réservés.</p>
 </div>

 {/* Espace pub */}
 <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
 <Link href="/annonceurs" style={{ fontSize: '0.78rem', color: '#555', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
 <Megaphone size={12} color={GREEN} strokeWidth={1.8} />
 Emplacement publicitaire disponible —
 <strong style={{ color: GREEN }}>Annoncez sur Al-Wasil →</strong>
 </Link>
 </div>
 </div>
 </footer>
 );
}
