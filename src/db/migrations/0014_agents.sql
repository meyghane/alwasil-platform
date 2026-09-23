CREATE TABLE IF NOT EXISTS agent_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), url text NOT NULL UNIQUE,
  category text NOT NULL, departments text[] NOT NULL DEFAULT '{}',
  trust text NOT NULL DEFAULT 'pending' CHECK (trust IN ('pending','trusted','blocked')),
  official boolean NOT NULL DEFAULT false, evidence text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), run_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'running', report jsonb NOT NULL DEFAULT '{}',
  started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE TABLE IF NOT EXISTS agent_item_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), item_id uuid NOT NULL REFERENCES items(id),
  action text NOT NULL, actor text NOT NULL, before_snapshot jsonb,
  after_snapshot jsonb NOT NULL, reasons jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(), rollback_until timestamptz NOT NULL DEFAULT now() + interval '7 days'
);
CREATE UNIQUE INDEX IF NOT EXISTS items_agent_identity_idx ON items ((metadata->>'agentIdentity')) WHERE metadata->>'agentIdentity' IS NOT NULL;
CREATE TABLE IF NOT EXISTS agent_source_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES agent_sources(id),
  actor text NOT NULL, before_snapshot jsonb, after_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
