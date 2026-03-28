'use client';

import { useState } from 'react';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function ConnexionPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '440px' }}>

      {/* Coming soon banner */}
      <div style={{ marginBottom: '2rem', padding: '0.875rem 1rem', backgroundColor: '#fffbeb', borderRadius: '0.75rem', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e', textAlign: 'center' }}>
        🚧 <strong>Authentification en cours de développement.</strong><br />
        Inscrivez-vous pour être notifié à l&apos;ouverture.
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: '#0d9488', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '24px', margin: '0 auto 1rem' }}>
          W
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {mode === 'login' ? 'Connexion à Al-Wasil' : 'Créer un compte'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}
          {' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color: '#0d9488', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>
            {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem', borderRadius: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={36} color="#10b981" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Vous êtes sur la liste !</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Nous vous enverrons un email dès que les comptes seront disponibles. Barak Allahou fikoum !
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Prénom" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="password" placeholder="Mot de passe" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={() => { if (email) setSubmitted(true); }}
            style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.25rem' }}>
            {mode === 'login' ? 'M\'inscrire sur la liste d\'attente' : 'Rejoindre la liste d\'attente'}
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
            Les comptes permettront de noter des praticiens, soumettre des ressources et accéder à des fonctionnalités exclusives.
          </p>
        </div>
      )}
    </div>
  );
}
