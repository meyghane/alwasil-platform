CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  form_type text NOT NULL,
  ip_hash text NOT NULL,
  page text,
  campaign text,
  referrer text,
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'accepted',
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS form_submissions_fingerprint_idx ON form_submissions (fingerprint, created_at);
CREATE INDEX IF NOT EXISTS form_submissions_ip_idx ON form_submissions (ip_hash, created_at);
