'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';

const VIOLET = '#c9973a';

async function sha256(str: string): Promise<string> {
 const data = new TextEncoder().encode(str);
 const hash = await crypto.subtle.digest('SHA-256', data);
 return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

type InviteData = { email: string; name: string; role: string; permissions: string[] };

function InvitationForm() {
 const params = useSearchParams();
 const router = useRouter();
 const token = params.get('token') || '';

 const [invite, setInvite] = useState<InviteData | null>(null);
 const [error, setError] = useState('');
 const [name, setName] = useState('');
 const [pwd, setPwd] = useState('');
 const [confirm, setConfirm] = useState('');
 const [showPwd, setShowPwd] = useState(false);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [done, setDone] = useState(false);

 useEffect(() => {
 if (!token) { setError('Lien invalide.'); setLoading(false); return; }
 fetch(`/api/admin/inviter?token=${encodeURIComponent(token)}`)
 .then(r => r.json())
 .then(d => {
 if (d.ok) { setInvite(d); setName(d.name || ''); }
 else setError(d.error || 'Lien invalide ou expiré');
 })
 .catch(() => setError('Erreur réseau'))
 .finally(() => setLoading(false));
 }, [token]);

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (pwd !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
 if (pwd.length < 6) { setError('Minimum 6 caractères.'); return; }
 setSaving(true); setError('');

 const hashedPwd = await sha256(pwd);
 const id = `modo-${Date.now()}`;

 const res = await fetch('/api/admin/comptes', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 email: invite!.email, password: hashedPwd, name: name || invite!.name,
 role: invite!.role, permissions: invite!.permissions, id,
 _inviteToken: token,
 }),
 });

 if (res.ok) { setDone(true); setTimeout(() => router.push('/modo/login'), 3000); }
 else { const d = await res.json(); setError(d.error || 'Erreur'); }
 setSaving(false);
 }

 if (loading) return <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '3rem', fontFamily: 'Poppins, sans-serif' }}>Vérification du lien...</div>;

 if (done) return (
 <div style={{ textAlign: 'center', padding: '2rem' }}>
 <CheckCircle size={52} color="#4ade80" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 1rem' }} />
 <h2 style={{ color: 'white', fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>Compte créé !</h2>
 <p style={{ color: 'rgba(196,181,253,0.7)', fontSize: '0.9rem' }}>Redirection vers la connexion...</p>
 </div>
 );

 return (
 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
 <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
 <div style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem', fontFamily: 'Poppins, sans-serif' }}>
 Rejoindre Al-Wasil
 </div>
 {invite && (
 <div style={{ fontSize: '0.78rem', color: 'rgba(196,181,253,0.65)', marginTop: '4px' }}>
 Compte {invite.role === 'admin' ? 'Administrateur' : 'Modérateur'} · {invite.email}
 </div>
 )}
 </div>

 {error && <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#fca5a5' }}>{error}</div>}

 {!error && invite && (
 <>
 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,181,253,0.7)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ton prénom / nom affiché</label>
 <input value={name} onChange={e => setName(e.target.value)} required placeholder="Prénom Nom"
 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>

 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,181,253,0.7)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Choisis ton mot de passe</label>
 <div style={{ position: 'relative' }}>
 <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} required minLength={6} placeholder="Minimum 6 caractères"
 style={{ width: '100%', padding: '0.8rem 2.5rem 0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(196,181,253,0.5)' }}>
 {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 </div>

 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,181,253,0.7)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confirmer</label>
 <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>

 <button type="submit" disabled={saving}
 style={{ padding: '0.9rem', background: 'linear-gradient(135deg, #c9973a, #8a6025)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', marginTop: '0.25rem', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
 {saving ? 'Création...' : 'Créer mon compte →'}
 </button>
 </>
 )}

 {error && !invite && (
 <a href="/modo/login" style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(196,181,253,0.5)', textDecoration: 'none', display: 'block' }}>
 → Retour à la connexion
 </a>
 )}
 </form>
 );
}

export default function InvitationPage() {
 return (
 <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #3b0764 0%, #1e0545 50%, #0a0118 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
 <div style={{ backgroundColor: 'rgba(15,2,37,0.85)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px', border: '1px solid rgba(196,181,253,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
 <Suspense fallback={<div style={{ color: 'white', textAlign: 'center' }}>Chargement...</div>}>
 <InvitationForm />
 </Suspense>
 </div>
 </div>
 );
}
