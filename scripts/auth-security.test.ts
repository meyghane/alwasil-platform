import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
test('authentification : aucun secret de secours ni compte permanent dans le code',()=>{
  const source=readFileSync(new URL('../src/lib/user-auth.ts',import.meta.url),'utf8');
  assert.doesNotMatch(source,/const (DIRECT_CREDENTIALS|PERMANENT_ACCOUNTS)/);
  assert.doesNotMatch(source,/fallback_secret/);
});
test('authentification : configuration manquante refuse les sessions',()=>{
  const script=`import assert from 'node:assert/strict';
    const user=await import('./src/lib/user-auth.ts');const admin=await import('./src/lib/admin-auth.ts');
    assert.equal(await user.verifyUserToken('invalid.invalid'),null);
    assert.equal(await admin.verifySessionToken('invalid.invalid'),false);
    assert.equal(await user.authenticateUser('fixture@example.org','fixture-password'),null);
    await assert.rejects(admin.createSessionToken());`;
  execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',script],{cwd:process.cwd(),env:{PATH:process.env.PATH,ADMIN_SESSION_SECRET:''},stdio:'pipe'});
});
