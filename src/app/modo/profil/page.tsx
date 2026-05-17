import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/user-auth';
import ProfilClient from './ProfilClient';

async function getStats(name: string) {
  try {
    const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (!url) return { soumises: 0, validees: 0, rejetees: 0, ajoutsRapides: 0 };
    const res = await fetch(`${url}?action=getStats&name=${encodeURIComponent(name)}`, { cache: 'no-store' });
    if (!res.ok) return { soumises: 0, validees: 0, rejetees: 0, ajoutsRapides: 0 };
    const data = await res.json();
    return data.stats || { soumises: 0, validees: 0, rejetees: 0, ajoutsRapides: 0 };
  } catch {
    return { soumises: 0, validees: 0, rejetees: 0, ajoutsRapides: 0 };
  }
}

function calcHasanates(stats: { soumises: number; validees: number; ajoutsRapides: number }) {
  return (stats.soumises * 10) + (stats.validees * 25) + (stats.ajoutsRapides * 5);
}

function getLevel(h: number) {
  if (h >= 1000) return { label: 'Pilier', ar: 'ركيزة', color: '#f59e0b', next: null, progress: 100 };
  if (h >= 500)  return { label: 'Bâtisseur', ar: 'بانٍ', color: '#7c3aed', next: 1000, progress: Math.round(((h - 500) / 500) * 100) };
  if (h >= 200)  return { label: 'Nāfi\'', ar: 'نافع', color: '#059669', next: 500, progress: Math.round(((h - 200) / 300) * 100) };
  if (h >= 75)   return { label: 'Mousāhim', ar: 'مساهم', color: '#0284c7', next: 200, progress: Math.round(((h - 75) / 125) * 100) };
  return { label: 'Moubtadi\'', ar: 'مبتدئ', color: '#6b7280', next: 75, progress: Math.round((h / 75) * 100) };
}

export default async function ProfilPage() {
  const session = await getUserSession();
  if (!session) redirect('/modo/login');

  const stats    = await getStats(session.name);
  const hasanates = calcHasanates(stats);
  const level    = getLevel(hasanates);

  return <ProfilClient session={session} stats={stats} hasanates={hasanates} level={level} />;
}
