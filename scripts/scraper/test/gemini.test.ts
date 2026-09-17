import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCampaignUrl, prioritizeDepartments } from '../src/utils/gemini';

test('la recherche privilégie les départements les moins couverts', () => {
  const order = prioritizeDepartments({ '75': 30, '92': 12, '93': 5, '94': 11, '77': 1, '78': 2, '95': 3 });
  assert.deepEqual(order, ['77', '78', '95', '93', '94', '92', '75']);
});

test('seules les pages HTTPS de plateformes autorisées sont candidates', () => {
  assert.equal(normalizeCampaignUrl('https://www.helloasso.com/associations/test/collectes/a?utm_source=mail'), 'https://www.helloasso.com/associations/test/collectes/a');
  assert.equal(normalizeCampaignUrl('https://helloasso.com.evil.test/collecte'), null);
  assert.equal(normalizeCampaignUrl('http://www.launchgood.com/campaign/1'), null);
  assert.equal(normalizeCampaignUrl('https://www.launchgood.com/campaign/1/'), 'https://www.launchgood.com/campaign/1');
});
