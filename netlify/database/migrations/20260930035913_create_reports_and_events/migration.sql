CREATE TABLE "events" (
	"pk" serial PRIMARY KEY,
	"id" text NOT NULL UNIQUE,
	"event_type" text,
	"location" text,
	"city" text,
	"state" text,
	"latitude" double precision,
	"longitude" double precision,
	"severity" text,
	"confidence" integer,
	"report_count" integer DEFAULT 0 NOT NULL,
	"source_count" integer DEFAULT 0 NOT NULL,
	"status" text,
	"start_time" timestamp with time zone,
	"last_updated" timestamp with time zone,
	"reports" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"pk" serial PRIMARY KEY,
	"id" text NOT NULL UNIQUE,
	"event_type" text NOT NULL,
	"text" text,
	"source" text,
	"source_label" text,
	"location" text,
	"city" text,
	"state" text,
	"latitude" double precision,
	"longitude" double precision,
	"credibility_score" integer,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"severity" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"has_image" boolean DEFAULT false NOT NULL,
	"duplicate_group" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "events_report_count_idx" ON "events" ("report_count");--> statement-breakpoint
CREATE INDEX "reports_timestamp_idx" ON "reports" ("timestamp");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" ("verification_status");--> statement-breakpoint
CREATE INDEX "reports_event_type_idx" ON "reports" ("event_type");