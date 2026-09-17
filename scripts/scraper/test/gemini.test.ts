import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCampaignUrl, prioritizeDepartments } from '../src/utils/gemini';

test('la recherche privilégie les départements les moins couverts', () => {
  const order = prioritizeDepartments({ '75': 30, '92': 12, '93': 5, '94': 11, '77': 1, '78': 2, '95': 3, '91': 4 });
  assert.deepEqual(order, ['77', '78', '95', '91', '93', '94', '92', '75']);
});

test('l’extension voisine attend la couverture minimale des huit départements franciliens', () => {
  const full = Object.fromEntries(['75', '77', '78', '91', '92', '93', '94', '95'].map(department => [department, 3]));
  assert.equal(prioritizeDepartments({ ...full, '60': 0, '27': 2 })[0], '60');
  assert.equal(prioritizeDepartments({ ...full, '91': 2 })[0], '91');
});

test('à couverture égale, les départements tournent entre les jours', () => {
  assert.equal(prioritizeDepartments({}, 0)[0], '75');
  assert.equal(prioritizeDepartments({}, 1)[0], '77');
});

test('seules les pages HTTPS de plateformes autorisées sont candidates', () => {
  assert.equal(normalizeCampaignUrl('https://www.helloasso.com/associations/test/collectes/a?utm_source=mail'), 'https://www.helloasso.com/associations/test/collectes/a');
  assert.equal(normalizeCampaignUrl('https://helloasso.com.evil.test/collecte'), null);
  assert.equal(normalizeCampaignUrl('http://www.launchgood.com/campaign/1'), null);
  assert.equal(normalizeCampaignUrl('https://www.launchgood.com/campaign/1/'), 'https://www.launchgood.com/campaign/1');
});
