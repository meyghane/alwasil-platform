'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GOLD = '#c9973a';

export default function AdminLoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const [showPwd, setShowPwd] = useState(false);
 const router = useRouter();

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 setError('');

 const res = await fetch('/api/admin/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email: email.trim(), password }),
 });

 if (res.ok) {
 const data = await res.json();
 router.push(data.role === 'admin' ? '/admin' : '/modo');
 } else {
 setError('Identifiants incorrects. Vérifie que la majuscule est désactivée.');
 }
 setLoading(false);
 }

 return (
 <>
 <style>{`
 input:-webkit-autofill,
 input:-webkit-autofill:hover,
 input:-webkit-autofill:focus {
 -webkit-box-shadow: 0 0 0px 1000px #0f0a00 inset !important;
 -webkit-text-fill-color: #fff !important;
 border-color: rgba(201,151,58,0.4) !important;
 }
 .login-input:focus {
 border-color: ${GOLD} !important;
 box-shadow: 0 0 0 3px rgba(201,151,58,0.15) !important;
 outline: none;
 }
 `}</style>

 <div style={{
 minHeight: '100vh',
 background: 'linear-gradient(160deg, #100c04 0%, #0a0806 50%, #050404 100%)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 padding: '1rem', fontFamily: 'Poppins, sans-serif',
 position: 'relative', overflow: 'hidden',
 }}>
 {/* Halo doré */}
 <div style={{
 position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
 width: 500, height: 500, borderRadius: '50%',
 background: 'radial-gradient(circle, rgba(201,151,58,0.12) 0%, transparent 70%)',
 pointerEvents: 'none',
 }} />
 {/* Étoiles */}
 {[{x:'10%',y:'20%'},{x:'85%',y:'15%'},{x:'20%',y:'75%'},{x:'75%',y:'70%'},{x:'50%',y:'10%'},{x:'90%',y:'50%'}].map((p,i) => (
 <div key={i} style={{
 position: 'fixed', left: p.x, top: p.y,
 width: 2, height: 2, borderRadius: '50%',
 backgroundColor: GOLD, opacity: 0.4,
 animation: `particle-float ${6+i}s ease-in-out ${i*0.8}s infinite`,
 pointerEvents: 'none',
 }} />
 ))}

 <div style={{
 backgroundColor: 'rgba(10,8,6,0.9)',
 backdropFilter: 'blur(20px)',
 borderRadius: '20px',
 padding: '2.5rem',
 width: '100%', maxWidth: '400px',
 border: '1px solid rgba(201,151,58,0.2)',
 boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,151,58,0.05)',
 position: 'relative',
 }}>

 {/* Logo */}
 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
 <div style={{
 display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
 width: 60, height: 60,
 background: `linear-gradient(135deg, ${GOLD}, #a87830)`,
 borderRadius: '16px', color: '#0a0806',
 fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem',
 boxShadow: `0 8px 24px rgba(201,151,58,0.35)`,
 }}>W</div>
 <div style={{ fontWeight: 800, color: 'white', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
 Al-Wasil
 </div>
 <div style={{ fontSize: '0.75rem', color: 'rgba(201,151,58,0.5)', marginTop: '3px' }}>
 Connexion équipe
 </div>
 </div>

 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
 <div>
 <label style={{
 display: 'block', fontSize: '0.72rem', fontWeight: 700,
 color: 'rgba(201,151,58,0.7)', marginBottom: '0.45rem',
 textTransform: 'uppercase', letterSpacing: '0.08em',
 }}>Email</label>
 <input
 className="login-input"
 type="email"
 value={email}
 onChange={e => setEmail(e.target.value)}
 required autoComplete="email"
 style={{
 width: '100%', padding: '0.8rem 1rem',
 borderRadius: '10px',
 border: '1px solid rgba(201,151,58,0.2)',
 background: 'rgba(255,255,255,0.04)',
 color: 'white', fontSize: '0.95rem',
 boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
 transition: 'border-color 0.15s',
 }}
 />
 </div>

 <div>
 <label style={{
 display: 'block', fontSize: '0.72rem', fontWeight: 700,
 color: 'rgba(201,151,58,0.7)', marginBottom: '0.45rem',
 textTransform: 'uppercase', letterSpacing: '0.08em',
 }}>Mot de passe</label>
 <div style={{ position: 'relative' }}>
 <input
 className="login-input"
 type={showPwd ? 'text' : 'password'}
 value={password}
 onChange={e => setPassword(e.target.value)}
 required autoComplete="current-password"
 autoCapitalize="none" autoCorrect="off" spellCheck={false}
 style={{
 width: '100%', padding: '0.8rem 2.5rem 0.8rem 1rem',
 borderRadius: '10px',
 border: '1px solid rgba(201,151,58,0.2)',
 background: 'rgba(255,255,255,0.04)',
 color: 'white', fontSize: '0.95rem',
 boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
 }}
 />
 <button
 type="button"
 onClick={() => setShowPwd(!showPwd)}
 style={{
 position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
 background: 'none', border: 'none', cursor: 'pointer',
 color: 'rgba(201,151,58,0.5)', fontSize: '0.75rem', padding: '0',
 }}
 >
 {showPwd ? 'cacher' : 'voir'}
 </button>
 </div>
 </div>

 {error && (
 <div style={{
 padding: '0.75rem 1rem',
 backgroundColor: 'rgba(239,68,68,0.1)',
 border: '1px solid rgba(239,68,68,0.3)',
 borderRadius: '8px', fontSize: '0.85rem', color: '#fca5a5',
 }}>
 {error}
 </div>
 )}

 <button
 type="submit" disabled={loading}
 style={{
 padding: '0.9rem', marginTop: '0.5rem',
 background: loading ? `rgba(201,151,58,0.4)` : `linear-gradient(135deg, ${GOLD}, #a87830)`,
 color: loading ? 'rgba(255,255,255,0.5)' : '#0a0806',
 border: 'none', borderRadius: '12px',
 fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem',
 cursor: loading ? 'not-allowed' : 'pointer',
 boxShadow: loading ? 'none' : `0 4px 16px rgba(201,151,58,0.35)`,
 transition: 'all 0.2s',
 }}
 >
 {loading ? 'Connexion...' : 'Se connecter'}
 </button>

 <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
 <span style={{ fontSize: '0.72rem', color: 'rgba(201,151,58,0.3)' }}>
 Admin ou modérateur — même page
 </span>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}
