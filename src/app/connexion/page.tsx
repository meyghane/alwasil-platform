'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Star, CheckCircle, MessageSquare, MapPin, Bell, Heart } from 'lucide-react';

const TEAL = '#0d9488';

const PERKS = [
  { icon: <Star size={15} />, label: 'Laisser un avis vérifié sur un praticien, librairie, agence Hajj' },
  { icon: <MessageSquare size={15} />, label: 'Contacter un hôte Where Salat et réserver une place de prière' },
  { icon: <Bell size={15} />, label: 'Notifications push : prière suivante près de toi' },
  { icon: <MapPin size={15} />, label: 'Proposer ton propre espace de prière (Where Salat)' },
  { icon: <Heart size={15} />, label: 'Sauvegarder tes ressources favorites sur toutes les sections' },
];

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError('Saisis un email valide');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'waitlist',
          fields: {
            Email: email,
            Source: 'page-connexion',
            Date: new Date().toISOString().split('T')[0],
          },
        }),
      });
    } catch {
      // Soumettre côté UX même si erreur réseau
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '480px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: TEAL, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '24px', margin: '0 auto 1rem' }}>
          W
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Al-Wasil bêta
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
          Inscris-toi pour être parmi les premiers à accéder aux fonctionnalités communautaires — avis, Where Salat, favoris.
        </p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 2rem', borderRadius: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={42} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem', color: '#065f46' }}>Tu es sur la liste ! 🎉</h3>
          <p style={{ color: '#047857', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            On te préviendra par email dès l&apos;ouverture des comptes.<br />
            Barak Allahou fikoum !
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '0.65rem 1.5rem', backgroundColor: TEAL, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
            Explorer Al-Wasil →
          </Link>
        </div>
      ) : (
        <>
          {/* Ce que tu pourras faire */}
          <div style={{ backgroundColor: '#f0fdfa', borderRadius: '1rem', border: '1px solid #99f6e4', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
              Ce que tu débloques avec un compte
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {PERKS.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: '#1c1917' }}>
                  <span style={{ color: TEAL, flexShrink: 0 }}>{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.625rem', border: `1.5px solid ${error ? '#fca5a5' : 'var(--border-color)'}`, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.78rem', color: '#dc2626', margin: '-0.25rem 0 0' }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ backgroundColor: TEAL, color: 'white', border: 'none', padding: '0.9rem', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Inscription en cours…' : 'Rejoindre la liste d\'attente →'}
            </button>

            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
              Aucun spam. Email uniquement utilisé pour l&apos;ouverture des comptes.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
