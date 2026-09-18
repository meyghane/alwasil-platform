'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Archive, Database, FileCheck, Flag, Gauge, History, LayoutDashboard, LogOut, Settings, Users, Zap } from 'lucide-react';
import AdminLogout from './AdminLogout';

// Navigation persistante de l'espace admin, avec compteurs en temps réel.

const groups = [
  { label: 'Contenu', links: [['/admin/base', 'Base du site', Database], ['/admin/soumissions', 'Nouvelles fiches', FileCheck], ['/admin/signalements', 'Signalements', Flag]] },
  { label: 'Qualité', links: [['/admin/fraicheur', 'Fraîcheur', Gauge], ['/admin/couverture', 'Couverture', Archive], ['/admin/historique', 'Historique', History], ['/admin/journal', 'Journal', History]] },
  { label: 'Exploitation', links: [['/admin/auto', 'Automatisations', Zap], ['/admin/comptes', 'Comptes', Users], ['/admin/leads', 'Leads Hajj', Settings]] },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ pending: 0, reports: 0, errors: 0 });
  useEffect(() => { fetch('/api/admin/navigation').then(response => response.ok ? response.json() : null).then(data => data && setCounts(data)).catch(() => undefined); }, []);
  return <aside style={{ width: 238, flexShrink: 0, background: '#080808', color: 'white', minHeight: 'calc(100vh - 74px)', padding: '1.25rem .8rem', position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
    <Link href="/admin" style={{ display: 'flex', gap: '.55rem', alignItems: 'center', color: 'white', textDecoration: 'none', padding: '.65rem .75rem', borderRadius: 10, background: 'rgba(118,82,202,.2)', marginBottom: '1.35rem', fontWeight: 800 }}><LayoutDashboard size={16} color="#ECFF58" /> Tableau de bord</Link>
    {groups.map(group => <div key={group.label} style={{ marginBottom: '1.35rem' }}><div style={{ color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 10, fontWeight: 800, padding: '0 .75rem', marginBottom: '.45rem' }}>{group.label}</div>{group.links.map(([href, label, Icon]) => { const active = pathname === href || pathname.startsWith(`${href}/`); const badge = href === '/admin/soumissions' ? counts.pending : href === '/admin/signalements' ? counts.reports : href === '/admin/journal' ? counts.errors : 0; return <Link key={href} href={href} aria-current={active ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: active ? '#ECFF58' : 'rgba(255,255,255,.78)', textDecoration: 'none', padding: '.62rem .75rem', borderRadius: 8, fontSize: 13, marginBottom: 2, background: active ? 'rgba(118,82,202,.26)' : 'transparent', boxShadow: active ? 'inset 3px 0 #ECFF58' : 'none' }}><Icon size={15} strokeWidth={1.8} /><span style={{ flex: 1 }}>{label}</span>{badge > 0 && <span style={{ minWidth: 21, padding: '2px 6px', borderRadius: 999, background: '#ECFF58', color: '#080808', textAlign: 'center', fontSize: 11, fontWeight: 900 }}>{badge}</span>}</Link>; })}</div>)}
    <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: '1rem', display: 'grid', gap: '.55rem' }}><Link href="/" style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', padding: '.55rem .75rem', fontSize: 13 }}>Voir le site</Link><AdminLogout /></div>
  </aside>;
}
