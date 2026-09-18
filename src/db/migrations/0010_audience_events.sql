CREATE TABLE IF NOT EXISTS "audience_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_type" text NOT NULL DEFAULT 'page_view',
  "path" text NOT NULL,
  "slot" text,
  "referrer" text,
  "consent" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "audience_events_path_idx" ON "audience_events" ("path");
CREATE INDEX IF NOT EXISTS "audience_events_created_at_idx" ON "audience_events" ("created_at");
