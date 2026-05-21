'use client';

import { useState } from 'react';
import { V } from '@/lib/tokens';

type Props = {
  quote: string;
  name: string;
  role: string;
  tag: string;
  initial: string;
};

export default function TestimonialCard({ quote, name, role, tag, initial }: Props) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: hov ? 'rgba(201,151,58,0.08)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '1.75rem',
        border: `1px solid ${hov ? 'rgba(201,151,58,0.4)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        boxShadow: hov
          ? '0 0 32px rgba(201,151,58,0.15), 0 8px 32px rgba(0,0,0,0.4)'
          : '0 2px 16px rgba(0,0,0,0.2)',
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
      }}
    >
      <div style={{
        fontSize: '3rem', lineHeight: 0.6,
        color: hov ? V.primary : 'rgba(201,151,58,0.25)',
        fontFamily: 'Georgia, serif',
        marginBottom: '0.25rem',
        transition: 'color 0.3s',
      }}>
        &ldquo;
      </div>

      <p style={{
        fontSize: '0.9rem',
        color: hov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
        lineHeight: 1.75, fontStyle: 'italic', flex: 1, margin: 0,
        transition: 'color 0.3s',
      }}>
        {quote}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `linear-gradient(135deg, ${V.primary}, #a87830)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#0a0806', fontSize: '0.85rem', flexShrink: 0,
        }}>
          {initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{name}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{role}</div>
        </div>

        <span style={{
          fontSize: '0.62rem', fontWeight: 700,
          padding: '3px 9px', borderRadius: '20px',
          backgroundColor: 'rgba(201,151,58,0.15)',
          color: V.primary,
          border: '1px solid rgba(201,151,58,0.3)',
          whiteSpace: 'nowrap',
        }}>
          {tag}
        </span>
      </div>
    </div>
  );
}
