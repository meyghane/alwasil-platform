import { getPublicPools } from '@/lib/public-places';
import PiscinesClient from './PiscinesClient';
export default async function PiscinesPage() {
  return <PiscinesClient piscines={await getPublicPools()} />;
}
