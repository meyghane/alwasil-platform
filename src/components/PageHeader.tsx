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

export default function PageHeader({ title, titleAr, description, color = '#5e17eb', emoji, count, countLabel }: PageHeaderProps) {
  return (
    <div>
      {/* Barre couleur top */}
      <div style={{ height: '5px', backgroundColor: color }} />

      {/* Header dark */}
      <div style={{ backgroundColor: '#0a0a0a', borderBottom: '2px solid #0a0a0a' }}>
        <div className="container" style={{ padding: '2rem 1rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: color, color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.7rem', borderRadius: '4px', marginBottom: '0.875rem', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              {emoji && <span>{emoji}</span>}
              al wasil
            </div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
              {title}
              {titleAr && <span style={{ fontFamily: 'serif', fontWeight: 400, color: 'rgba(255,255,255,0.3)', fontSize: '0.55em', marginLeft: '0.75rem', letterSpacing: '0.02em' }}>{titleAr}</span>}
            </h1>
            {description && (
              <p style={{ color: '#9a9a9a', fontSize: '0.9rem', marginTop: '0.75rem', maxWidth: '560px', lineHeight: 1.6, margin: '0.75rem 0 0' }}>{description}</p>
            )}
          </div>
          {count !== undefined && countLabel && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '2.5rem', color: 'white', lineHeight: 1, margin: 0 }}>{count}</p>
              <p style={{ color: '#6a6a6a', fontSize: '0.78rem', margin: 0 }}>{countLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
