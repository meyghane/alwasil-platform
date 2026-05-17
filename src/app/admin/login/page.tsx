'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(data.role === 'admin' ? '/admin' : '/modo');
    } else {
      const data = await res.json();
      setError(data.error || 'Identifiants incorrects');
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #1a0533 inset !important;
          -webkit-text-fill-color: #e9d5ff !important;
          border-color: rgba(196,181,253,0.4) !important;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #3b0764 0%, #1e0545 50%, #0a0118 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Poppins, sans-serif',
      }}>

        {/* Halo décoratif */}
        <div style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          backgroundColor: 'rgba(15,2,37,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid rgba(196,181,253,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(196,181,253,0.1)',
          position: 'relative',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60,
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              borderRadius: '16px',
              color: 'white', fontWeight: 900, fontSize: '1.5rem',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
            }}>W</div>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
              Al-Wasil
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(196,181,253,0.5)', marginTop: '3px' }}>
              Connexion équipe
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.72rem', fontWeight: 700,
                color: 'rgba(196,181,253,0.7)', marginBottom: '0.45rem',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(196,181,253,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: '0.95rem', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '0.72rem', fontWeight: 700,
                color: 'rgba(196,181,253,0.7)', marginBottom: '0.45rem',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(196,181,253,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: '0.95rem', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                fontSize: '0.85rem', color: '#fca5a5',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.9rem',
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(124,58,237,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(196,181,253,0.3)' }}>
                Admin ou modérateur — même page
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
