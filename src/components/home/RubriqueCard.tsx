'use client';

import { useState } from 'react';
import Link from 'next/link';
type Props = {
  href: string;
  iconNode: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  arabic: string;
  description: string;
  tags: string[];
  image: string;
  soon?: boolean;
};

export default function RubriqueCard({ href, iconNode, title, arabic, description, tags, soon, image }: Props) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <div
      onMouseEnter={() => !soon && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '260px',
        cursor: soon ? 'default' : 'pointer',
        opacity: soon ? 0.7 : 1,
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />

      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.18) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)',
        transition: 'background 0.4s',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '1.1rem 1.25rem',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '4px',
          border: '1.5px solid rgba(212,168,83,0.65)',
          backgroundColor: 'rgba(20,14,4,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.55rem',
          backdropFilter: 'blur(4px)',
        }}>
          {iconNode}
        </div>

        <h3 style={{
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          margin: '0 0 1px', lineHeight: 1.2,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          {title}
          {soon && (
            <span style={{
              marginLeft: '0.5rem', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)', verticalAlign: 'middle',
            }}>
              BIENTÔT
            </span>
          )}
        </h3>

        <span style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem',
          fontFamily: 'serif', display: 'block', marginBottom: '0.5rem',
        }}>
          {arabic}
        </span>

        <p style={{
          color: 'rgba(255,255,255,0.78)', fontSize: '0.73rem',
          lineHeight: 1.5, margin: '0 0 0.5rem',
          maxHeight: hovered ? '56px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: '0.62rem', fontWeight: 600,
              backgroundColor: 'rgba(20,14,4,0.28)',
              color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(212,168,83,0.35)',
              padding: '2px 8px', borderRadius: '2px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (soon) return <div style={{ display: 'block' }}>{card}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{card}</Link>;
}
