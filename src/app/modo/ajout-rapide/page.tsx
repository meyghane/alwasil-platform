'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Send, CheckCircle, AlertTriangle, ExternalLink, RotateCcw } from 'lucide-react';

const VIOLET = '#c9973a';
const DARK = '#0f0225';

type FicheGeneree = {
 categorie?: string;
 titre?: string;
 adresse?: string;
 ville?: string;
 departement?: string;
 description?: string;
 tags?: string;
 tarif?: string;
 horaires?: string;
 contact?: string;
 site_web?: string;
 burkini?: string;
 is_spam?: boolean;
 confidence?: number;
 note_djamil?: string;
 [key: string]: string | boolean | number | undefined;
};

const CAT_LABELS: Record<string, string> = {
 piscine: 'Piscine', evenement: 'Événement', mosquee: 'Mosquée',
 emploi: 'Emploi', institut: 'Institut', librairie: 'Librairie',
 cagnotte: 'Cagnotte', psy: 'Psychologie', hijama: 'Hijama', roqya: 'Roqya', hajj: 'Hajj/Omra',
};

export default function AjoutRapidePage() {
 const [texte, setTexte] = useState('');
 const [url, setUrl] = useState('');
 const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
 const [fiche, setFiche] = useState<FicheGeneree | null>(null);
 const [errorMsg, setErrorMsg] = useState('');
 const router = useRouter();

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 setStatus('loading');
 setFiche(null);

 try {
 const res = await fetch('/api/ajout-rapide', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ texte, url }),
 });
 const data = await res.json();
 if (res.ok) {
 setFiche(data.fiche);
 setStatus('done');
 } else {
 setErrorMsg(data.error || 'Erreur');
 setStatus('error');
 }
 } catch {
 setErrorMsg('Erreur réseau');
 setStatus('error');
 }
 }

 const conf = fiche?.confidence ? Math.round(Number(fiche.confidence) * 100) : null;
 const confColor = conf && conf >= 80 ? '#c9973a' : conf && conf >= 60 ? '#d97706' : '#dc2626';

 return (
 <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #faf9ff 100%)' }}>

 {/* Header */}
 <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
 <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
 <ArrowLeft size={14} /> Retour
 </button>
 <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <Sparkles size={16} color="#d4a853" strokeWidth={1.8} />
 <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>Ajout Rapide — Wassil</span>
 </div>
 </div>
 </div>

 <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '720px' }}>

 {/* Intro */}
 <div style={{ marginBottom: '2rem' }}>
 <h1 style={{ fontWeight: 900, fontSize: '1.6rem', color: DARK, margin: '0 0 0.5rem', letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif' }}>
 Wassil s&apos;occupe de tout
 </h1>
 <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
 Décris la ressource comme tu le ferais à voix haute. Wassil détecte la catégorie, cherche les infos manquantes sur Google et crée la fiche. Tu n&apos;as plus qu&apos;à valider.
 </p>
 </div>

 {/* Formulaire */}
 {status !== 'done' && (
 <form onSubmit={handleSubmit}>
 <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #fdfbf0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(124,58,237,0.08)', marginBottom: '1rem' }}>

 {/* Bandeau Wassil */}
 <div style={{ background: 'linear-gradient(135deg, #c9973a, #8a6025)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}></div>
 <div>
 <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>Wassil est à l&apos;écoute</div>
 <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>Powered by Gemini + Google Search</div>
 </div>
 </div>

 <div style={{ padding: '1.5rem' }}>
 {/* Zone de texte libre */}
 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 Décris la ressource
 </label>
 <textarea
 value={texte}
 onChange={e => setTexte(e.target.value)}
 required
 rows={5}
 placeholder="Ex: &ldquo;La piscine de Choisy-le-Roi accepte les burkinis le mardi matin de 7h à 8h&rdquo;&#10;&#10;Ou : &ldquo;Cours de tajwid à Paris 19 chez Abou Moussa, prix libre, tous niveaux&rdquo;&#10;&#10;Ou encore un lien Instagram, un message copié-collé..."
 style={{ width: '100%', padding: '1rem', border: '2px solid #fdfbf0', borderRadius: '12px', fontSize: '0.92rem', outline: 'none', resize: 'vertical', fontFamily: 'Poppins, sans-serif', lineHeight: 1.6, boxSizing: 'border-box', color: '#1c1917', backgroundColor: '#faf9ff' }}
 />

 {/* URL optionnelle */}
 <div style={{ marginTop: '1rem' }}>
 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 Lien (optionnel)
 </label>
 <input
 type="url"
 value={url}
 onChange={e => setUrl(e.target.value)}
 placeholder="https://..."
 style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #fdfbf0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif', backgroundColor: '#faf9ff' }}
 />
 </div>

 {/* Exemples */}
 <div style={{ marginTop: '1rem', padding: '0.875rem 1rem', backgroundColor: '#fdfbf0', borderRadius: '10px', border: '1px solid #fdfbf0' }}>
 <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c9973a', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exemples rapides</div>
 {[
 '"Piscine Molitor Paris 16 accepte les burkinis"',
 '"Conférence de Tariq Ramadan à Lyon le 20 juin"',
 '"Librairie islamique Al-Furqane à Villepinte"',
 ].map(ex => (
 <button key={ex} type="button" onClick={() => setTexte(ex.replace(/"/g, ''))}
 style={{ display: 'block', background: 'none', border: 'none', color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer', padding: '2px 0', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}>
 → {ex}
 </button>
 ))}
 </div>
 </div>
 </div>

 {status === 'error' && (
 <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', fontSize: '0.85rem', color: '#991b1b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <AlertTriangle size={16} strokeWidth={2} /> {errorMsg}
 </div>
 )}

 <button type="submit" disabled={status === 'loading' || texte.trim().length < 5}
 style={{ width: '100%', padding: '1rem', background: status === 'loading' ? '#d4a853' : 'linear-gradient(135deg, #c9973a, #8a6025)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', boxShadow: '0 4px 16px rgba(124,58,237,0.3)', transition: 'opacity 0.2s' }}>
 {status === 'loading' ? (
 <> Wassil cherche sur le web...</>
 ) : (
 <><Send size={18} strokeWidth={2} /> Envoyer à Wassil</>
 )}
 </button>

 {status === 'loading' && (
 <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.75rem', fontFamily: 'Poppins, sans-serif' }}>
 Wassil lit ton message, cherche sur Google et prépare la fiche... (10-20 secondes)
 </p>
 )}
 </form>
 )}

 {/* Résultat Wassil */}
 {status === 'done' && fiche && (
 <div>
 {/* Badge résultat */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem 1.25rem', backgroundColor: 'white', borderRadius: '14px', border: '1px solid #f0dea0', boxShadow: '0 2px 8px rgba(5,150,105,0.08)' }}>
 <CheckCircle size={28} color="#c9973a" strokeWidth={1.8} />
 <div style={{ flex: 1 }}>
 <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#8a6025', fontFamily: 'Poppins, sans-serif' }}>Wassil a généré la fiche </div>
 <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
 En attente de validation dans <strong>/admin/soumissions</strong>
 </div>
 </div>
 {conf && (
 <div style={{ textAlign: 'center', padding: '0.5rem 0.875rem', borderRadius: '10px', backgroundColor: '#f0fdf4', border: `1px solid ${confColor}20` }}>
 <div style={{ fontWeight: 900, fontSize: '1.2rem', color: confColor }}>{conf}%</div>
 <div style={{ fontSize: '0.62rem', color: '#9ca3af', textTransform: 'uppercase' }}>confiance</div>
 </div>
 )}
 </div>

 {/* Contenu généré */}
 <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fdfbf0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(124,58,237,0.08)', marginBottom: '1.5rem' }}>
 <div style={{ background: 'linear-gradient(135deg, #c9973a, #8a6025)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div>
 <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem', fontFamily: 'Poppins, sans-serif' }}>
 {String(fiche.titre || '(sans titre)')}
 </div>
 <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', marginTop: '2px' }}>
 {CAT_LABELS[String(fiche.categorie || '')] || fiche.categorie} · {fiche.ville || ''}
 </div>
 </div>
 {fiche.is_spam && (
 <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>SPAM DÉTECTÉ</span>
 )}
 </div>

 <div style={{ padding: '1.25rem 1.5rem' }}>
 {fiche.description && (
 <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1rem' }}>{String(fiche.description)}</p>
 )}

 <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
 <tbody>
 {[
 ['Adresse', fiche.adresse], ['Ville', fiche.ville], ['Horaires', fiche.horaires],
 ['Tarif', fiche.tarif], ['Contact', fiche.contact], ['Site web', fiche.site_web],
 ['Tags', fiche.tags], ['Burkini', fiche.burkini],
 ].filter(([, v]) => v).map(([k, v]) => (
 <tr key={String(k)} style={{ borderBottom: '1px solid #fdfbf0' }}>
 <td style={{ padding: '6px 0', fontWeight: 700, color: '#6b7280', width: 120 }}>{String(k)}</td>
 <td style={{ padding: '6px 0', color: '#1c1917' }}>
 {String(k) === 'Site web' ? (
 <a href={String(v)} target="_blank" rel="noopener noreferrer" style={{ color: VIOLET, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
 {String(v).slice(0, 50)} <ExternalLink size={11} />
 </a>
 ) : String(v)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {fiche.note_djamil && (
 <div style={{ marginTop: '1rem', padding: '0.875rem', backgroundColor: '#fdfbf0', borderRadius: '10px', border: '1px solid #fdfbf0' }}>
 <div style={{ fontSize: '0.72rem', fontWeight: 700, color: VIOLET, marginBottom: '0.25rem' }}> Note de Wassil</div>
 <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{String(fiche.note_djamil)}</p>
 </div>
 )}
 </div>
 </div>

 {/* Actions */}
 <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
 <a href="/admin/soumissions" style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #c9973a, #8a6025)', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none', fontFamily: 'Poppins, sans-serif' }}>
 Voir dans les soumissions →
 </a>
 <button onClick={() => { setStatus('idle'); setTexte(''); setUrl(''); setFiche(null); }}
 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.875rem 1.25rem', backgroundColor: '#fdfbf0', color: VIOLET, border: '2px solid #fdfbf0', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
 <RotateCcw size={15} strokeWidth={2} /> Nouvel ajout
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
