import { redirect } from 'next/navigation';
import { getUserSession, hasPermission } from '@/lib/user-auth';
import Link from 'next/link';
import { Inbox, Plus, LogOut, Shield, User, Bell, Sparkles } from 'lucide-react';
import ChatInterne from '@/components/ChatInterne';

const VIOLET = '#c9973a';
const DARK = '#0f0225';

const ALL_CATS = [
 { key: 'piscine', label: 'Piscines' },
 { key: 'evenement', label: 'Événements' },
 { key: 'mosquee', label: 'Mosquées' },
 { key: 'emploi', label: 'Emploi' },
 { key: 'institut', label: 'Instituts' },
 { key: 'cagnotte', label: 'Cagnottes' },
 { key: 'librairie', label: 'Librairies' },
 { key: 'psy', label: 'Psychologie' },
 { key: 'hijama', label: 'Hijama' },
 { key: 'roqya', label: 'Roqya' },
 { key: 'hajj', label: 'Hajj/Omra' },
];

async function getStats(name: string) {
 try {
 const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
 if (!url) return { soumises: 0, validees: 0, ajoutsRapides: 0 };
 const res = await fetch(`${url}?action=getStats&name=${encodeURIComponent(name)}`, { next: { revalidate: 120 } });
 if (!res.ok) return { soumises: 0, validees: 0, ajoutsRapides: 0 };
 const data = await res.json();
 return data.stats || { soumises: 0, validees: 0, ajoutsRapides: 0 };
 } catch {
 return { soumises: 0, validees: 0, ajoutsRapides: 0 };
 }
}

function getLevel(h: number) {
 if (h >= 1000) return { label: 'Pilier', ar: 'ركيزة', color: '#f59e0b', next: null, min: 1000, progress: 100 };
 if (h >= 500) return { label: 'Bâtisseur', ar: 'بانٍ', color: '#c9973a', next: 1000, min: 500, progress: Math.round(((h-500)/500)*100) };
 if (h >= 200) return { label: 'Nāfi\'', ar: 'نافع', color: '#c9973a', next: 500, min: 200, progress: Math.round(((h-200)/300)*100) };
 if (h >= 75) return { label: 'Mousāhim', ar: 'مساهم', color: '#a87830', next: 200, min: 75, progress: Math.round(((h-75)/125)*100) };
 return { label: 'Moubtadi\'', ar: 'مبتدئ', color: '#9ca3af', next: 75, min: 0, progress: Math.round((h/75)*100) };
}

