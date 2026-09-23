import { execFileSync } from 'node:child_process';
import { mkdtempSync, unlinkSync, rmdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const directory = mkdtempSync(join(tmpdir(), 'alwasil-production-check-'));
const file = join(directory, 'production.env');
try {
  execFileSync('vercel', ['env', 'pull', file, '--environment=production', '--yes'], { stdio: 'pipe' });
  if (!existsSync(file)) throw new Error('Environment file not produced');
  for (const script of ['scripts/external-readiness.mjs','scripts/production-readiness.mjs']) {
    try { console.log(execFileSync(process.execPath, [`--env-file=${file}`, script], { encoding: 'utf8', stdio: 'pipe' })); }
    catch (error) { const stderr = error.stderr?.toString() || ''; console.log(error.stdout?.toString() || JSON.stringify({ check: script, status: error.status, code: error.code, signal: error.signal, failed: true, invalidOption: /bad option|not allowed|unrecognized option/.test(stderr), fileMissing: /not found|ENOENT|No such file/.test(stderr) })); process.exitCode=1; }
  }
} catch { console.error('Lecture configuration Vercel impossible (détails masqués).'); process.exitCode=1; }
finally { if (existsSync(file)) unlinkSync(file); rmdirSync(directory); }
