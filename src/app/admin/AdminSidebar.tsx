'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Archive, BarChart3, Database, FileCheck, Flag, Gauge, History, LayoutDashboard, LogOut, Settings, Users, Zap } from 'lucide-react';
import AdminLogout from './AdminLogout';

// Navigation persistante de l'espace admin, avec compteurs en temps réel.

const groups = [
  { label: 'Modération', links: [['/admin/soumissions', 'À traiter', FileCheck], ['/admin/base', 'Toutes les fiches', Database], ['/admin/signalements', 'Signalements', Flag]] },
  { label: 'Qualité des données', links: [['/admin/fraicheur', 'Fiches à revérifier', Gauge], ['/admin/couverture', 'Couverture géographique', Archive], ['/admin/historique', 'Historique des actions', History], ['/admin/journal', 'Erreurs et alertes', History]] },
  { label: 'Fonctionnement', links: [['/admin/agents', 'Agents et corrections', Zap], ['/admin/auto', 'Automatisations', Zap], ['/admin/audience', 'Audience et publicités', BarChart3], ['/admin/comptes', 'Comptes et modérateurs', Users], ['/admin/leads', 'Demandes Hajj/Omra', Settings]] },
] as const;

export default function AdminSidebar({ mobileOpen = false, onNavigate }: { mobileOpen?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ pending: 0, reports: 0, errors: 0 });
  useEffect(() => { fetch('/api/admin/navigation').then(response => response.ok ? response.json() : null).then(data => data && setCounts(data)).catch(() => undefined); }, []);
  return <aside className={`admin-sidebar${mobileOpen ? ' admin-sidebar--open' : ''}`} style={{ width: 238, flexShrink: 0, background: '#080808', color: 'white', minHeight: 'calc(100vh - 74px)', padding: '1.25rem .8rem', position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
    <Link href="/admin" onClick={onNavigate} style={{ display: 'flex', gap: '.55rem', alignItems: 'center', color: 'white', textDecoration: 'none', padding: '.65rem .75rem', borderRadius: 10, background: pathname === '/admin' ? 'rgba(118,82,202,.36)' : 'rgba(118,82,202,.2)', marginBottom: '1.35rem', fontWeight: 800, boxShadow: pathname === '/admin' ? 'inset 3px 0 #ECFF58' : 'none' }}><LayoutDashboard size={16} color="#ECFF58" /> Tableau de bord</Link>
    {groups.map(group => <div key={group.label} style={{ marginBottom: '1.35rem' }}><div style={{ color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 10, fontWeight: 800, padding: '0 .75rem', marginBottom: '.45rem' }}>{group.label}</div>{group.links.map(([href, label, Icon]) => { const active = pathname === href || pathname.startsWith(`${href}/`); const badge = href === '/admin/soumissions' ? counts.pending : href === '/admin/signalements' ? counts.reports : href === '/admin/journal' ? counts.errors : 0; return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: active ? '#ECFF58' : 'rgba(255,255,255,.78)', textDecoration: 'none', padding: '.62rem .75rem', borderRadius: 8, fontSize: 13, marginBottom: 2, background: active ? 'rgba(118,82,202,.26)' : 'transparent', boxShadow: active ? 'inset 3px 0 #ECFF58' : 'none' }}><Icon size={15} strokeWidth={1.8} /><span style={{ flex: 1 }}>{label}</span>{badge > 0 && <span style={{ minWidth: 21, padding: '2px 6px', borderRadius: 999, background: '#ECFF58', color: '#080808', textAlign: 'center', fontSize: 11, fontWeight: 900 }}>{badge}</span>}</Link>; })}</div>)}
    <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: '1rem', display: 'grid', gap: '.55rem' }}><Link href="/" onClick={onNavigate} style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', padding: '.55rem .75rem', fontSize: 13 }}>Voir le site</Link><AdminLogout /></div>
    <style jsx>{`
      @media (max-width: 760px) {
        .admin-sidebar { position: fixed !important; z-index: 1001; inset: 0 auto 0 0; width: min(82vw, 300px) !important; min-height: 100vh !important; padding: 5.2rem 1rem 1.25rem !important; transform: translateX(-105%); transition: transform .2s ease; overflow-y: auto; box-shadow: 12px 0 32px rgba(0,0,0,.28); }
        .admin-sidebar--open { transform: translateX(0); }
      }
    `}</style>
  </aside>;
}
