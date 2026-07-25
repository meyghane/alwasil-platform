import { getHajjAgences, getHajjPackages } from '@/lib/db-queries';
import HajjClient from './HajjClient';

export const revalidate = 3600;

export default async function HajjPage() {
  const [hajjAgences, hajjPackages] = await Promise.all([
    getHajjAgences(),
    getHajjPackages(),
  ]);
  return <HajjClient hajjAgences={hajjAgences} hajjPackages={hajjPackages} />;
}
