BEGIN;
CREATE TABLE IF NOT EXISTS scrape_category_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL,
  category text NOT NULL,
  model_calls integer NOT NULL DEFAULT 0,
  tokens_used integer NOT NULL DEFAULT 0,
  items_found integer NOT NULL DEFAULT 0,
  items_inserted integer NOT NULL DEFAULT 0,
  quota_errors integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS scrape_category_usage_day_idx ON scrape_category_usage(category, created_at);
COMMIT;
