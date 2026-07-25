CREATE TYPE "public"."category" AS ENUM('event', 'job', 'solidarity', 'institute', 'health', 'library', 'pool', 'hajj');--> statement-breakpoint
CREATE TYPE "public"."moderation_action" AS ENUM('approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "category" NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"city" text,
	"department" text,
	"region" text,
	"date_start" timestamp with time zone,
	"date_end" timestamp with time zone,
	"source" text NOT NULL,
	"source_url" text,
	"tags" text[],
	"is_spam" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"action" "moderation_action" NOT NULL,
	"actor" text NOT NULL,
	"acted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"min_items_threshold" integer DEFAULT 15 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_region_regions_code_fk" FOREIGN KEY ("region") REFERENCES "public"."regions"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_log" ADD CONSTRAINT "moderation_log_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;