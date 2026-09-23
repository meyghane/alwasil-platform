ALTER TABLE partners ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS agreement_status text NOT NULL DEFAULT 'unconfirmed';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS anonymized_at timestamptz;
CREATE TABLE IF NOT EXISTS lead_email_deliveries (
  dedupe_key text PRIMARY KEY, lead_id uuid NOT NULL REFERENCES leads(id),
  recipient_type text NOT NULL CHECK (recipient_type IN ('client','partner')),
  provider_id text, result text NOT NULL DEFAULT 'claimed', error_code text,
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE TABLE IF NOT EXISTS retention_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), mode text NOT NULL,
  lead_count integer NOT NULL, submission_count integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
