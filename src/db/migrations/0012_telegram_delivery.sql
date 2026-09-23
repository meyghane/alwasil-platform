CREATE TABLE IF NOT EXISTS telegram_deliveries (
  dedupe_key text PRIMARY KEY,
  item_id uuid REFERENCES items(id),
  update_id bigint,
  source text NOT NULL,
  recipient text NOT NULL,
  notification_type text NOT NULL,
  result text NOT NULL DEFAULT 'claimed',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS telegram_deliveries_item_idx ON telegram_deliveries(item_id);
