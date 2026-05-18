'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type SectionCardProps = {
 href: string;
 emoji: string;
 color: string;
 bg: string;
 title: string;
 arabic: string;
 description: string;
 tags: string[];
 soon?: boolean;
};

export default function SectionCard({ href, emoji, color, bg, title, arabic, description, tags, soon }: SectionCardProps) {

 const inner = (
 <div
 style={{
 backgroundColor: 'white',
 border: '2px solid #0a0a0a',
 borderRadius: '14px',
 height: '100%',
 display: 'flex',
 flexDirection: 'column',
 cursor: soon ? 'default' : 'pointer',
 opacity: soon ? 0.65 : 1,
 textDecoration: 'none',
 overflow: 'hidden',
 boxShadow: '4px 4px 0px #0a0a0a',
 transition: 'transform 0.12s, box-shadow 0.12s',
 }}
 onMouseOver={e => {
 if (!soon) {
 e.currentTarget.style.transform = 'translate(-2px, -2px)';
 e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a';
 }
 }}
 onMouseOut={e => {
 e.currentTarget.style.transform = '';
 e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a';
 }}
 >
 {/* Header coloré */}
 <div style={{
 backgroundColor: color,
 padding: '1rem 1.25rem 0.9rem',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 borderBottom: '2px solid #0a0a0a',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
 <span style={{
 fontSize: '1.6rem',
 width: '44px', height: '44px',
 backgroundColor: 'rgba(255,255,255,0.2)',
 borderRadius: '10px',
 border: '2px solid rgba(255,255,255,0.4)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0,
 }}>{emoji}</span>
 <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.05rem', color: 'white', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
 {title}
 </span>
 </div>
 <div style={{ textAlign: 'right', flexShrink: 0 }}>
 <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'serif', display: 'block' }}>{arabic}</span>
 {soon && (
 <span style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'white', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.2rem', display: 'inline-block' }}>
 Bientôt
 </span>
 )}
 </div>
 </div>

 {/* Body */}
 <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
 <p style={{ fontSize: '0.82rem', color: '#4a4a4a', lineHeight: 1.6, flex: 1 }}>{description}</p>

 {/* Tags */}
 <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
 {tags.map(tag => (
 <span key={tag} style={{
 backgroundColor: bg,
 color: color,
 border: `1.5px solid ${color}40`,
 padding: '0.18rem 0.55rem',
 borderRadius: '4px',
 fontSize: '0.68rem',
 fontWeight: 700,
 fontFamily: 'Poppins, sans-serif',
 whiteSpace: 'nowrap',
 }}>
 {tag}
 </span>
 ))}
 </div>

 {/* CTA */}
 {!soon && (
 <div style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
 color: 'white',
 backgroundColor: color,
 border: '1.5px solid #0a0a0a',
 borderRadius: '6px',
 padding: '0.35rem 0.75rem',
 fontSize: '0.78rem',
 fontWeight: 700,
 fontFamily: 'Poppins, sans-serif',
 width: 'fit-content',
 boxShadow: '2px 2px 0 #0a0a0a',
 }}>
 Explorer <ArrowRight size={12} />
 </div>
 )}
 </div>
 </div>
 );

 if (soon) return <div style={{ height: '100%' }}>{inner}</div>;
 return <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
}
