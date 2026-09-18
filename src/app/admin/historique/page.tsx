import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import HistoriqueClient from './HistoriqueClient';

export default async function HistoriquePage() {
  if (!(await isAdminLoggedIn())) redirect('/admin/login');
  return <HistoriqueClient />;
}
