'use client';

import React from 'react';

type PageHeaderProps = {
 title: string;
 titleAr?: string;
 description?: string;
 color?: string;
 emoji?: string;
 count?: number;
 countLabel?: string;
};

// Particules fixes avec positions variées
const PARTICLES = [
 { x: '8%', y: '20%', s: 2, d: 0, o: 0.5 },
 { x: '18%', y: '65%', s: 1, d: 2.5, o: 0.35 },
 { x: '28%', y: '40%', s: 3, d: 1.2, o: 0.45 },
 { x: '38%', y: '80%', s: 1, d: 4, o: 0.3 },
 { x: '47%', y: '25%', s: 2, d: 0.8, o: 0.55 },
 { x: '55%', y: '70%', s: 1, d: 3.2, o: 0.4 },
 { x: '63%', y: '15%', s: 2, d: 1.8, o: 0.35 },
 { x: '72%', y: '55%', s: 3, d: 0.4, o: 0.5 },
 { x: '80%', y: '35%', s: 1, d: 2.8, o: 0.45 },
 { x: '88%', y: '75%', s: 2, d: 1.5, o: 0.3 },
 { x: '93%', y: '45%', s: 1, d: 3.8, o: 0.4 },
 { x: '12%', y: '88%', s: 2, d: 2.2, o: 0.35 },
 { x: '42%', y: '52%', s: 1, d: 4.5, o: 0.25 },
 { x: '67%', y: '88%', s: 3, d: 1.0, o: 0.4 },
 { x: '95%', y: '20%', s: 1, d: 0.6, o: 0.5 },
];

export default function PageHeader({ title, titleAr, description, color = '#c9973a', count, countLabel }: PageHeaderProps) {
 return (
 <div style={{
 position: 'relative',
 overflow: 'hidden',
 background: 'linear-gradient(150deg, #100c04 0%, #0a0806 45%, #050404 100%)',
 padding: '3rem 0 2.5rem',
 minHeight: '180px',
 display: 'flex',
 alignItems: 'center',
 }}>
 {/* Halo lumineux top-left */}
 <div style={{
 position: 'absolute', top: '-20%', left: '-5%',
 width: '50%', height: '160%',
 background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.25) 0%, rgba(180,120,30,0.08) 45%, transparent 70%)',
 pointerEvents: 'none',
 }} />

 {/* Halo secondaire right */}
 <div style={{
 position: 'absolute', bottom: '-30%', right: '5%',
 width: '30%', height: '120%',
 background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.12) 0%, transparent 65%)',
 pointerEvents: 'none',
 }} />

 {/* Particules CSS animées */}
 {PARTICLES.map((p, i) => (
 <div
 key={i}
 style={{
 position: 'absolute',
 left: p.x,
 top: p.y,
 width: `${p.s}px`,
 height: `${p.s}px`,
 borderRadius: '50%',
 backgroundColor: '#d4a853',
 opacity: p.o,
 animation: `particle-float ${6 + p.d}s ease-in-out ${p.d}s infinite`,
 pointerEvents: 'none',
 }}
 />
 ))}

 {/* Contenu */}
 <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '0 1rem' }}>
 <div>
 {/* Badge catégorie */}
 <div style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
 backgroundColor: 'rgba(212,168,83,0.15)',
 border: '1px solid rgba(212,168,83,0.35)',
 color: '#d4a853',
 fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em',
 textTransform: 'uppercase', padding: '0.25rem 0.75rem',
 borderRadius: '20px', marginBottom: '0.875rem',
 backdropFilter: 'blur(6px)',
 }}>
 <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#d4a853', display: 'inline-block' }} />
 Al-Wasil
 </div>

 {/* Titre */}
 <h1 style={{
 fontFamily: 'Poppins, sans-serif', fontWeight: 900,
 fontSize: 'clamp(2rem, 5vw, 3.25rem)',
 color: 'white', letterSpacing: '-0.03em',
 lineHeight: 0.95, margin: 0,
 }}>
 {title}
 {titleAr && (
 <span style={{
 fontFamily: 'serif', fontWeight: 400,
 color: 'rgba(255,255,255,0.3)',
 fontSize: '0.52em', marginLeft: '0.75rem',
 letterSpacing: '0.02em',
 }}>
 {titleAr}
 </span>
 )}
 </h1>

 {/* Description */}
 {description && (
 <p style={{
 color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
 marginTop: '0.75rem', maxWidth: '560px', lineHeight: 1.65,
 }}>
 {description}
 </p>
 )}
 </div>

 {/* Compteur */}
 {count !== undefined && countLabel && (
 <div style={{ textAlign: 'right', flexShrink: 0 }}>
 <p style={{
 fontFamily: 'Poppins, sans-serif', fontWeight: 900,
 fontSize: '2.5rem', color: '#d4a853', lineHeight: 1, margin: 0,
 }}>
 {count}
 </p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>{countLabel}</p>
 </div>
 )}
 </div>
 </div>
 );
}
