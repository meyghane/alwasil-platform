'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <button
      onClick={logout}
      style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer' }}
    >
      Déconnexion
    </button>
  );
}
