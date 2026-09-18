import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import Link from 'next/link';
import DatabaseClient from './DatabaseClient';

export default async function DatabasePage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');
  return <main style={{ minHeight: '100vh', background: '#faf9ff', padding: '2rem 1rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/admin" style={{ color: '#7652CA', textDecoration: 'none', fontSize: 14 }}>Retour au dashboard</Link>
      <h1 style={{ margin: '1rem 0 .35rem', fontSize: '2rem' }}>Base de données Neon</h1>
      <p style={{ color: '#59565f', marginTop: 0 }}>Gère les fiches du site et consulte l’historique des décisions.</p>
      <DatabaseClient />
    </div>
  </main>;
}
