import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import AgentsConsole from '@/components/admin/AgentsConsole';
export default async function AgentsPage() {
  if (!await isAdminLoggedIn()) redirect('/admin/login');
  return <AgentsConsole />;
}
