import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toLegacyCagnotte, toLegacyEvent } from '../src/lib/public-api-adapters';

test('la réponse événements conserve les champs historiques', () => {
  const result = toLegacyEvent({ id: 'a', title: 'Cours', category: 'cours', date: '2026-10-01', timeStart: '10h00', location: 'Paris', city: 'Paris', department: '75', organizer: 'Association', description: 'Description', tags: [], format: 'presentiel', isFree: true });
  assert.equal(result.titre, 'Cours');
  assert.equal(result.date_debut, '2026-10-01');
  assert.equal(result.gratuit, true);
});

test('la réponse cagnottes ne fabrique pas de montants', () => {
  const result = toLegacyCagnotte({ id: 'b', title: 'Collecte', organizer: 'Association', platform: 'helloasso', url: 'https://www.helloasso.com/test', description: '', category: 'urgence', currency: 'EUR', imageKeyword: 'solidarité', verified: false });
  assert.equal(result.objectif, 0);
  assert.equal(result.montant_collecte, 0);
  assert.equal(result.pourcentage, 0);
});
