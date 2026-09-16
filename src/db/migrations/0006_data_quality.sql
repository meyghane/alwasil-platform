BEGIN;
ALTER TABLE items ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;
ALTER TABLE items ADD COLUMN IF NOT EXISTS next_review_at timestamptz;
UPDATE items SET next_review_at = now() WHERE next_review_at IS NULL AND status IN ('pending', 'approved');
-- Unknown historical verification dates remain NULL: collection is not verification.
CREATE TABLE IF NOT EXISTS automation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL,
  code text NOT NULL,
  item_id uuid REFERENCES items(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS automation_errors_created_idx ON automation_errors(created_at);
CREATE INDEX IF NOT EXISTS items_next_review_idx ON items(next_review_at);
COMMIT;
