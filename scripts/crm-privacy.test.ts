import test from 'node:test';
import assert from 'node:assert/strict';
import {canContactPartner} from '../src/lib/partner-quality';
import {retentionApproved,retentionCutoffs} from '../src/lib/privacy-retention';
test('contact agence : statut seul insuffisant',()=>{
  assert.equal(canContactPartner({status:'verified',email:'fixture@example.org'}),false);
  assert.equal(canContactPartner({status:'verified',email:'fixture@example.org',phone:'0123456789',sourceUrl:'https://example.org',verifiedAt:'2026-09-23'}),true);
  assert.equal(canContactPartner({status:'pending',email:'fixture@example.org',phone:'0123456789',sourceUrl:'https://example.org',verifiedAt:'2026-09-23'}),false);
});
test('conservation : aucun traitement sans activation explicite',()=>{
  assert.equal(retentionApproved({}),false);assert.equal(retentionApproved({PERSONAL_DATA_RETENTION_ENABLED:'false'}),false);
  const now=new Date('2026-09-23T00:00:00Z'),cutoff=retentionCutoffs(now);
  assert.equal((now.getTime()-cutoff.leads.getTime())/86400000,365);
  assert.equal((now.getTime()-cutoff.submissions.getTime())/86400000,90);
});
