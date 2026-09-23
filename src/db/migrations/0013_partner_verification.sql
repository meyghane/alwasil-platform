ALTER TABLE partners ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS verified_at timestamptz;
