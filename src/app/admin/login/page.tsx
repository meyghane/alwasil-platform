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
      router.push('/admin');
    } else {
      const { error } = await res.json();
      setError(error || 'Erreur de connexion');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px', border: '2px solid #0a0a0a', boxShadow: '6px 6px 0 #5e17eb' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: '#5e17eb', borderRadius: '12px', color: 'white', fontWeight: 900, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif', marginBottom: '0.75rem' }}>W</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#0a0a0a' }}>Al-Wasil Admin</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>Espace administration</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', backgroundColor: '#5e17eb', color: 'white', border: '2px solid #0a0a0a', borderRadius: '8px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '3px 3px 0 #0a0a0a', marginTop: '0.5rem' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
