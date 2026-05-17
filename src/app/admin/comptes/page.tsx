import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/user-auth';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import ComptesClient from './ComptesClient';

export default async function ComptesPage() {
  // Accepte les deux systèmes de session (ancien aw_admin + nouveau aw_user)
  const userSession = await getUserSession();
  const oldAdmin    = await isAdminLoggedIn();

  // oldAdmin (cookie aw_admin) prime sur tout
  if (!oldAdmin && !userSession) redirect('/admin/login');
  if (!oldAdmin && userSession && userSession.role !== 'admin') redirect('/modo');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #faf9ff 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} color="#c4b5fd" strokeWidth={1.8} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>Gestion des comptes</span>
          </div>
        </div>
      </div>

      <ComptesClient />
    </div>
  );
}
