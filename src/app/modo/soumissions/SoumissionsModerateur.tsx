'use client';

import { useEffect, useState } from 'react';
import { UserSession, hasPermission } from '@/lib/user-auth';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowLeft, AlertTriangle } from 'lucide-react';

const VIOLET = '#c9973a';

type Soumission = {
 id: string;
 categorie: string;
 status: string;
 soumis_le: string;
 soumis_par: string;
 nom?: string;
 ville?: string;
 spam?: string;
 [key: string]: string | undefined;
};

type FilterStatus = 'à vérifier' | 'en ligne' | 'pas en ligne' | 'all';

export default function SoumissionsModerateur({ session }: { session: UserSession }) {
 const [items, setItems] = useState<Soumission[]>([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState<FilterStatus>('à vérifier');
 const [expanded, setExpanded] = useState<string | null>(null);
 const [processing, setProc] = useState<string | null>(null);

 useEffect(() => { loadSoumissions(); }, []);

 async function loadSoumissions() {
 setLoading(true);
 try {
 const res = await fetch('/api/admin/soumissions');
 if (res.ok) {
 const data = await res.json();
 setItems(data.soumissions || []);
 }
 } finally {
 setLoading(false);
 }
 }

 async function updateStatus(id: string, status: string) {
 setProc(id);
 await fetch('/api/admin/soumissions', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id, status }),
 });
 setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
 setProc(null);
 }

 // Filtrer selon les permissions du modo
 const accessible = items.filter(i => hasPermission(session, i.categorie));
 const filtered = filter === 'all' ? accessible : accessible.filter(i => i.status === filter);

 const counts = {
 'à vérifier': accessible.filter(i => i.status === 'à vérifier').length,
 'en ligne': accessible.filter(i => i.status === 'en ligne').length,
 'pas en ligne': accessible.filter(i => i.status === 'pas en ligne').length,
 all: accessible.length,
 };

 return (
 <div style={{ minHeight: '100vh', background: '#fdfbf0' }}>

 {/* Header */}
 <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', padding: '1rem' }}>
 <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <a href="/modo" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
 <ArrowLeft size={14} /> Accueil
 </a>
 <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
 <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
 Soumissions
 </span>
 </div>
 </div>

 <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>

 {/* Filtres */}
 <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
 {([['à vérifier', 'À vérifier', '#fef3c7', '#92400e'], ['en ligne', 'En ligne', '#fdfbf0', '#8a6025'], ['pas en ligne', 'Rejetées', '#fee2e2', '#991b1b'], ['all', 'Toutes', '#fdfbf0', '#8a6025']] as const).map(([val, label, bg, color]) => (
 <button key={val} onClick={() => setFilter(val)}
 style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `2px solid ${filter === val ? VIOLET : 'transparent'}`, backgroundColor: filter === val ? VIOLET : bg, color: filter === val ? 'white' : color, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 {label} ({counts[val]})
 </button>
 ))}
 </div>

 {loading ? (
 <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Chargement...</div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
 <p style={{ fontSize: '0.9rem' }}>Aucune soumission dans cette catégorie.</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
 {filtered.map(item => {
 const isSpam = item.spam === 'OUI' || item.spam === 'true';
 const isOpen = expanded === item.id;
 const busy = processing === item.id;

 return (
 <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${isSpam ? '#fca5a5' : '#fdfbf0'}`, boxShadow: isSpam ? '0 2px 8px rgba(239,68,68,0.12)' : '0 2px 8px rgba(109,40,217,0.06)', overflow: 'hidden' }}>

 {/* Entête de la card */}
 <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
 {isSpam && <AlertTriangle size={16} color="#ef4444" strokeWidth={2} style={{ flexShrink: 0 }} />}

 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
 <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif' }}>
 {item.nom || item.name || item.titre || '(sans titre)'}
 </span>
 {item.ville && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>— {item.ville}</span>}
 <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fdfbf0', color: VIOLET }}>{item.categorie}</span>
 {isSpam && <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b' }}>SPAM</span>}
 </div>
 <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>
 {item.soumis_par} · {item.soumis_le}
 <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: item.status === 'à vérifier' ? '#92400e' : item.status === 'en ligne' ? '#8a6025' : '#991b1b' }}>
 · {item.status}
 </span>
 </div>
 </div>

 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
 {item.status !== 'en ligne' && (
 <button onClick={() => updateStatus(item.id, 'en ligne')} disabled={busy}
 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.875rem', backgroundColor: '#fdfbf0', color: '#8a6025', border: '1px solid #6ee7b7', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 <CheckCircle size={13} strokeWidth={2.5} /> Valider
 </button>
 )}
 {item.status !== 'pas en ligne' && (
 <button onClick={() => updateStatus(item.id, 'pas en ligne')} disabled={busy}
 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.875rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 <XCircle size={13} strokeWidth={2.5} /> Rejeter
 </button>
 )}
 <button onClick={() => setExpanded(isOpen ? null : item.id)}
 style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #fdfbf0', backgroundColor: 'white', cursor: 'pointer' }}>
 {isOpen ? <ChevronUp size={14} color="#c9973a" /> : <ChevronDown size={14} color="#c9973a" />}
 </button>
 </div>
 </div>

 {/* Détails */}
 {isOpen && (
 <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #fdfbf0' }}>
 <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
 <tbody>
 {Object.entries(item)
 .filter(([k]) => !['id', 'status', 'soumis_par', 'soumis_le'].includes(k))
 .map(([k, v]) => (
 <tr key={k} style={{ borderBottom: '1px solid #f9fafb' }}>
 <td style={{ padding: '5px 10px 5px 0', fontWeight: 600, color: '#6b7280', width: 140 }}>{k}</td>
 <td style={{ padding: '5px 0', color: '#1c1917' }}>{v || '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
}
