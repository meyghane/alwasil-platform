ALTER TABLE leads ADD COLUMN IF NOT EXISTS ticket_reference text;
CREATE UNIQUE INDEX IF NOT EXISTS leads_ticket_reference_idx ON leads (ticket_reference) WHERE ticket_reference IS NOT NULL;
