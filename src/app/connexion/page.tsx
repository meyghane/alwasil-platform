'use client';

import { useState } from 'react';
import { Mail, Star, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react';

const PERKS = [
  { icon: <Star size={15} />, label: 'Noter un praticien psy, hijama ou roqya' },
  { icon: <ThumbsUp size={15} />, label: 'Évaluer une agence Hajj ou une librairie' },
  { icon: <MessageSquare size={15} />, label: 'Laisser un avis vérifié sur une ressource' },
];

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '460px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: '#0d9488', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '24px', margin: '0 auto 1rem' }}>
          W
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Laisse ton avis sur Al-Wasil
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Les comptes arrivent bientôt. Inscris-toi pour être parmi les premiers à pouvoir noter et évaluer les ressources de la communauté.
        </p>
      </div>

      {/* Ce que tu pourras faire */}
      <div style={{ backgroundColor: '#f0fdfa', borderRadius: '0.875rem', border: '1px solid #99f6e4', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
          Ce que tu pourras faire avec un compte
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: '#1c1917' }}>
              <span style={{ color: '#0d9488', flexShrink: 0 }}>{p.icon}</span>
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem', borderRadius: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={36} color="#10b981" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Tu es sur la liste !</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            On te préviendra dès que les avis et comptes seront disponibles.<br />
            Barak Allahou fikoum !
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={() => { if (email) setSubmitted(true); }}
            style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Je veux laisser des avis →
          </button>

          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
            Aucun spam. On t&apos;écrit uniquement à l&apos;ouverture des comptes.
          </p>
        </div>
      )}
    </div>
  );
}
