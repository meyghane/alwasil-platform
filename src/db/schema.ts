import { pgTable, pgEnum, uuid, text, boolean, timestamp, integer, jsonb, real } from 'drizzle-orm/pg-core';

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
export const moderationActionEnum = pgEnum('moderation_action', ['approved', 'rejected', 'edited', 'archived', 'reverification_requested', 'deleted']);

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
  lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
  nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
  // Champs spécifiques à chaque catégorie (organizer, format, price, isFree,
  // featured, timeStart/timeEnd, registrationUrl, subCategory...) - évite
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

// Log des runs de découverte automatique (routine Claude quotidienne) - permet
// à Méghane de suivre sa conso de tokens et rationner si besoin.
export const scrapeRuns = pgTable('scrape_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  runType: text('run_type').notNull().default('claude-routine'),
  tokensUsed: integer('tokens_used'),
  itemsFound: integer('items_found').notNull().default(0),
  itemsInserted: integer('items_inserted').notNull().default(0),
  ranAt: timestamp('ran_at', { withTimezone: true }).notNull().defaultNow(),
});

export const automationErrors = pgTable('automation_errors', {
  id: uuid('id').primaryKey().defaultRandom(),
  stage: text('stage').notNull(),
  code: text('code').notNull(),
  itemId: uuid('item_id').references(() => items.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull().default('correction'),
  page: text('page'),
  element: text('element'),
  message: text('message'),
  email: text('email'),
  status: text('status').notNull().default('open'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fingerprint: text('fingerprint').notNull(),
  formType: text('form_type').notNull(),
  ipHash: text('ip_hash').notNull(),
  page: text('page'),
  campaign: text('campaign'),
  referrer: text('referrer'),
  utm: jsonb('utm').$type<Record<string, string>>().notNull().default({}),
  status: text('status').notNull().default('accepted'),
  errorCode: text('error_code'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const leadStatusEnum = pgEnum('lead_status', ['new', 'qualified', 'assigned', 'accepted', 'quoted', 'won', 'lost', 'expired']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['proposed', 'accepted', 'refused', 'expired']);
export const commissionStatusEnum = pgEnum('commission_status', ['pending', 'due', 'paid', 'disputed']);

export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(), name: text('name').notNull(), email: text('email').notNull(),
  phone: text('phone'), status: text('status').notNull().default('pending'), commissionRate: real('commission_rate').notNull().default(0.04), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(), partnerId: uuid('partner_id').notNull().references(() => partners.id), type: text('type').notNull(), title: text('title').notNull(), price: integer('price'), validFrom: timestamp('valid_from', { withTimezone: true }), validUntil: timestamp('valid_until', { withTimezone: true }), status: text('status').notNull().default('draft'), metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(), offerId: text('offer_id'), partnerId: text('partner_id'), status: leadStatusEnum('status').notNull().default('new'), name: text('name').notNull(), email: text('email').notNull(), phone: text('phone'), travelType: text('travel_type').notNull(), qualification: jsonb('qualification').$type<Record<string, unknown>>().default({}), source: text('source'), utm: jsonb('utm').$type<Record<string, string>>().default({}), consentFollowUp: boolean('consent_follow_up').notNull().default(false), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
export const leadAssignments = pgTable('lead_assignments', {
  id: uuid('id').primaryKey().defaultRandom(), leadId: uuid('lead_id').notNull().references(() => leads.id), offerId: uuid('offer_id').references(() => offers.id), partnerId: uuid('partner_id').notNull().references(() => partners.id), status: assignmentStatusEnum('status').notNull().default('proposed'), expiresAt: timestamp('expires_at', { withTimezone: true }), respondedAt: timestamp('responded_at', { withTimezone: true }), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const leadEvents = pgTable('lead_events', {
  id: uuid('id').primaryKey().defaultRandom(), leadId: uuid('lead_id').notNull().references(() => leads.id), event: text('event').notNull(), actor: text('actor').notNull().default('system'), payload: jsonb('payload').$type<Record<string, unknown>>().default({}), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const commissions = pgTable('commissions', {
  id: uuid('id').primaryKey().defaultRandom(), leadId: uuid('lead_id').notNull().references(() => leads.id), partnerId: uuid('partner_id').notNull().references(() => partners.id), amount: integer('amount'), rate: real('rate'), status: commissionStatusEnum('status').notNull().default('pending'), createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
