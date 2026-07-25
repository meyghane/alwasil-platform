// Copie minimale de src/db/schema.ts (projet principal) — le scraper est un
// sous-projet Node CommonJS séparé, sans accès direct aux imports ESM du site.
// Ne garder ici QUE la table `items` (seule table utilisée par le scraper).
// Si le schéma principal change, répercuter le changement ici manuellement.
import { pgTable, pgEnum, uuid, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', [
  'event',
  'job',
  'solidarity',
  'institute',
  'health',
  'library',
  'pool',
  'hajj',
]);

export const statusEnum = pgEnum('status', ['pending', 'approved', 'rejected', 'expired']);

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: categoryEnum('category').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  title: text('title').notNull(),
  description: text('description'),
  city: text('city'),
  department: text('department'),
  region: text('region'),
  dateStart: timestamp('date_start', { withTimezone: true }),
  dateEnd: timestamp('date_end', { withTimezone: true }),
  source: text('source').notNull(),
  sourceUrl: text('source_url'),
  tags: text('tags').array(),
  isSpam: boolean('is_spam').notNull().default(false),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
