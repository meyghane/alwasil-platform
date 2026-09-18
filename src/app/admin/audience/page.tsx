import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import AudienceClient from './AudienceClient';

export default async function AudiencePage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');
  return <main style={{ minHeight: '100vh', background: '#f0ebfa', padding: '2rem 1rem' }}><div className="container" style={{ maxWidth: 1100 }}><Link href="/admin" style={{ color: '#543398', textDecoration: 'none' }}>← Dashboard</Link><h1 style={{ margin: '1.5rem 0 .35rem' }}>Audience et emplacements</h1><p style={{ color: '#59565f' }}>Mesure interne activée uniquement après consentement. Aucun cookie publicitaire n’est installé.</p><AudienceClient /></div></main>;
}
