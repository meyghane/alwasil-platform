#!/usr/bin/env node
/**
 * Al-Wasil — Script d'import direct depuis le terminal
 *
 * Usage:
 *   npm run import -- --file scripts/data/events.json
 *   npm run import -- --file scripts/data/piscines.json --dry-run
 *
 * Le script:
 *   1. Lit un fichier JSON d'entrée
 *   2. Envoie les lignes à Apps Script (action=directImport)
 *      → Écrit directement dans le bon onglet avec status "en ligne"
 *      → Logue dans Historique avec author "Claude"
 *   3. Revalide le cache Next.js → site mis à jour instantanément
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// ── Config ──────────────────────────────────────────────────────
const ENV_FILE = path.join(process.cwd(), '.env.local');
function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}
loadEnv();

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
const REVALIDATE_URL  = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`
  : 'http://localhost:3000/api/revalidate';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '';

// ── CLI args ────────────────────────────────────────────────────
const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const dryRun  = args.includes('--dry-run');

if (fileIdx === -1 || !args[fileIdx + 1]) {
  console.error('\n❌ Usage: npm run import -- --file scripts/data/mon-fichier.json\n');
  process.exit(1);
}

const filePath = path.resolve(args[fileIdx + 1]);
if (!fs.existsSync(filePath)) {
  console.error(`\n❌ Fichier introuvable : ${filePath}\n`);
  process.exit(1);
}

// ── Types ────────────────────────────────────────────────────────
type ImportRow = {
  categorie: string;
  sheetTab:  string;
  [key: string]: string | number | boolean;
};

// ── Fetch helper ─────────────────────────────────────────────────
function fetchPost(url: string, body: object, headers: Record<string, string> = {}): Promise<{ ok: boolean; text: string }> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed  = new URL(url);
    const lib     = parsed.protocol === 'https:' ? https : http;

    const req = lib.request({
      hostname: parsed.hostname,
      port:     parsed.port,
      path:     parsed.pathname + parsed.search,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers,
      },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ ok: (res.statusCode || 0) < 400, text: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── MAP catégorie → onglet Sheet ─────────────────────────────────
const CAT_TO_TAB: Record<string, string> = {
  evenement:  'Events',
  event:      'Events',
  events:     'Events',
  piscine:    'Piscines',
  piscines:   'Piscines',
  mosquee:    'Mosquées',
  mosquees:   'Mosquées',
  emploi:     'Emploi',
  institut:   'Instituts',
  instituts:  'Instituts',
  librairie:  'Librairies',
  librairies: 'Librairies',
  cagnotte:   'Cagnottes',
  cagnottes:  'Cagnottes',
  hajj:       'Hajj',
  psy:        'Psychologie',
  hijama:     'Hijama',
  roqya:      'Roqya',
};

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Al-Wasil Import — v1.0');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const raw: ImportRow[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`\n📂 Fichier  : ${filePath}`);
  console.log(`📊 Lignes   : ${raw.length}`);
  if (dryRun) console.log('🧪 Mode dry-run — aucune écriture réelle');

  // Enrichir chaque ligne
  const now = new Date().toISOString();
  const rows = raw.map((row, i) => {
    const cat = (row.categorie || '').toLowerCase();
    const tab = row.sheetTab || CAT_TO_TAB[cat] || 'Soumissions';
    const { categorie, sheetTab: _st, ...rest } = row;
    return {
      id:         `import-${cat}-${Date.now()}-${i}`,
      categorie,
      sheetTab:   tab,
      status:     'en ligne',
      soumis_le:  now,
      soumis_par: 'Claude',
      ...rest,
    };
  });

  // Résumé par catégorie
  const byCat: Record<string, number> = {};
  for (const r of rows) byCat[r.categorie] = (byCat[r.categorie] || 0) + 1;
  console.log('\n📋 Catégories :');
  for (const [cat, n] of Object.entries(byCat)) {
    console.log(`   • ${cat.padEnd(14)} → ${n} fiche(s)`);
  }

  if (dryRun) {
    console.log('\n✅ Dry-run terminé — aperçu de la 1ère ligne :');
    console.log(JSON.stringify(rows[0], null, 2));
    return;
  }

  if (!APPS_SCRIPT_URL) {
    console.error('\n❌ APPS_SCRIPT_WEBHOOK_URL manquant dans .env.local');
    process.exit(1);
  }

  // Envoyer par batch de 10 pour éviter les timeouts Apps Script
  const BATCH = 10;
  let successCount = 0;
  let errorCount   = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    process.stdout.write(`\n⏳ Import batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(rows.length / BATCH)}...`);

    try {
      const res = await fetchPost(APPS_SCRIPT_URL, {
        action:     'directImport',
        rows:       batch,
        importedBy: 'Claude',
        importedAt: now,
      });

      if (res.ok) {
        successCount += batch.length;
        process.stdout.write(` ✅ ${batch.length} lignes\n`);
      } else {
        errorCount += batch.length;
        process.stdout.write(` ❌ Erreur Apps Script\n`);
        console.error('   Réponse:', res.text.slice(0, 200));
      }
    } catch (e) {
      errorCount += batch.length;
      process.stdout.write(` ❌ ${(e as Error).message}\n`);
    }

    // Pause entre batches pour ne pas throttler Apps Script
    if (i + BATCH < rows.length) await new Promise(r => setTimeout(r, 800));
  }

  // Revalidation cache
  if (successCount > 0) {
    console.log('\n🔄 Revalidation du cache Next.js...');
    try {
      const paths = [...new Set(rows.map(r => {
        const tab = (r.sheetTab || '').toLowerCase();
        if (tab.includes('event')) return '/events';
        if (tab.includes('pisci')) return '/piscines';
        if (tab.includes('mosqu')) return '/mosquees';
        if (tab.includes('emploi')) return '/jobs';
        if (tab.includes('lib')) return '/librairies';
        return '/';
      }))];
      paths.push('/');

      const rev = await fetchPost(REVALIDATE_URL, { paths }, {
        'x-revalidate-secret': REVALIDATE_SECRET,
      });
      console.log(`   ${rev.ok ? '✅' : '⚠️'} ${paths.join(', ')}`);
    } catch {
      console.log('   ⚠️ Revalidation locale ignorée (normal si pas localhost)');
    }
  }

  // Résumé final
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  ✅ Succès   : ${successCount} fiche(s)`);
  if (errorCount) console.log(`  ❌ Erreurs  : ${errorCount} fiche(s)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(e => { console.error('\n❌ Erreur fatale:', e.message); process.exit(1); });
