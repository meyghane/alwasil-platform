import test from 'node:test';
import assert from 'node:assert/strict';
import { assessRecord, duplicateEvidence, mergeComplementary, correctiveState } from '../src/lib/agents/policy';
import { discoverSources, REGION_ZONES } from '../src/lib/agents/discovery';
import { extractStructured } from '../src/lib/agents/extraction';
import { runAgents, freshnessProposal, type AgentPorts } from '../src/lib/agents/pipeline';
import { formatAgentReport } from '../src/lib/agents/report';
import { publicAddress, adminActionAllowed } from '../src/lib/agents/security';
import type { Source, RecordData, RunReport } from '../src/lib/agents/contracts';

const now = new Date('2026-09-22T12:00:00Z');
const zones = [...REGION_ZONES[Math.floor(now.getTime()/86400000)%REGION_ZONES.length]];
const source: Source = { id:'test-source',url:'https://example.org/',category:'mosquee',departments:zones,trust:'trusted',official:true,evidence:'Preuve officielle de test, non destinée à la production.',enabled:true };
const html = '<script type="application/ld+json">' + JSON.stringify({ '@type':'Mosque',name:'Mosquée de test',description:'Description suffisamment détaillée de cette fixture de test, sans représenter un établissement réel.',address:{ addressLocality:'Paris',postalCode:'75001',streetAddress:'Adresse de test' },telephone:'0123456789',openingHours:['Mo 10:00-18:00'] }) + '</script>';
const record: RecordData = extractStructured(html,source,now.toISOString())[0];
test('découverte : rotation, catégories et quota explicites', () => {
  assert.notDeepEqual(discoverSources([],['mosquee'],3,0).plannedZones,discoverSources([],['mosquee'],3,1).plannedZones);
  const plan=discoverSources([source, {...source,id:'second'}],['mosquee'],1,Math.floor(now.getTime()/86400000));
  assert.equal(plan.selected.length,1); assert.equal(plan.quotaReached,true);
  assert.equal(discoverSources([source],['institut'],3,0).selected.length,0);
});
test('extraction conserve adresse, horaires, provenance et champs absents', () => {
  assert.equal(record.address,'Adresse de test'); assert.deepEqual(record.hours,['Mo 10:00-18:00']); assert.equal(record.email,'');
  assert.ok(record.provenance.contentHash); assert.equal(record.provenance.url,source.url);
});
test('extraction ne convertit pas un profil individuel en lieu public', () => assert.equal(extractStructured('<script type="application/ld+json">{"@type":"Person","name":"Privé"}</script>',source,now.toISOString()).length,0));
test('extraction ne transforme pas un produit ou une organisation générique en mosquée', () => {
  for (const type of ['Product', 'Organization', 'Event']) {
    const document = `<script type="application/ld+json">${JSON.stringify({'@type':type,name:'Test'})}</script>`;
    assert.equal(extractStructured(document, source, now.toISOString()).length, 0);
  }
});
test('publication automatique seulement avec source officielle approuvée', () => {
  assert.equal(assessRecord(record,source,false,now).decision,'automatic');
  assert.equal(assessRecord(record,{...source,trust:'pending'},false,now).decision,'deferred');
  assert.equal(assessRecord(record,{...source,official:false},false,now).decision,'deferred');
});
test('qualité : fiche pauvre et téléphone douteux différés', () => {
  assert.equal(assessRecord({...record,description:''},source,false,now).decision,'deferred');
  assert.equal(assessRecord({...record,phone:'123'},source,false,now).decision,'deferred');
});
test('catégories sensibles ne sont jamais auto-publiées', () => {
  for (const category of ['hajj','cagnotte','sante','justice','emploi'] as const) assert.equal(assessRecord({...record,category},{...source,category},false,now).decision,'deferred');
});
test('piscine générique : aucune autorisation de burkini ne doit être déduite', () => {
  assert.equal(assessRecord({...record,category:'piscine'},{...source,category:'piscine'},false,now).decision,'deferred');
});
test('source absente, bloquée ou privée : publication bloquée', () => {
  assert.equal(assessRecord({...record,provenance:{...record.provenance,url:''}},source,false,now).decision,'blocked');
  assert.equal(assessRecord(record,{...source,trust:'blocked'},false,now).decision,'blocked');
  assert.equal(assessRecord({...record,description:'password=secret'},source,false,now).decision,'blocked');
});
test('doublons et complément sans écrasement', () => {
  assert.ok(duplicateEvidence(record,{...record,title:record.title.toUpperCase()}).length);
  const merged=mergeComplementary(record,{...record,email:'test@example.org',address:'Autre adresse'});
  assert.equal(merged.merged.address,record.address); assert.equal(merged.merged.email,'test@example.org'); assert.deepEqual(merged.conflicts,['address']);
});
test('deux dates distinctes ne fusionnent pas deux événements', () => assert.deepEqual(duplicateEvidence({...record,category:'evenement',date:'2026-10-01'},{...record,category:'evenement',date:'2026-10-02'}),[]));
test('archivage, restauration et rollback respectent la qualité', () => {
  assert.equal(correctiveState('archive','approved',true),'expired');
  assert.equal(correctiveState('restore','expired',false),'pending');
  assert.equal(correctiveState('restore','expired',true),'approved');
  assert.equal(correctiveState('rollback','approved',false,'pending'),'pending');
});
const ports = (overrides: Partial<AgentPorts> = {}): AgentPorts => ({ sources:async()=>[source],fetch:async()=>html,save:async()=>({id:'test',duplicate:false,published:true}),verifyPublic:async()=>true,rollback:async()=>{},finish:async()=>{},...overrides });
test('pipeline publie puis confirme la récupération publique', async () => {
  const report=await runAgents(ports(),now,'test-run'); assert.equal(report.published,1); assert.equal(report.found,1);
});
test('erreur Vercel / visibilité : rollback et aucun faux publié', async () => {
  let rolledBack=false;
  const report=await runAgents(ports({verifyPublic:async()=>{throw new Error('Vercel unavailable');},rollback:async()=>{rolledBack=true;}}),now,'test-run');
  assert.equal(report.published,0); assert.equal(report.deferred,1); assert.equal(rolledBack,true);
});
test('erreur Neon enregistrée sans faux résultat', async () => {
  const report=await runAgents(ports({save:async()=>{throw new Error('Neon unavailable');}}),now,'test-run');
  assert.equal(report.published,0); assert.ok(report.errors.length);
});
test('rapport distingue absence de source et recherche sans résultat', async () => {
  const report=await runAgents(ports({sources:async()=>[]}),now,'test-run');
  assert.equal(report.zones.length,0); assert.equal(report.categories.length,0); assert.ok(report.uncovered.length);
  assert.match(formatAgentReport(report),/Zones explorées : aucune/); assert.match(formatAgentReport(report),/Actions administratrice/);
});
test('fraîcheur : expiration démontrée, fermeture non inventée', () => {
  assert.equal(freshnessProposal({...record,date:'2020-01-01'},true,now).action,'archive');
  assert.equal(freshnessProposal(record,false,now).action,'reverify');
});
test('sécurité : adresses internes et permissions admin', () => {
  for (const address of ['127.0.0.1','10.0.0.1','169.254.169.254','172.16.0.1','::1','fd00::1']) assert.equal(publicAddress(address),false);
  assert.equal(publicAddress('8.8.8.8'),true);
  assert.equal(adminActionAllowed(false,'archive'),false); assert.equal(adminActionAllowed(true,'delete'),false); assert.equal(adminActionAllowed(true,'archive'),true);
});
