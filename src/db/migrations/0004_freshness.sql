ALTER TABLE "items" ADD COLUMN "last_verified_at" timestamptz;
ALTER TABLE "items" ADD COLUMN "next_review_at" timestamptz;
CREATE INDEX "items_next_review_idx" ON "items" ("next_review_at");
