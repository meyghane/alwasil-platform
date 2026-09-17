import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareTelegramSubmission } from '../src/lib/telegram-ingest';

test('un événement Telegram complet devient une proposition sans publication automatique', () => {
  const proposal = prepareTelegramSubmission({
    categorie: 'evenement', titre: 'Cours du samedi', ville: 'Paris', departement: '75',
    date_iso: '2026-10-03', heure: '14h00', organisateur: 'Association locale',
  }, 'Flyer du cours');
  assert.equal(proposal?.categoryKey, 'evenement');
  assert.equal(proposal?.data.requires_enrichment, false);
  assert.equal(proposal?.data.date, '2026-10-03');
});

test('une cagnotte sans page autorisée reste à compléter', () => {
  const proposal = prepareTelegramSubmission({ categorie: 'cagnotte', titre: 'Aide aux familles', site_web: 'https://example.com/pay', organisateur: 'Association' }, 'Un lien');
  assert.equal(proposal?.categoryKey, 'cagnotte');
  assert.equal(proposal?.data.requires_enrichment, true);
  assert.equal(proposal?.data.url, undefined);
});

test('une mosquée incomplète reste à compléter', () => {
  const proposal = prepareTelegramSubmission({ categorie: 'mosquee', titre: 'Mosquée du quartier' }, 'Une mosquée');
  assert.equal(proposal?.categoryKey, 'mosquee');
  assert.equal(proposal?.data.requires_enrichment, true);
  assert.equal(proposal?.data.type, 'mosquee');
});

test('une catégorie inconnue est rejetée', () => {
  assert.equal(prepareTelegramSubmission({ categorie: 'inconnue', titre: 'X' }, ''), null);
});
