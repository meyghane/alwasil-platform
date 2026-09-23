import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverRecordedEmail } from '../src/lib/email-delivery';
test('Resend : rejet fournisseur enregistré sans perdre la demande', async () => {
  let recorded=0;
  assert.equal(await deliverRecordedEmail(async()=>({error:{message:'rejected'}}),async()=>{recorded++;}),false);
  assert.equal(recorded,1);
});
test('Resend : timeout journalisé et succès distinct', async () => {
  let recorded=0;
  assert.equal(await deliverRecordedEmail(async()=>{throw new Error('timeout');},async()=>{recorded++;}),false);
  assert.equal(await deliverRecordedEmail(async()=>({}),async()=>{recorded++;}),true);
  assert.equal(recorded,1);
});
