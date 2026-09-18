ALTER TABLE moderation_log ADD COLUMN IF NOT EXISTS previous_status text;
ALTER TABLE moderation_log ADD COLUMN IF NOT EXISTS new_status text;
