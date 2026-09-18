import test from 'node:test';
import assert from 'node:assert/strict';
import { isAuthorizedReviewAction, reviewKeyboard, reviewPreview } from '../src/lib/telegram-moderation';
import type { items } from '../src/db/schema';

type Item = typeof items.$inferSelect;
const base = {
  id: 'f474f9cb-63c3-4a95-a381-386edc7a94f2', category: 'event',
  title: 'Cours de langue', description: 'Cours à Paris', city: 'Paris', dateStart: new Date('2099-10-01'),
  sourceUrl: 'https://example.org/cours', metadata: { subType: 'event', raw: { date: '2099-10-01', organizer: 'Association' } },
} as Item;

test('une fiche complète a des boutons de modération et un lien de correction', () => {
  const buttons = reviewKeyboard(base).inline_keyboard.flat();
  assert.equal(buttons.find(button => button.text === 'Valider')?.callback_data, `a:${base.id}`);
  assert.ok(buttons.find(button => button.url)?.url?.includes(`item=${base.id}`));
});

test('une fiche incomplète ou cagnotte ne propose pas la validation directe', () => {
  for (const item of [
    { ...base, metadata: { ...base.metadata, requiresEnrichment: true } },
    { ...base, category: 'solidarity' as const, metadata: { subType: 'cagnotte' } },
    { ...base, dateStart: null, metadata: { subType: 'event', raw: {} } },
  ]) assert.equal(reviewKeyboard(item).inline_keyboard.flat().some(button => button.text === 'Valider'), false);
});

test('l’aperçu nettoie les cadratins et distingue la date de l’événement', () => {
  const preview = reviewPreview({ ...base, title: 'Cours - exemple', description: `Texte ${String.fromCodePoint(0x2014)} suite` });
  assert.ok(preview.includes('Date de l’événement : 2099-10-01'));
  assert.equal(preview.includes(String.fromCodePoint(0x2014)), false);
});

test('seul le compte administrateur dans le bon groupe peut cliquer', () => {
  assert.equal(isAuthorizedReviewAction('123', '-456', '123', '-456'), true);
  assert.equal(isAuthorizedReviewAction('789', '-456', '123', '-456'), false);
  assert.equal(isAuthorizedReviewAction('123', '-789', '123', '-456'), false);
});
