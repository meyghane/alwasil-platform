import { runRetention } from '../src/lib/retention-store';
try { console.log(JSON.stringify(await runRetention(false))); }
catch { console.error('Audit de conservation indisponible ; détails masqués.'); process.exitCode=1; }
