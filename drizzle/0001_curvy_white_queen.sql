CREATE TABLE "tc_template_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"source_ref" text,
	"name" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"header_row_index" integer NOT NULL,
	"column_mapping" jsonb NOT NULL,
	"style_profile" jsonb NOT NULL,
	"preview_rows" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tc_template_profiles" ADD CONSTRAINT "tc_template_profiles_project_id_tc_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."tc_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tc_template_profiles_project" ON "tc_template_profiles" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_tc_template_profiles_status" ON "tc_template_profiles" USING btree ("status");