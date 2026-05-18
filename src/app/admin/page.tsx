import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { CATEGORIES_LIST } from '@/lib/admin-forms';
import AdminLogout from './AdminLogout';
import {
 Waves, BookOpen, Calendar, Briefcase, Brain, Activity,
 Library, HandCoins, Plane, History, ArrowLeft, Plus,
 LayoutDashboard, Info, Inbox, Users, Sparkles, Zap,
} from 'lucide-react';

const CAT_ICONS: Record<string, typeof Waves> = {
 piscine: Waves,
 institut: BookOpen,
 evenement: Calendar,
 emploi: Briefcase,
 psy: Brain,
 hijama: Activity,
 roqya: Activity,
 librairie: Library,
 cagnotte: HandCoins,
 hajj: Plane,
};

const GOLD = '#c9973a';
const DARK = '#0a0806';
const CREAM = '#fdfbf0';

function getCatIcon(key: string) {
 return CAT_ICONS[key] ?? Plus;
}

export default async function AdminPage() {
 if (!(await isAdminLoggedIn())) redirect('/admin/login');

 return (
 <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${CREAM} 0%, #fffef8 100%)` }}>

 {/* Header noir/or */}
 <div style={{
 background: `linear-gradient(135deg, ${DARK} 0%, #100c04 100%)`,
 borderBottom: '1px solid rgba(201,151,58,0.2)',
 }}>
 <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
 <div style={{
 width: 38, height: 38, borderRadius: '10px',
 background: 'rgba(201,151,58,0.12)',
 border: `1px solid rgba(201,151,58,0.3)`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 }}>
 <LayoutDashboard size={18} color={GOLD} strokeWidth={1.8} />
 </div>
 <div>
 <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Al-Wasil Admin</div>
 <div style={{ fontSize: '0.68rem', color: 'rgba(201,151,58,0.5)' }}>Espace administration</div>
 </div>
 </div>

 <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
 <Link href="/admin/auto" style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
 fontSize: '0.78rem', color: GOLD, textDecoration: 'none',
 padding: '0.4rem 0.875rem',
 backgroundColor: 'rgba(201,151,58,0.12)',
 border: `1px solid rgba(201,151,58,0.3)`,
 borderRadius: '8px',
 }}>
 <Zap size={13} strokeWidth={2} /> Autos
 </Link>
 <Link href="/admin/comptes" style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
 fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
 padding: '0.4rem 0.875rem',
 backgroundColor: 'rgba(255,255,255,0.06)',
 border: '1px solid rgba(255,255,255,0.12)',
 borderRadius: '8px',
 }}>
 <Users size={13} strokeWidth={2} /> Comptes
 </Link>
 <Link href="/admin/soumissions" style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
 fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
 padding: '0.4rem 0.875rem',
 backgroundColor: 'rgba(255,255,255,0.08)',
 border: '1px solid rgba(255,255,255,0.15)',
 borderRadius: '8px',
 }}>
 <Inbox size={13} strokeWidth={2} /> Soumissions
 </Link>
 <Link href="/admin/historique" style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
 fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
 padding: '0.4rem 0.75rem', border: '1px solid rgba(255,255,255,0.12)',
 borderRadius: '8px',
 }}>
 <History size={12} strokeWidth={2} /> Historique
 </Link>
 <Link href="/" style={{
 display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
 fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
 }}>
 <ArrowLeft size={12} /> Site
 </Link>
 <AdminLogout />
 </div>
 </div>
 </div>

 <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '1000px' }}>

 {/* Ajout Rapide — bandeau Wassil */}
 <Link href="/modo/ajout-rapide" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
 <div style={{ background: `linear-gradient(135deg, ${DARK}, #1a1408)`, borderRadius: '16px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 8px 24px rgba(201,151,58,0.15)`, border: `1px solid rgba(201,151,58,0.2)` }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(201,151,58,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid rgba(201,151,58,0.3)` }}>
 <Sparkles size={22} color={GOLD} strokeWidth={1.6} />
 </div>
 <div>
 <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Ajout Rapide — Wassil</div>
 <div style={{ fontSize: '0.75rem', color: 'rgba(201,151,58,0.6)', marginTop: '2px' }}>Décris en texte libre → Wassil cherche sur Google et crée la fiche automatiquement</div>
 </div>
 </div>
 <div style={{ fontSize: '0.78rem', color: GOLD, fontWeight: 700, flexShrink: 0 }}>Essayer →</div>
 </div>
 </Link>

 {/* Titre */}
 <div style={{ marginBottom: '1.5rem' }}>
 <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: DARK, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
 Tableau de bord
 </h1>
 <p style={{ color: '#7a6848', fontSize: '0.88rem', margin: 0 }}>
 Sélectionne une catégorie pour ajouter une nouvelle fiche.
 </p>
 </div>

 {/* Équipe */}
 <div style={{ backgroundColor: 'white', borderRadius: '16px', border: `1px solid #f0dea0`, padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: `0 2px 8px rgba(201,151,58,0.08)` }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
 <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#7a6848', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
 Classement de l&apos;équipe
 </div>
 <Link href="/admin/comptes" style={{ fontSize: '0.75rem', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>Gérer l&apos;équipe →</Link>
 </div>
 <div style={{ display: 'flex', gap: '0.75rem' }}>
 <div style={{ flex: 1, backgroundColor: CREAM, borderRadius: '12px', border: `1px solid #f0dea0`, padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <div style={{ width: 38, height: 38, borderRadius: '10px', background: `linear-gradient(135deg, ${GOLD}, #a87830)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: DARK, fontSize: '1rem', flexShrink: 0 }}>
 A
 </div>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1c1917' }}>Admin</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
 <div style={{ flex: 1, height: 4, backgroundColor: '#f0dea0', borderRadius: '99px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: '0%', background: `linear-gradient(90deg, ${GOLD}, #fbbf24)`, borderRadius: '99px' }} />
 </div>
 <span style={{ fontSize: '0.68rem', fontWeight: 700, color: GOLD, flexShrink: 0 }}>0 pts</span>
 </div>
 </div>
 </div>
 <div style={{ flex: 2, backgroundColor: CREAM, borderRadius: '12px', border: `1px dashed #f0dea0`, padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.25rem' }}>
 <div style={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center' }}>Le classement se remplit quand des modérateurs ajoutent des fiches</div>
 <Link href="/admin/comptes" style={{ fontSize: '0.72rem', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>Inviter un modo →</Link>
 </div>
 </div>
 </div>

 {/* Grille des catégories */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
 {CATEGORIES_LIST.map(cat => {
 const Icon = getCatIcon(cat.key);
 return (
 <Link key={cat.key} href={`/admin/ajouter/${cat.key}`} style={{ textDecoration: 'none' }}>
 <div className="admin-cat-card" style={{
 backgroundColor: 'white',
 borderRadius: '14px',
 border: `1px solid #f0dea0`,
 padding: '1.25rem',
 display: 'flex', flexDirection: 'column', gap: '0.75rem',
 boxShadow: `0 2px 8px rgba(201,151,58,0.06)`,
 cursor: 'pointer',
 transition: 'all 0.2s',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <div style={{
 width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
 backgroundColor: CREAM,
 border: `1px solid #f0dea0`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 }}>
 <Icon size={18} color={GOLD} strokeWidth={1.8} />
 </div>
 <div>
 <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1c1917' }}>{cat.label}</div>
 <div style={{ fontSize: '0.67rem', color: '#a8a29e' }}>→ {cat.sheetTab}</div>
 </div>
 </div>
 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: GOLD, fontWeight: 700 }}>
 <Plus size={13} strokeWidth={2.5} /> Ajouter une fiche
 </div>
 </div>
 </Link>
 );
 })}
 </div>

 {/* Comment ça marche */}
 <div style={{ padding: '1.5rem', backgroundColor: 'white', border: `1px solid #f0dea0`, borderRadius: '14px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
 <div style={{ width: 36, height: 36, borderRadius: '8px', flexShrink: 0, backgroundColor: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Info size={16} color={DARK} strokeWidth={2} />
 </div>
 <div>
 <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: DARK, margin: '0 0 0.5rem' }}>Comment ça marche</h3>
 <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.83rem', color: '#57534e', lineHeight: 1.9 }}>
 <li>Tu remplis le formulaire de la catégorie voulue</li>
 <li>La fiche est envoyée au modérateur avec toutes les données</li>
 <li>Le modérateur valide → la fiche passe <strong style={{ color: GOLD }}>"en ligne"</strong></li>
 <li>La fiche apparaît instantanément sur le site</li>
 </ol>
 </div>
 </div>
 </div>
 </div>
 );
}
