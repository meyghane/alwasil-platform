CREATE TABLE "scrape_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_type" text DEFAULT 'claude-routine' NOT NULL,
	"tokens_used" integer,
	"items_found" integer DEFAULT 0 NOT NULL,
	"items_inserted" integer DEFAULT 0 NOT NULL,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL
);
