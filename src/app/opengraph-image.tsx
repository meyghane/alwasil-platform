import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Al-Wasil — La plateforme de la communauté musulmane en France';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #5e17eb 0%, #4a11c0 60%, #3a0d96 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, display: 'flex', flexWrap: 'wrap', gap: '60px', padding: '40px' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} style={{ fontSize: '48px' }}>🕌</span>
          ))}
        </div>

        {/* Logo */}
        <div style={{
          width: '80px', height: '80px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '42px', fontWeight: 900, color: 'white',
          marginBottom: '28px',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>
          W
        </div>

        {/* Title */}
        <div style={{ fontSize: '58px', fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: '16px', textAlign: 'center', lineHeight: 1.1 }}>
          Al-Wasil
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, marginBottom: '40px' }}>
          La plateforme de la communauté musulmane en France
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px' }}>
          {['Emploi voile OK', 'Piscines burkini', 'Hajj & Omra', 'Hijama · Psy', 'Where Salat', 'Librairies islamiques'].map(label => (
            <div key={label} style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '18px',
              color: 'white',
              fontWeight: 600,
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: '32px', fontSize: '18px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          alwasil-platform.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
