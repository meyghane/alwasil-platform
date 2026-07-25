import { getLibrairies } from '@/lib/db-queries';
import LibrairiesClient from './LibrairiesClient';

export const revalidate = 3600;

export default async function LibrairiesPage() {
  const librairies = await getLibrairies();
  return <LibrairiesClient librairies={librairies} />;
}
