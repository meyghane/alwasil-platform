import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';

const priorities = [
  { title: 'Événements', detail: 'Recherche quotidienne équilibrée entre les départements franciliens. Fiches à valider avant publication.' },
  { title: 'Cagnottes', detail: 'Recherche de campagnes HelloAsso et LaunchGood. Chaque collecte et son organisateur doivent être vérifiés manuellement.' },
];

export default async function AutoPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin');
  return <main style={{ minHeight: '100vh', background: '#fff', color: '#080808', padding: '2rem max(1rem, 5vw)' }}>
    <Link href="/admin" style={{ color: '#7652CA' }}>Retour à l’administration</Link>
    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', marginBottom: '0.5rem' }}>Automatisations</h1>
    <p style={{ maxWidth: 720, lineHeight: 1.6 }}>La recherche fonctionne depuis GitHub Actions et écrit des propositions dans Neon. Les anciens boutons Google Sheets ont été retirés pour ne pas contourner les budgets Gemini.</p>
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.5rem 0 2rem' }}>
      <Link href="/admin/scraping" style={{ borderRadius: 999, padding: '0.85rem 1.25rem', color: '#080808', background: '#ECFF58', fontWeight: 700 }}>Voir la consommation</Link>
      <Link href="/admin/soumissions" style={{ borderRadius: 999, padding: '0.85rem 1.25rem', color: '#fff', background: '#080808', fontWeight: 700 }}>Modérer les fiches</Link>
      <Link href="/admin/journal" style={{ borderRadius: 999, padding: '0.85rem 1.25rem', color: '#080808', border: '1px solid #080808' }}>Voir le journal</Link>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
      {priorities.map(item => <section key={item.title} style={{ background: '#f7f4ff', borderRadius: 20, padding: '1.5rem' }}><h2>{item.title}</h2><p style={{ lineHeight: 1.5 }}>{item.detail}</p></section>)}
    </div>
    <p style={{ maxWidth: 720, lineHeight: 1.6, marginTop: '2rem' }}>Emploi, santé, éducation, librairies, piscines et Hajj ne sont pas encore intégrés à ce pipeline. Ne pas activer les anciens scrapers pour ces catégories sans contrôle préalable.</p>
  </main>;
}
