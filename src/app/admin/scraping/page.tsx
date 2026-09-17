import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { isAdminLoggedIn } from '@/lib/admin-auth';

type Row = { category: string; model_calls: number; tokens_used: number; items_found: number; items_inserted: number; quota_errors: number };

export default async function ScrapingPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin');
  let rows: Row[] = [];
  let unavailable = false;
  try {
    const result = await db.execute(sql`
      SELECT category, sum(model_calls)::int AS model_calls, sum(tokens_used)::int AS tokens_used,
        sum(items_found)::int AS items_found, sum(items_inserted)::int AS items_inserted,
        sum(quota_errors)::int AS quota_errors
      FROM scrape_category_usage
      WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris'
      GROUP BY category ORDER BY category
    `);
    rows = result.rows as unknown as Row[];
  } catch { unavailable = true; }
  return <main style={{ minHeight: '100vh', background: '#fff', color: '#080808', padding: '2rem max(1rem, 5vw)' }}>
    <Link href="/admin/auto" style={{ color: '#7652CA' }}>Retour aux automatisations</Link>
    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', marginBottom: '0.5rem' }}>Consommation du scraping</h1>
    <p style={{ color: '#555' }}>Aujourd’hui, heure de Paris. Les fiches découvertes restent en attente de modération.</p>
    {unavailable ? <p>Suivi indisponible. Vérifier la migration 0007.</p> : rows.length === 0 ? <p>Aucun appel enregistré aujourd’hui.</p> : <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead><tr>{['Catégorie', 'Appels', 'Tokens', 'Trouvées', 'Ajoutées', 'Erreurs 429'].map(label => <th key={label} style={{ padding: '0.75rem', borderBottom: '2px solid #080808' }}>{label}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.category}><td style={{ padding: '0.75rem' }}>{row.category}</td><td>{row.model_calls}</td><td>{row.tokens_used}</td><td>{row.items_found}</td><td>{row.items_inserted}</td><td>{row.quota_errors}</td></tr>)}</tbody>
    </table></div>}
  </main>;
}
