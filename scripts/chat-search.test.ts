import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPublicRecords, answerChat, type ChatRecord } from '../src/lib/chat-search';
const now = new Date('2026-09-22T12:00:00Z');
const record = (category: string, extra: Partial<ChatRecord> = {}): ChatRecord => ({ id: 'test-record', category, status: 'approved', title: 'Fixture de test', city: 'Paris', dateStart: new Date('2026-10-01'), isSpam: false, metadata: {}, ...extra });
for (const [question, category, route, metadata] of [
  ['événements à Paris', 'event', '/events', {}],
  ['mosquées à Paris', 'institute', '/lieux-priere', { subType: 'mosquee' }],
  ['instituts à Paris', 'institute', '/education', { subType: 'institut' }],
  ['solidarité à Paris', 'solidarity', '/solidarity', {}],
  ['Omra à Paris', 'hajj', '/hajj/offres/test-record', { publicOfferVerified: true }],
] as const) test(`chatbot : ${category} vers la vraie rubrique`, () => {
  const reply = searchPublicRecords(question, [record(category, { metadata })], now);
  assert.match(reply, /Fixture de test/); assert.ok(reply.includes(route));
});
test('chatbot : fiches pending, spam et événements passés exclus', () => {
  const reply = searchPublicRecords('événements', [record('event', { status: 'pending' }), record('event', { isSpam: true }), record('event', { dateStart: new Date('2020-01-01') })], now);
  assert.match(reply, /pas trouvé/); assert.doesNotMatch(reply, /Fixture/);
});
test('chatbot : aucune donnée interne ni contact inventé', () => {
  const reply = searchPublicRecords('instituts', [record('institute', { metadata: { source: 'SECRET_SOURCE', raw: { contact: 'PRIVATE_CONTACT' } } })], now);
  assert.doesNotMatch(reply, /SECRET_SOURCE|PRIVATE_CONTACT|approved/);
});
test('chatbot : Hajj sans agence vérifiée bloqué', () => assert.match(searchPublicRecords('hajj', [record('hajj')], now), /pas trouvé/));
test('chatbot : mosquée distincte des instituts', () => assert.match(searchPublicRecords('instituts', [record('institute', { metadata: { subType: 'mosquee' } })], now), /pas trouvé/));
test('chatbot : erreur API claire et aucun détail technique', async () => {
  const response = await answerChat(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: 'événements' }] }) }), async () => { throw new Error('secret database'); });
  assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /secret database/);
});
test('chatbot : JSON invalide traité', async () => {
  const response = await answerChat(new Request('http://localhost/api/chat', { method: 'POST', body: '{' }), async () => []);
  assert.equal(response.status, 400);
});
test('chatbot : aucun résultat produit un texte non vide', async () => {
  const response = await answerChat(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: 'événements' }] }) }), async () => []);
  assert.match((await response.json()).text, /pas trouvé/);
});
test('chatbot : recherche bloquée interrompue avec fallback explicite', async () => {
  const response = await answerChat(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ messages: [{ role: 'user', content: 'mosquées' }] }) }), () => new Promise(() => {}), 5);
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /momentanément indisponible/);
});
