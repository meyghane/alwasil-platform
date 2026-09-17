import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquant');
const db = neon(process.env.DATABASE_URL);
const columns = await db`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'items' AND column_name IN ('last_verified_at', 'next_review_at')`;
const tables = await db`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('automation_errors', 'scrape_category_usage')`;
const columnNames = new Set(columns.map(row => row.column_name));
const tableNames = new Set(tables.map(row => row.table_name));
const ready = ['last_verified_at', 'next_review_at'].every(name => columnNames.has(name)) && ['automation_errors', 'scrape_category_usage'].every(name => tableNames.has(name));
if (!ready) {
  console.error('Schéma incomplet : appliquer les migrations 0006 puis 0007.');
  process.exitCode = 1;
} else {
  const result = await db`SELECT count(*)::int AS total, count(*) FILTER (WHERE status IN ('pending','approved') AND next_review_at IS NULL)::int AS sans_echeance FROM items`;
  console.log(`Schéma prêt. ${result[0].total} fiches ; ${result[0].sans_echeance} fiche(s) active(s) sans échéance de revue.`);
  if (Number(result[0].sans_echeance) > 0) process.exitCode = 1;
}
