'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setHidden(pathname === '/admin/login'), [pathname]);
  useEffect(() => setMobileOpen(false), [pathname]);
  if (hidden) return <>{children}</>;
  return <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
    <button className="admin-mobile-menu-button" type="button" aria-label={mobileOpen ? 'Fermer le menu administrateur' : 'Ouvrir le menu administrateur'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>
      <span />
      <span />
      <span />
    </button>
    {mobileOpen && <button className="admin-sidebar-overlay" type="button" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
    <AdminSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
    <div className="admin-content" style={{ minWidth: 0, flex: 1 }}>{children}</div>
    <style jsx global>{`
      .admin-mobile-menu-button { display: none; }
      .admin-sidebar-overlay { display: none; }
      @media (max-width: 760px) {
        .admin-shell { display: block !important; }
        .admin-content { width: 100%; overflow-x: hidden; }
        .admin-mobile-menu-button {
          display: flex; position: fixed; z-index: 1002; top: 14px; left: 14px;
          width: 46px; height: 46px; border: 1px solid rgba(255,255,255,.2);
          border-radius: 14px; background: #080808; align-items: center;
          justify-content: center; flex-direction: column; gap: 4px; cursor: pointer;
        }
        .admin-mobile-menu-button span { width: 19px; height: 2px; background: #ECFF58; border-radius: 2px; }
        .admin-sidebar-overlay { display: block; position: fixed; inset: 0; z-index: 1000; border: 0; background: rgba(8,8,8,.55); }
      }
    `}</style>
  </div>;
}
