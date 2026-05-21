'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { V } from '@/lib/tokens';

const EVENT_IMAGES: Record<string, string> = {
  conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  maraude:    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
  cours:      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  iftar:      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  webinaire:  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80',
  collecte:   'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80',
  autre:      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
};

type Props = {
  title: string;
  date: string;
  location: string;
  organizer: string;
  tag: string;
  color: string;
};

export default function EventCard({ title, date, location, organizer, tag, color }: Props) {
  const [hov, setHov] = useState(false);
  const catKey = tag.toLowerCase().replace(/[éè]/g, 'e');
  const img = EVENT_IMAGES[catKey] ?? EVENT_IMAGES.autre;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#fff',
        border: `1px solid ${hov ? color : V.border}`,
        borderRadius: '14px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: hov ? '0 8px 28px rgba(201,151,58,0.18)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        <img
          src={img}
          alt={tag}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hov ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
        }} />
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em',
          textTransform: 'uppercase', color: '#fff',
          backgroundColor: color, padding: '2px 8px', borderRadius: '4px',
        }}>
          {tag}
        </span>
        <span style={{
          position: 'absolute', bottom: '0.75rem', right: '0.75rem',
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500,
        }}>
          {date}
        </span>
      </div>

      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35,
          color: V.dark, margin: '0 0 0.5rem',
        }}>
          {title}
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          fontSize: '0.75rem', color: V.muted, marginBottom: '0.25rem',
        }}>
          <MapPin size={11} /> {location}
        </div>
        <p style={{ fontSize: '0.75rem', color: V.muted, margin: 0 }}>
          Par <strong style={{ color: V.text, fontWeight: 600 }}>{organizer}</strong>
        </p>
      </div>
    </div>
  );
}
