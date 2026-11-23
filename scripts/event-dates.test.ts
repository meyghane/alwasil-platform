import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEventDate, itemEventDate } from '../src/lib/event-dates';

test('les dates des fiches événement gardent leur jour local depuis ISO date ou timestamp', () => {
  assert.equal(normalizeEventDate('2026-12-20'), '2026-12-20');
  assert.equal(normalizeEventDate('2026-12-20T10:00:00+01:00'), '2026-12-20');
  assert.equal(itemEventDate({ date: '2026-12-20T10:00:00+01:00' }), '2026-12-20');
  assert.equal(normalizeEventDate('2026-02-30T10:00:00Z'), null);
});
