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
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1.5px solid #e7e5e4',
    borderRadius: '1rem',
    padding: '1.25rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: soon ? 'default' : 'pointer',
    opacity: soon ? 0.7 : 1,
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  const inner = (
    <div
      style={cardStyle}
      onMouseOver={e => {
        if (!soon) {
          const el = e.currentTarget;
          el.style.transform = 'translateY(-3px)';
          el.style.boxShadow = `0 8px 24px ${color}22`;
          el.style.borderColor = `${color}50`;
        }
      }}
      onMouseOut={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = '';
        el.style.borderColor = '#e7e5e4';
      }}
    >
      {/* Barre couleur top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: color, borderRadius: '1rem 1rem 0 0' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
          {emoji}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1rem', color: `${color}80`, fontWeight: 600, fontFamily: 'serif' }}>{arabic}</span>
          {soon && (
            <div style={{ backgroundColor: '#f5f5f4', color: '#78716c', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, marginTop: '0.25rem' }}>
              BIENTÔT
            </div>
          )}
        </div>
      </div>

      {/* Texte */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.35rem', lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontSize: '0.82rem', color: '#78716c', lineHeight: 1.55 }}>{description}</p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <span key={tag} style={{ backgroundColor: bg, color, border: `1px solid ${color}25`, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      {!soon && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color, fontSize: '0.82rem', fontWeight: 700 }}>
          Explorer <ArrowRight size={13} />
        </div>
      )}
    </div>
  );

  if (soon) return <div style={{ height: '100%' }}>{inner}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
}
