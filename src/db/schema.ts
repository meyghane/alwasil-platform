import { pgTable, pgEnum, uuid, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

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
export const moderationActionEnum = pgEnum('moderation_action', ['approved', 'rejected']);

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: categoryEnum('category').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  title: text('title').notNull(),
  description: text('description'),
  city: text('city'),
  department: text('department'),
  region: text('region').references(() => regions.code),
  dateStart: timestamp('date_start', { withTimezone: true }),
  dateEnd: timestamp('date_end', { withTimezone: true }),
  source: text('source').notNull(),
  sourceUrl: text('source_url'),
  tags: text('tags').array(),
  isSpam: boolean('is_spam').notNull().default(false),
  // Champs spécifiques à chaque catégorie (organizer, format, price, isFree,
  // featured, timeStart/timeEnd, registrationUrl, subCategory...) — évite
  // d'avoir une table par catégorie pour un site mono-admin.
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const regions = pgTable('regions', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  minItemsThreshold: integer('min_items_threshold').notNull().default(15),
});

export const moderationLog = pgTable('moderation_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id),
  action: moderationActionEnum('action').notNull(),
  actor: text('actor').notNull(),
  actedAt: timestamp('acted_at', { withTimezone: true }).notNull().defaultNow(),
});

// Log des runs de découverte automatique (routine Claude quotidienne) — permet
// à Méghane de suivre sa conso de tokens et rationner si besoin.
export const scrapeRuns = pgTable('scrape_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  runType: text('run_type').notNull().default('claude-routine'),
  tokensUsed: integer('tokens_used'),
  itemsFound: integer('items_found').notNull().default(0),
  itemsInserted: integer('items_inserted').notNull().default(0),
  ranAt: timestamp('ran_at', { withTimezone: true }).notNull().defaultNow(),
});
