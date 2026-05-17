'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ModoLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const { role } = await res.json();
      router.push(role === 'admin' ? '/admin' : '/modo');
    } else {
      const { error } = await res.json();
      setError(error || 'Identifiants incorrects');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #3b0764 0%, #0f0225 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', borderRadius: '14px', color: 'white', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Poppins, sans-serif', marginBottom: '0.75rem' }}>W</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#0f0225' }}>Al-Wasil</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>Espace modération</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #ede9fe', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #ede9fe', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.85rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <a href="/modo/reset-password" style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit" disabled={loading}
            style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
