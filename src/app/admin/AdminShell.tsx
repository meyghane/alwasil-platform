'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  useEffect(() => setHidden(pathname === '/admin/login'), [pathname]);
  if (hidden) return <>{children}</>;
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}><AdminSidebar /><div style={{ minWidth: 0, flex: 1 }}>{children}</div></div>;
}
