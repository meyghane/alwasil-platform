ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS domain text;
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS adapter text NOT NULL DEFAULT 'jsonld-v1';
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS authorized_at timestamptz;
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS last_checked_at timestamptz;
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS run_count integer NOT NULL DEFAULT 0;
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS error_count integer NOT NULL DEFAULT 0;
ALTER TABLE agent_sources ADD COLUMN IF NOT EXISTS last_error_code text;
ALTER TABLE telegram_deliveries ADD COLUMN IF NOT EXISTS error_code text;
