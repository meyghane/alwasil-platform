import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import Link from 'next/link';
import { ArrowLeft, Inbox } from 'lucide-react';
import SoumissionsClient from './SoumissionsClient';

export default async function SoumissionsPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #faf9ff 100%)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e0545 100%)', borderBottom: '1px solid rgba(196,181,253,0.15)' }}>
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.82rem' }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox size={16} color="#c4b5fd" strokeWidth={1.8} />
              <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Soumissions à modérer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#1e0545', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
            Modération des fiches
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Valide ou rejette les fiches soumises par la communauté.
          </p>
        </div>

        <SoumissionsClient />
      </div>
    </div>
  );
}