export default async function ModoDashboard() {
 const session = await getUserSession();
 if (!session) redirect('/modo/login');

 const allowedCats = ALL_CATS.filter(c => hasPermission(session, c.key));
 const isAdmin = session.role === 'admin';
 const stats = await getStats(session.name);
 const hasanates = (stats.soumises * 10) + (stats.validees * 25) + (stats.ajoutsRapides * 5);
 const level = getLevel(hasanates);

 return (
 <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdfbf0 0%, #faf9ff 100%)' }}>

 {/* Header */}
 <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
 <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
 <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(196,181,253,0.15)', border: '1px solid rgba(196,181,253,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Shield size={18} color="#d4a853" strokeWidth={1.8} />
 </div>
 <div>
 <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif' }}>Espace modération</div>
 <div style={{ fontSize: '0.68rem', color: 'rgba(196,181,253,0.6)' }}>
 {isAdmin ? 'Administrateur' : 'Modérateur'} — {session.name}
 </div>
 </div>
 </div>

 <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
 {isAdmin && (
 <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'white', textDecoration: 'none', padding: '0.4rem 0.875rem', backgroundColor: 'rgba(196,181,253,0.2)', border: '1px solid rgba(196,181,253,0.4)', borderRadius: '8px' }}>
 Dashboard Admin
 </Link>
 )}
 <Link href="/modo/notifications" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0.4rem 0.75rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}>
 <Bell size={13} strokeWidth={2} /> Notifs
 </Link>
 <Link href="/modo/profil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0.4rem 0.75rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}>
 <User size={12} strokeWidth={2} /> Profil
 </Link>
 <form action="/api/auth/logout" method="POST">
 <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.5rem' }}>
 <LogOut size={14} strokeWidth={2} />
 </button>
 </form>
 </div>
 </div>
 </div>

 <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '960px' }}>

 {/* Bonjour + Mini hasanates widget */}
 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
 <div>
 <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: DARK, margin: '0 0 0.3rem', letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif' }}>
 Bonjour {session.name.split(' ')[0]} 
 </h1>
 <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
 {session.permissions.includes('all') ? 'Accès à toutes les catégories.' : `Catégories : ${allowedCats.map(c => c.label).join(', ')}`}
 </p>
 </div>

 {/* Mini card hasanates */}
 <Link href="/modo/profil" style={{ textDecoration: 'none', flexShrink: 0 }}>
 <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fdfbf0', padding: '1rem 1.25rem', minWidth: 220, boxShadow: '0 4px 16px rgba(124,58,237,0.08)', cursor: 'pointer' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
 {/* Avatar */}
 <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #c9973a, #8a6025)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1rem', flexShrink: 0 }}>
 {session.name.charAt(0).toUpperCase()}
 </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.name}</div>
 <div style={{ fontSize: '0.68rem', color: level.color, fontWeight: 700 }}>{level.label} {level.ar}</div>
 </div>
 <div style={{ textAlign: 'right', flexShrink: 0 }}>
 <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fbbf24', lineHeight: 1 }}>{hasanates}</div>
 <div style={{ fontSize: '0.6rem', color: '#9ca3af' }}>hasanates</div>
 </div>
 </div>

 {/* Barre de progression */}
 <div>
 <div style={{ height: 6, backgroundColor: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${level.progress}%`, background: `linear-gradient(90deg, ${VIOLET}, #fbbf24)`, borderRadius: '99px', transition: 'width 0.8s ease' }} />
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
 <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>{level.progress}%</span>
 {level.next && <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>→ {level.next} </span>}
 {!level.next && <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 700 }}>MAX </span>}
 </div>
 </div>
 </div>
 </Link>
 </div>

 {/* 2 actions principales */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>

 <Link href="/modo/ajout-rapide" style={{ textDecoration: 'none' }}>
 <div style={{ background: 'linear-gradient(135deg, #8a6025, #3b0764)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 8px 24px rgba(76,29,149,0.4)', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
 <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Sparkles size={22} color="#d4a853" strokeWidth={1.6} />
 </div>
 <div>
 <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Ajout Rapide</div>
 <div style={{ fontSize: '0.78rem', color: 'rgba(196,181,253,0.7)', marginTop: '4px', lineHeight: 1.5 }}>
 Décris en texte libre — Wassil cherche tout sur Google et crée la fiche
 </div>
 </div>
 <div style={{ fontSize: '0.72rem', color: '#d4a853', fontWeight: 700 }}> +15 hasanates par ajout</div>
 </div>
 </Link>

 <Link href="/modo/soumissions" style={{ textDecoration: 'none' }}>
 <div style={{ background: 'linear-gradient(135deg, #c9973a, #8a6025)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 8px 24px rgba(124,58,237,0.3)', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
 <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Inbox size={22} color="white" strokeWidth={1.6} />
 </div>
 <div>
 <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Soumissions</div>
 <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: '4px', lineHeight: 1.5 }}>
 Valider ou rejeter les fiches en attente de modération
 </div>
 </div>
 <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}> +5 hasanates par validation</div>
 </div>
 </Link>
 </div>

 {/* Grille catégories */}
 <h2 style={{ fontWeight: 700, fontSize: '0.82rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>
 Ajouter une fiche manuellement <span style={{ color: '#d4a853', fontWeight: 600 }}>+10 </span>
 </h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
 {allowedCats.map(cat => (
 <Link key={cat.key} href={`/modo/ajouter/${cat.key}`} style={{ textDecoration: 'none' }}>
 <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #fdfbf0', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(109,40,217,0.06)', cursor: 'pointer' }}>
 <div>
 <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1c1917', fontFamily: 'Poppins, sans-serif' }}>{cat.label}</div>
 <div style={{ fontSize: '0.72rem', color: VIOLET, fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
 <Plus size={11} strokeWidth={2.5} /> Ajouter
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </div>

 <ChatInterne currentUser={session.name} currentRole={session.role} />
 </div>
 );
}
