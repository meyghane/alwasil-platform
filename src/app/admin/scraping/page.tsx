import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { isAdminLoggedIn } from '@/lib/admin-auth';

type Row = { category: string; model_calls: number; tokens_used: number; items_found: number; items_inserted: number; quota_errors: number };
type ErrorRow = { code: string; stage: string; created_at: string };
const limits = [
  { category: 'events', label: 'Événements', calls: 7, tokens: 120000 },
  { category: 'cagnottes', label: 'Cagnottes', calls: 3, tokens: 50000 },
] as const;

export default async function ScrapingPage() {
  if (!(await isAdminLoggedIn())) redirect('/admin');
  let rows: Row[] = [];
  let unavailable = false;
  let errors: ErrorRow[] = [];
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
    const errorResult = await db.execute(sql`SELECT code, stage, created_at FROM automation_errors WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris' ORDER BY created_at DESC LIMIT 8`);
    errors = errorResult.rows as unknown as ErrorRow[];
  } catch { unavailable = true; }
  return <main style={{ minHeight: '100vh', background: '#fff', color: '#080808', padding: '2rem max(1rem, 5vw)' }}>
    <Link href="/admin/auto" style={{ color: '#7652CA' }}>Retour aux automatisations</Link>
    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', marginBottom: '0.5rem' }}>Consommation du scraping</h1>
    <p style={{ color: '#555' }}>Aujourd’hui, heure de Paris. Les fiches découvertes restent en attente de modération.</p>
    {unavailable ? <p>Suivi indisponible. Vérifier la migration 0007.</p> : <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead><tr>{['Catégorie', 'Appels / limite', 'Tokens / limite', 'Trouvées', 'Ajoutées', 'Erreurs 429'].map(label => <th key={label} style={{ padding: '0.75rem', borderBottom: '2px solid #080808' }}>{label}</th>)}</tr></thead>
      <tbody>{limits.map(limit => { const row = rows.find(item => item.category === limit.category); return <tr key={limit.category}><td style={{ padding: '0.75rem' }}>{limit.label}</td><td>{row?.model_calls ?? 0} / {limit.calls}</td><td>{row?.tokens_used ?? 0} / {limit.tokens.toLocaleString('fr-FR')}</td><td>{row?.items_found ?? 0}</td><td>{row?.items_inserted ?? 0}</td><td>{row?.quota_errors ?? 0}</td></tr>; })}</tbody>
    </table></div>}
    <h2 style={{ marginTop: '2rem' }}>État des dernières exécutions</h2>
    {!errors.length ? <p style={{ color: '#16803c' }}>Aucun incident enregistré aujourd’hui.</p> : <div style={{ display: 'grid', gap: '0.5rem' }}>{errors.map(error => <div key={`${error.created_at}-${error.code}`} style={{ padding: '0.75rem 1rem', border: '1px solid #f1c40f', borderRadius: 10, background: '#fffbea' }}><strong>{error.code}</strong><span style={{ color: '#666', marginLeft: 10 }}>{error.stage} | {new Date(error.created_at).toLocaleString('fr-FR')}</span></div>)}</div>}
    <p style={{ color: '#666', fontSize: '0.85rem' }}>Une exécution sans résultat est maintenant signalée séparément d’un quota Gemini et déclenche une source de secours.</p>
  </main>;
}
