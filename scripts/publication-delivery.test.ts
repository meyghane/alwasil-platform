import test from 'node:test';
import assert from 'node:assert/strict';
import { assessInstitute } from '../src/lib/institute-quality';
import { prepareTelegramSubmission } from '../src/lib/telegram-ingest';
import { confirmPublicPublication, publicationIssues } from '../src/lib/publication';
import { deliverOnce, type DeliveryStore, type Delivery } from '../src/lib/delivery-ledger';

const mosque = { name: 'Fixture mosquée', type: 'mosquee', city: 'Paris', department: '75', address: 'Adresse de test', phone: 'Contact de test', website: 'https://example.org', description: 'Description de test détaillée de l’établissement, de ses activités et de son accueil du public.', tags: ['prière'], lastVerifiedAt: '2026-09-22', confidence: 'high' };
test('fiche mosquée riche acceptée', () => assert.equal(assessInstitute(mosque).eligible, true));
test('fiche institut exige des cours détaillés', () => {
  assert.equal(assessInstitute({ ...mosque, type: 'institut' }).eligible, false);
  assert.equal(assessInstitute({ ...mosque, type: 'institut', courses: ['Arabe débutant : cours hebdomadaire pour adultes'] }).eligible, true);
});
test('fiche pauvre bloquée', () => assert.equal(assessInstitute({ name: 'Fixture', city: 'Paris' }).eligible, false));
test('extraction institut conserve cours et horaires structurés', () => {
  const submission = prepareTelegramSubmission({ ...mosque, categorie: 'institut', titre: mosque.name, courses: ['Arabe débutant : cours hebdomadaire pour adultes'], horaires: 'Samedi matin' }, 'Texte de test');
  assert.deepEqual(submission?.data.courses, ['Arabe débutant : cours hebdomadaire pour adultes']);
  assert.equal(submission?.data.horaires, 'Samedi matin');
});
test('publication confirmée seulement quand la route publique retrouve la fiche', async () => {
  assert.equal(await confirmPublicPublication('test', async id => id === 'test'), true);
  assert.equal(await confirmPublicPublication('test', async () => false), false);
  assert.equal(await confirmPublicPublication('test', async () => { throw new Error('timeout'); }), false);
});
test('validation Telegram bloque une fiche sans date', () => assert.ok(publicationIssues({ id: 'test', category: 'event', status: 'pending', title: 'Test', city: 'Paris', department: '75', description: '', sourceUrl: null, dateStart: null, metadata: {} }).length));
const delivery: Delivery = { key: 'review:recipient:item', itemId: 'item', recipient: 'recipient', source: 'test', type: 'review' };
function store(rows: Map<string, string>): DeliveryStore {
  return { async claim(d) { if (rows.has(d.key)) return false; rows.set(d.key, 'claimed'); return true; }, async finish(key, result) { rows.set(key, result); } };
}
test('notification envoyée, redémarrage et /suivantes sans répétition', async () => {
  const rows = new Map<string, string>(); let sent = 0;
  assert.equal(await deliverOnce(store(rows), delivery, async () => { sent++; }), true);
  assert.equal(await deliverOnce(store(rows), delivery, async () => { sent++; }), false);
  assert.equal(await deliverOnce(store(rows), { ...delivery, source: 'resynchronisation' }, async () => { sent++; }), false);
  assert.equal(sent, 1); assert.equal(rows.get(delivery.key), 'sent');
});
test('échec ambigu journalisé et non renvoyé', async () => {
  const rows = new Map<string, string>();
  await assert.rejects(deliverOnce(store(rows), delivery, async () => { throw new Error('timeout'); }));
  assert.equal(rows.get(delivery.key), 'uncertain');
  assert.equal(await deliverOnce(store(rows), delivery, async () => assert.fail()), false);
});
test('réceptions concurrentes ne produisent qu’un envoi', async () => {
  const rows = new Map<string, string>(); let sent = 0;
  await Promise.all(Array.from({ length: 5 }, () => deliverOnce(store(rows), delivery, async () => { sent++; })));
  assert.equal(sent, 1);
});
