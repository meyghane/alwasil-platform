import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/user-auth';
import SoumissionsModerateur from './SoumissionsModerateur';

export default async function ModoSoumissionsPage() {
  const session = await getUserSession();
  if (!session) redirect('/modo/login');

  return <SoumissionsModerateur session={session} />;
}
