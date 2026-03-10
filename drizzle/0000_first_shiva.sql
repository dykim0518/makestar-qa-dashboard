CREATE TABLE "tc_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tc_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"source_id" uuid,
	"requirement_key" text,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"priority" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tc_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"source_ref" text NOT NULL,
	"source_title" text,
	"source_status" text DEFAULT 'collected' NOT NULL,
	"raw_content" jsonb,
	"extracted_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_cases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_cases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"run_id" bigint NOT NULL,
	"title" text NOT NULL,
	"file" text,
	"project" text,
	"status" text NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"error_stack" text
);
--> statement-breakpoint
CREATE TABLE "test_runs" (
	"run_id" bigint PRIMARY KEY NOT NULL,
	"suite" text NOT NULL,
	"status" text NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"passed" integer DEFAULT 0 NOT NULL,
	"failed" integer DEFAULT 0 NOT NULL,
	"flaky" integer DEFAULT 0 NOT NULL,
	"skipped" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"triggered_by" text DEFAULT 'push' NOT NULL,
	"commit_sha" text,
	"branch" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tc_requirements" ADD CONSTRAINT "tc_requirements_project_id_tc_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."tc_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tc_requirements" ADD CONSTRAINT "tc_requirements_source_id_tc_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."tc_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tc_sources" ADD CONSTRAINT "tc_sources_project_id_tc_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."tc_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_run_id_test_runs_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."test_runs"("run_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tc_projects_owner_user" ON "tc_projects" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "idx_tc_requirements_project" ON "tc_requirements" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_tc_requirements_source" ON "tc_requirements" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_tc_sources_project" ON "tc_sources" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_tc_sources_type" ON "tc_sources" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "idx_test_cases_run_id" ON "test_cases" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_test_cases_status" ON "test_cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_test_runs_suite" ON "test_runs" USING btree ("suite");--> statement-breakpoint
CREATE INDEX "idx_test_runs_created_at" ON "test_runs" USING btree ("created_at");