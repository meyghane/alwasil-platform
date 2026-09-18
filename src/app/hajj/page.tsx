import { getHajjAgences, getHajjPackages } from '@/lib/db-queries';
import HajjClient from './HajjClient';

// Les offres sont modérées dans Neon et doivent apparaître juste après
// leur validation depuis Telegram ou l'admin.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HajjPage() {
  const [hajjAgences, hajjPackages] = await Promise.all([
    getHajjAgences(),
    getHajjPackages(),
  ]);
  return <HajjClient hajjAgences={hajjAgences} hajjPackages={hajjPackages} />;
}
