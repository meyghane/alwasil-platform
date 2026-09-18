BEGIN;
ALTER TYPE moderation_action ADD VALUE IF NOT EXISTS 'edited';
ALTER TYPE moderation_action ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE moderation_action ADD VALUE IF NOT EXISTS 'reverification_requested';
ALTER TYPE moderation_action ADD VALUE IF NOT EXISTS 'deleted';
COMMIT;
