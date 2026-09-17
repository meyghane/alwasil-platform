// Run with: node --env-file=.env.local scripts/apply-data-quality.mjs
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL manquant');
const sql = neon(databaseUrl);
const migration = await readFile(new URL('../src/db/migrations/0006_data_quality.sql', import.meta.url), 'utf8');
const statements = migration.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(s=>s && !['BEGIN','COMMIT'].includes(s));
try {
 await sql.transaction(statements.map(statement=>sql.query(statement)));
 console.log('Migration qualité appliquée. Dates de vérification inconnues conservées à NULL.');
} catch { console.error('Migration non confirmée : vérifier la connexion Neon. Aucun secret affiché.'); process.exitCode=1; }
