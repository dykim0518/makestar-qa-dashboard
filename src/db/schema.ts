import {
  pgTable,
  text,
  integer,
  bigint,
  timestamp,
  index,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const testRuns = pgTable(
  "test_runs",
  {
    runId: bigint("run_id", { mode: "number" }).primaryKey(),
    suite: text("suite").notNull(), // cmr | albumbuddy | admin | all
    status: text("status").notNull(), // passed | failed | cancelled
    total: integer("total").notNull().default(0),
    passed: integer("passed").notNull().default(0),
    failed: integer("failed").notNull().default(0),
    flaky: integer("flaky").notNull().default(0),
    skipped: integer("skipped").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    triggeredBy: text("triggered_by").notNull().default("push"),
    commitSha: text("commit_sha"),
    branch: text("branch"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_test_runs_suite").on(table.suite),
    index("idx_test_runs_created_at").on(table.createdAt),
  ]
);

export const testCases = pgTable(
  "test_cases",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    runId: bigint("run_id", { mode: "number" })
      .notNull()
      .references(() => testRuns.runId, { onDelete: "cascade" }),
    title: text("title").notNull(),
    file: text("file"),
    project: text("project"),
    status: text("status").notNull(), // passed | failed | flaky | skipped
    durationMs: integer("duration_ms").notNull().default(0),
    errorMessage: text("error_message"),
    errorStack: text("error_stack"),
    errorCategory: text("error_category"),
  },
  (table) => [
    index("idx_test_cases_run_id").on(table.runId),
    index("idx_test_cases_status").on(table.status),
  ]
);

export const tcProjects = pgTable(
  "tc_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    ownerUserId: text("owner_user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_tc_projects_owner_user").on(table.ownerUserId)]
);

export const tcSources = pgTable(
  "tc_sources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => tcProjects.id, { onDelete: "cascade" }),
    sourceType: text("source_type").notNull(), // notion | pdf | figma | google_sheet_template
    sourceRef: text("source_ref").notNull(),
    sourceTitle: text("source_title"),
    sourceStatus: text("source_status").notNull().default("collected"), // collected | normalized | failed
    rawContent: jsonb("raw_content"),
    extractedText: text("extracted_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_tc_sources_project").on(table.projectId),
    index("idx_tc_sources_type").on(table.sourceType),
  ]
);

export const tcRequirements = pgTable(
  "tc_requirements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => tcProjects.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id").references(() => tcSources.id, {
      onDelete: "set null",
    }),
    requirementKey: text("requirement_key"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    tags: text("tags").array().notNull().default([]),
    priority: text("priority"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_tc_requirements_project").on(table.projectId),
    index("idx_tc_requirements_source").on(table.sourceId),
  ]
);

export const tcTemplateProfiles = pgTable(
  "tc_template_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => tcProjects.id, { onDelete: "cascade" }),
    sourceRef: text("source_ref"),
    name: text("name").notNull(),
    status: text("status").notNull().default("draft"), // draft | approved
    headerRowIndex: integer("header_row_index").notNull(),
    columnMapping: jsonb("column_mapping").notNull(),
    styleProfile: jsonb("style_profile").notNull(),
    previewRows: jsonb("preview_rows"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_tc_template_profiles_project").on(table.projectId),
    index("idx_tc_template_profiles_status").on(table.status),
  ]
);

export type TestRun = typeof testRuns.$inferSelect;
export type NewTestRun = typeof testRuns.$inferInsert;
export type TestCase = typeof testCases.$inferSelect;
export type NewTestCase = typeof testCases.$inferInsert;
export type TcProject = typeof tcProjects.$inferSelect;
export type NewTcProject = typeof tcProjects.$inferInsert;
export type TcSource = typeof tcSources.$inferSelect;
export type NewTcSource = typeof tcSources.$inferInsert;
export type TcRequirement = typeof tcRequirements.$inferSelect;
export type NewTcRequirement = typeof tcRequirements.$inferInsert;
export type TcTemplateProfile = typeof tcTemplateProfiles.$inferSelect;
export type NewTcTemplateProfile = typeof tcTemplateProfiles.$inferInsert;
