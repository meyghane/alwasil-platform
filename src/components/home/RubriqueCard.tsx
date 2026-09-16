'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
  priority?: boolean;
};

export default function RubriqueCard({ href, iconNode, title, arabic, description, tags, soon, image, priority }: Props) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <div
      onMouseEnter={() => !soon && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: priority ? '430px' : '260px',
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
        padding: priority ? '1.75rem' : '1.25rem',
      }}>
        <div style={{
          width: priority ? 54 : 44, height: priority ? 54 : 44, borderRadius: '50%',
          border: '1.5px solid #9474d7',
          backgroundColor: '#7652CA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: priority ? '1rem' : '0.7rem',
          backdropFilter: 'blur(4px)',
        }}>
          {iconNode}
        </div>

        <h3 style={{
          color: '#fff', fontWeight: 750, fontSize: priority ? 'clamp(2rem, 3vw, 3.5rem)' : '1.25rem',
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
          color: '#ECFF58', fontSize: '0.65rem',
          fontFamily: 'serif', display: 'block', marginBottom: '0.5rem',
        }}>
          {arabic}
        </span>

        <p style={{
          color: '#fff', fontSize: priority ? '0.9rem' : '0.78rem',
          lineHeight: 1.5, margin: '0 0 0.85rem', maxWidth: '390px',
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: '0.62rem', fontWeight: 600,
              backgroundColor: '#080808',
              color: '#ECFF58',
              border: '1px solid #ECFF58',
              padding: '3px 9px', borderRadius: '999px',
            }}>
              {tag}
            </span>
          ))}
        </div>
        <span style={{ position: 'absolute', right: priority ? 24 : 18, top: priority ? 24 : 18, width: priority ? 50 : 42, height: priority ? 50 : 42, borderRadius: '50%', background: '#fff', color: '#080808', display: 'grid', placeItems: 'center' }}><ArrowUpRight size={priority ? 24 : 20} /></span>
      </div>
    </div>
  );

  if (soon) return <div style={{ display: 'block' }}>{card}</div>;
  return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{card}</Link>;
}
