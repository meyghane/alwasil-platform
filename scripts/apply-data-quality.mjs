// Run with: node --env-file=.env.local scripts/apply-data-quality.mjs
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL manquant');
const sql = neon(databaseUrl);
const files = ['0006_data_quality.sql', '0008_moderation_history.sql', '0009_form_security.sql'];
const statements = (await Promise.all(files.map(file => readFile(new URL(`../src/db/migrations/${file}`, import.meta.url), 'utf8'))))
 .join('\n').replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(s=>s && !['BEGIN','COMMIT'].includes(s));
try {
 await sql.transaction(statements.map(statement=>sql.query(statement)));
 console.log('Migrations qualité, historique et sécurité des formulaires appliquées.');
} catch { console.error('Migration non confirmée : vérifier la connexion Neon. Aucun secret affiché.'); process.exitCode=1; }
