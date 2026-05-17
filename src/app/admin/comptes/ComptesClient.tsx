'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Check, X, Shield, User, Trash2 } from 'lucide-react';

const VIOLET = '#7c3aed';

const ALL_PERMS = ['all', 'piscine', 'events', 'mosquees', 'emploi', 'instituts', 'cagnottes', 'librairies', 'psy', 'hijama', 'roqya', 'hajj'];
const PERM_LABELS: Record<string, string> = {
  all: 'Tout', piscine: 'Piscines', events: 'Événements', mosquees: 'Mosquées',
  emploi: 'Emploi', instituts: 'Instituts', cagnottes: 'Cagnottes', librairies: 'Librairies',
  psy: 'Psychologie', hijama: 'Hijama', roqya: 'Roqya', hajj: 'Hajj/Omra',
};

type Compte = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'modo';
  permissions: string[];
  actif: boolean;
  createdAt?: string;
};

export default function ComptesClient() {
  const [comptes, setComptes]   = useState<Compte[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    email: '', password: '', name: '', role: 'modo' as 'modo' | 'admin', permissions: ['all'] as string[],
  });

  useEffect(() => { loadComptes(); }, []);

  async function loadComptes() {
    const res = await fetch('/api/admin/comptes');
    if (res.ok) { const d = await res.json(); setComptes(d.comptes || []); }
    setLoading(false);
  }

  async function createCompte() {
    setSaving(true);
    await fetch('/api/admin/comptes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    await loadComptes();
    setShowForm(false);
    setForm({ email: '', password: '', name: '', role: 'modo', permissions: ['all'] });
    setSaving(false);
  }

  async function toggleActif(id: string, actif: boolean) {
    await fetch('/api/admin/comptes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, actif }),
    });
    setComptes(prev => prev.map(c => c.id === id ? { ...c, actif } : c));
  }

  function togglePerm(perm: string) {
    if (perm === 'all') {
      setForm(f => ({ ...f, permissions: ['all'] }));
      return;
    }
    setForm(f => {
      const p = f.permissions.filter(x => x !== 'all');
      return { ...f, permissions: p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm] };
    });
  }

  return (
    <div style={{ padding: '2.5rem 1rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Titre + bouton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f0225', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Gestion des comptes</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Créer et gérer les comptes modérateurs</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
          <UserPlus size={16} strokeWidth={2} /> Nouveau compte
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #ede9fe', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(124,58,237,0.1)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f0225', margin: '0 0 1.25rem', fontFamily: 'Poppins, sans-serif' }}>Créer un compte modérateur</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[['Prénom / Nom', 'name', 'text', 'Prénom Nom'], ['Email', 'email', 'email', 'prenom@gmail.com'], ['Mot de passe temporaire', 'password', 'text', 'motdepasse123']].map(([label, field, type, placeholder]) => (
              <div key={field} style={{ gridColumn: field === 'name' ? '1 / -1' : 'auto' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  value={form[field as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem 0.875rem', border: '2px solid #ede9fe', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
              </div>
            ))}
          </div>

          {/* Rôle */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['modo', 'admin'] as const).map(role => (
                <button key={role} onClick={() => setForm(f => ({ ...f, role }))} type="button"
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `2px solid ${form.role === role ? VIOLET : '#ede9fe'}`, backgroundColor: form.role === role ? VIOLET : 'white', color: form.role === role ? 'white' : '#374151', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {role === 'admin' ? <Shield size={13} strokeWidth={2} /> : <User size={13} strokeWidth={2} />}
                  {role === 'admin' ? 'Administrateur' : 'Modérateur'}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégories autorisées</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ALL_PERMS.map(perm => {
                const active = form.permissions.includes(perm);
                return (
                  <button key={perm} onClick={() => togglePerm(perm)} type="button"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', border: `2px solid ${active ? VIOLET : '#e5e7eb'}`, backgroundColor: active ? VIOLET : 'white', color: active ? 'white' : '#6b7280', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                    {PERM_LABELS[perm] || perm}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={createCompte} disabled={saving || !form.email || !form.password || !form.name}
              style={{ padding: '0.7rem 1.5rem', backgroundColor: VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Création...' : 'Créer le compte'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '0.7rem 1.25rem', backgroundColor: '#f5f3ff', color: '#6b7280', border: '1px solid #ede9fe', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des comptes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Chargement...</div>
      ) : comptes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <p>Aucun compte modérateur créé.</p>
          <p style={{ fontSize: '0.8rem' }}>Ajoute d&apos;abord un compte dans le .env.local (MODO_ACCOUNTS) ou crée-en un ci-dessus.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comptes.map(compte => (
            <div key={compte.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `1px solid ${compte.actif ? '#ede9fe' : '#f3f4f6'}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: compte.actif ? 1 : 0.6 }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: compte.role === 'admin' ? VIOLET : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {compte.role === 'admin' ? <Shield size={20} color="white" strokeWidth={1.8} /> : <User size={20} color={VIOLET} strokeWidth={1.8} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif' }}>{compte.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{compte.email}</div>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', backgroundColor: compte.role === 'admin' ? '#ede9fe' : '#f0fdf4', color: compte.role === 'admin' ? VIOLET : '#065f46' }}>
                    {compte.role === 'admin' ? 'Admin' : 'Modo'}
                  </span>
                  {compte.permissions.map(p => (
                    <span key={p} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#f9fafb', color: '#6b7280' }}>
                      {PERM_LABELS[p] || p}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => toggleActif(compte.id, !compte.actif)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.875rem', backgroundColor: compte.actif ? '#fee2e2' : '#d1fae5', color: compte.actif ? '#991b1b' : '#065f46', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                  {compte.actif ? <><Trash2 size={12} /> Désactiver</> : <><Check size={12} /> Réactiver</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note env var */}
      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400e', lineHeight: 1.6 }}>
          <strong>Compte test :</strong> ajoute dans ton <code>.env.local</code> :<br />
          <code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', display: 'block', marginTop: '0.5rem', wordBreak: 'break-all' }}>
            {`MODO_ACCOUNTS=[{"id":"modo-1","email":"test@gmail.com","password":"test","name":"Modo Test","role":"modo","permissions":["all"],"actif":true}]`}
          </code>
        </p>
      </div>
    </div>
  );
}
