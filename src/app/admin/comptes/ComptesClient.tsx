'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Shield, User, Copy, Check, Mail, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';

const VIOLET = '#c9973a';

const ALL_PERMS = ['all', 'piscine', 'evenement', 'mosquee', 'emploi', 'institut', 'cagnotte', 'librairie', 'psy', 'hijama', 'roqya', 'hajj'];
const PERM_LABELS: Record<string, string> = {
 all: 'Tout', piscine: 'Piscines', evenement: 'Événements', mosquee: 'Mosquées',
 emploi: 'Emploi', institut: 'Instituts', cagnotte: 'Cagnottes', librairie: 'Librairies',
 psy: 'Psychologie', hijama: 'Hijama', roqya: 'Roqya', hajj: 'Hajj/Omra',
};

type Compte = {
 id: string; email: string; name: string;
 role: 'admin' | 'modo'; permissions: string[];
 actif: boolean; created_at?: string; created_by?: string;
};

export default function ComptesClient() {
 const [comptes, setComptes] = useState<Compte[]>([]);
 const [loading, setLoading] = useState(true);
 const [showForm, setShowForm] = useState(false);
 const [sending, setSending] = useState(false);
 const [inviteLink, setInviteLink] = useState('');
 const [copied, setCopied] = useState(false);
 const [expandedId, setExpanded] = useState<string | null>(null);

 const [form, setForm] = useState({
 email: '', name: '', role: 'modo' as 'modo' | 'admin',
 permissions: ['all'] as string[],
 });

 useEffect(() => { loadComptes(); }, []);

 async function loadComptes() {
 setLoading(true);
 try {
 const res = await fetch('/api/admin/comptes');
 if (res.ok) { const d = await res.json(); setComptes(d.comptes || []); }
 } finally { setLoading(false); }
 }

 async function sendInvitation() {
 if (!form.email) return;
 setSending(true); setInviteLink('');
 const res = await fetch('/api/admin/inviter', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(form),
 });
 const data = await res.json();
 if (data.ok) {
 setInviteLink(data.inviteUrl);
 // Recharger la liste après un délai
 setTimeout(loadComptes, 1000);
 }
 setSending(false);
 }

 async function toggleActif(id: string, actif: boolean) {
 await fetch('/api/admin/comptes', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id, actif }),
 });
 setComptes(prev => prev.map(c => c.id === id ? { ...c, actif } : c));
 }

 async function updatePerms(id: string, permissions: string[]) {
 await fetch('/api/admin/comptes', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id, permissions }),
 });
 setComptes(prev => prev.map(c => c.id === id ? { ...c, permissions } : c));
 }

 function copyLink() {
 navigator.clipboard.writeText(inviteLink);
 setCopied(true);
 setTimeout(() => setCopied(false), 2500);
 }

 function togglePerm(perm: string) {
 if (perm === 'all') { setForm(f => ({ ...f, permissions: ['all'] })); return; }
 setForm(f => {
 const p = f.permissions.filter(x => x !== 'all');
 return { ...f, permissions: p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm] };
 });
 }

 return (
 <div style={{ padding: '2.5rem 1rem', maxWidth: '900px', margin: '0 auto' }}>

 {/* Header */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
 <div>
 <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f0225', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Gérer l'équipe</h1>
 <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Inviter et gérer les droits des modérateurs</p>
 </div>
 <button onClick={() => { setShowForm(!showForm); setInviteLink(''); }}
 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 <UserPlus size={16} strokeWidth={2} /> Inviter un modo
 </button>
 </div>

 {/* Formulaire invitation */}
 {showForm && (
 <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #fdfbf0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
 <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f0225', margin: '0 0 1.25rem', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <Mail size={16} color={VIOLET} strokeWidth={2} /> Envoyer une invitation
 </h2>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
 <input type="email" placeholder="linda@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
 style={{ width: '100%', padding: '0.7rem 0.875rem', border: '2px solid #fdfbf0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>
 <div>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prénom (optionnel)</label>
 <input type="text" placeholder="Linda" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
 style={{ width: '100%', padding: '0.7rem 0.875rem', border: '2px solid #fdfbf0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }} />
 </div>
 </div>

 {/* Rôle */}
 <div style={{ marginBottom: '1rem' }}>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</label>
 <div style={{ display: 'flex', gap: '0.5rem' }}>
 {(['modo', 'admin'] as const).map(role => (
 <button key={role} type="button" onClick={() => setForm(f => ({ ...f, role }))}
 style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `2px solid ${form.role === role ? VIOLET : '#fdfbf0'}`, backgroundColor: form.role === role ? VIOLET : 'white', color: form.role === role ? 'white' : '#374151', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'Poppins, sans-serif' }}>
 {role === 'admin' ? <Shield size={13} strokeWidth={2} /> : <User size={13} strokeWidth={2} />}
 {role === 'admin' ? 'Administrateur' : 'Modérateur'}
 </button>
 ))}
 </div>
 </div>

 {/* Permissions */}
 <div style={{ marginBottom: '1.5rem' }}>
 <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégories autorisées</label>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
 {ALL_PERMS.map(perm => {
 const active = form.permissions.includes(perm);
 return (
 <button key={perm} type="button" onClick={() => togglePerm(perm)}
 style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', border: `2px solid ${active ? VIOLET : '#e5e7eb'}`, backgroundColor: active ? VIOLET : 'white', color: active ? 'white' : '#6b7280', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 {PERM_LABELS[perm]}
 </button>
 );
 })}
 </div>
 </div>

 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
 <button onClick={sendInvitation} disabled={sending || !form.email}
 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: VIOLET, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: sending || !form.email ? 0.7 : 1, fontFamily: 'Poppins, sans-serif' }}>
 <Mail size={16} strokeWidth={2} /> {sending ? 'Envoi...' : 'Envoyer l\'invitation par email'}
 </button>
 <button onClick={() => setShowForm(false)}
 style={{ padding: '0.75rem 1.25rem', backgroundColor: '#fdfbf0', color: '#6b7280', border: '1px solid #fdfbf0', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 Annuler
 </button>
 </div>

 {/* Lien d'invitation généré */}
 {inviteLink && (
 <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #f0dea0', borderRadius: '12px' }}>
 <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#8a6025', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
 Invitation envoyée ! Lien de secours si l'email n'arrive pas :
 </div>
 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
 <code style={{ flex: 1, fontSize: '0.72rem', color: '#374151', backgroundColor: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #fdfbf0', wordBreak: 'break-all', lineHeight: 1.4 }}>
 {inviteLink}
 </code>
 <button onClick={copyLink}
 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.875rem', backgroundColor: copied ? '#c9973a' : VIOLET, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Poppins, sans-serif' }}>
 {copied ? <><Check size={13} /> Copié</> : <><Copy size={13} /> Copier</>}
 </button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* Liste des modérateurs */}
 {loading ? (
 <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Chargement...</div>
 ) : comptes.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fdfbf0', color: '#9ca3af' }}>
 <UserPlus size={36} color="#f0dea0" strokeWidth={1.4} style={{ display: 'block', margin: '0 auto 1rem' }} />
 <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>Aucun modérateur encore.</p>
 <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>Clique "Inviter un modo" pour commencer.</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
 {comptes.map(compte => {
 const isExpanded = expandedId === compte.id;
 return (
 <div key={compte.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `1px solid ${compte.actif ? '#fdfbf0' : '#f3f4f6'}`, overflow: 'hidden', opacity: compte.actif ? 1 : 0.65 }}>

 {/* Ligne principale */}
 <div style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <div style={{ width: 44, height: 44, borderRadius: '12px', background: compte.role === 'admin' ? 'linear-gradient(135deg, #c9973a, #8a6025)' : 'linear-gradient(135deg, #a87830, #8a6025)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.1rem', flexShrink: 0, fontFamily: 'Poppins, sans-serif' }}>
 {(compte.name || compte.email).charAt(0).toUpperCase()}
 </div>

 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif' }}>{compte.name || '(en attente)'}</div>
 <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{compte.email}</div>
 <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', backgroundColor: compte.role === 'admin' ? '#fdfbf0' : '#fdfbf0', color: compte.role === 'admin' ? VIOLET : '#a87830' }}>
 {compte.role === 'admin' ? ' Admin' : ' Modo'}
 </span>
 {compte.actif
 ? <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#f0fdf4', color: '#c9973a' }}>Actif</span>
 : <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#dc2626' }}>Désactivé</span>}
 {compte.permissions.map(p => (
 <span key={p} style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#f9fafb', color: '#6b7280' }}>{PERM_LABELS[p] || p}</span>
 ))}
 </div>
 </div>

 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
 {/* Toggle actif */}
 <button onClick={() => toggleActif(compte.id, !compte.actif)} title={compte.actif ? 'Désactiver' : 'Réactiver'}
 style={{ background: 'none', border: 'none', cursor: 'pointer', color: compte.actif ? '#c9973a' : '#9ca3af', display: 'flex', alignItems: 'center' }}>
 {compte.actif ? <ToggleRight size={24} strokeWidth={2} /> : <ToggleLeft size={24} strokeWidth={2} />}
 </button>
 {/* Expand pour gérer les permissions */}
 <button onClick={() => setExpanded(isExpanded ? null : compte.id)}
 style={{ background: 'none', border: '1px solid #fdfbf0', borderRadius: '8px', cursor: 'pointer', padding: '0.35rem', display: 'flex', alignItems: 'center', color: VIOLET }}>
 {isExpanded ? <ChevronUp size={15} strokeWidth={2} /> : <ChevronDown size={15} strokeWidth={2} />}
 </button>
 </div>
 </div>

 {/* Panel permissions */}
 {isExpanded && (
 <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #fdfbf0' }}>
 <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.875rem 0 0.5rem' }}>
 Catégories autorisées
 </div>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
 {ALL_PERMS.map(perm => {
 const active = compte.permissions.includes(perm);
 return (
 <button key={perm} onClick={() => {
 let newPerms: string[];
 if (perm === 'all') { newPerms = ['all']; }
 else {
 const p = compte.permissions.filter(x => x !== 'all');
 newPerms = p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm];
 }
 updatePerms(compte.id, newPerms);
 }}
 style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', border: `1.5px solid ${active ? VIOLET : '#e5e7eb'}`, backgroundColor: active ? VIOLET : 'white', color: active ? 'white' : '#6b7280', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 {PERM_LABELS[perm]}
 </button>
 );
 })}
 </div>
 <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.5rem 0 0' }}>
 Les changements sont appliqués immédiatement.
 </p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 );
}
