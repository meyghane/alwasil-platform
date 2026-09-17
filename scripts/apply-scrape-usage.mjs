import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL manquant');
const db = neon(databaseUrl);
const migration = await readFile(new URL('../src/db/migrations/0007_scrape_usage.sql', import.meta.url), 'utf8');
const statements = migration.split(';').map(s => s.trim()).filter(s => s && !['BEGIN', 'COMMIT'].includes(s));
await db.transaction(statements.map(statement => db.query(statement)));
console.log('Table de suivi du scraping créée ou déjà présente.');
