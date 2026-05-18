'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Lock, ArrowLeft } from 'lucide-react';

const VIOLET = '#c9973a';

function ResetForm() {
 const params = useSearchParams();
 const router = useRouter();
 const token = params.get('token') || '';

 const [step, setStep] = useState<'form' | 'done'>(token ? 'form' : 'form');
 const [email, setEmail] = useState('');
 const [newPwd, setNewPwd] = useState('');
 const [confirm, setConfirm] = useState('');
 const [loading, setLoading] = useState(false);
 const [msg, setMsg] = useState('');
 const [error, setError] = useState('');

 // Si pas de token → formulaire demande de reset
 async function handleRequest(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true); setError('');
 const res = await fetch('/api/auth/reset-password?step=request', {
 method: 'POST', headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email }),
 });
 const d = await res.json();
 setLoading(false);
 if (res.ok) { setStep('done'); setMsg(d.message); }
 else setError(d.error);
 }

 // Si token présent → formulaire nouveau mdp
 async function handleConfirm(e: React.FormEvent) {
 e.preventDefault();
 if (newPwd !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
 if (newPwd.length < 6) { setError('Minimum 6 caractères.'); return; }
 setLoading(true); setError('');
 const res = await fetch('/api/auth/reset-password?step=confirm', {
 method: 'POST', headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ token, newPassword: newPwd }),
 });
 const d = await res.json();
 setLoading(false);
 if (res.ok) { setStep('done'); setMsg(d.message); }
 else setError(d.error);
 }

 if (step === 'done') return (
 <div style={{ textAlign: 'center', padding: '2rem' }}>
 <CheckCircle size={48} color="#c9973a" strokeWidth={1.6} style={{ margin: '0 auto 1rem', display: 'block' }} />
 <h2 style={{ fontWeight: 800, color: 'white', marginBottom: '0.5rem', fontFamily: 'Poppins, sans-serif' }}>Email envoyé</h2>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: 1.6 }}>{msg}</p>
 <button onClick={() => router.push('/modo/login')}
 style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #c9973a, #8a6025)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 Retour à la connexion
 </button>
 </div>
 );

 return (
 <form onSubmit={token ? handleConfirm : handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
 <h2 style={{ fontWeight: 800, color: 'white', margin: '0 0 0.25rem', fontFamily: 'Poppins, sans-serif' }}>
 {token ? 'Nouveau mot de passe' : 'Mot de passe oublié'}
 </h2>
 <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '0.82rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
 {token ? 'Entre ton nouveau mot de passe ci-dessous.' : 'Entre ton email — tu recevras un lien pour réinitialiser ton mot de passe.'}
 </p>

 {!token && (
 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,181,253,0.7)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
 <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.com"
 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>
 )}

 {token && (
 <>
 {[['Nouveau mot de passe', newPwd, setNewPwd], ['Confirmer', confirm, setConfirm]].map(([label, val, setter]) => (
 <div key={label as string}>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,181,253,0.7)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label as string}</label>
 <input type="password" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} required minLength={6}
 style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>
 ))}
 </>
 )}

 {error && <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.84rem', color: '#fca5a5' }}>{error}</div>}

 <button type="submit" disabled={loading}
 style={{ padding: '0.875rem', background: 'linear-gradient(135deg, #c9973a, #8a6025)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', marginTop: '0.25rem', opacity: loading ? 0.7 : 1 }}>
 {loading ? 'Envoi...' : token ? 'Changer le mot de passe' : 'Envoyer le lien'}
 </button>

 <a href="/modo/login" style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(196,181,253,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
 <ArrowLeft size={12} /> Retour à la connexion
 </a>
 </form>
 );
}

export default function ResetPasswordPage() {
 return (
 <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #3b0764 0%, #1e0545 50%, #0a0118 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'Poppins, sans-serif' }}>
 <div style={{ backgroundColor: 'rgba(15,2,37,0.85)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '400px', border: '1px solid rgba(196,181,253,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
 <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, background: 'linear-gradient(135deg, #c9973a, #8a6025)', borderRadius: '14px', marginBottom: '0.75rem' }}>
 <Lock size={24} color="white" strokeWidth={1.8} />
 </div>
 </div>
 <Suspense fallback={<div style={{ color: 'white' }}>Chargement...</div>}>
 <ResetForm />
 </Suspense>
 </div>
 </div>
 );
}
