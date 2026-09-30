import { pgTable, serial, text, timestamp, integer, doublePrecision, boolean, index } from "drizzle-orm/pg-core";

export const reports = pgTable(
  "reports",
  {
    pk: serial().primaryKey(),
    id: text().notNull().unique(),
    eventType: text("event_type").notNull(),
    text: text(),
    source: text(),
    sourceLabel: text("source_label"),
    location: text(),
    city: text(),
    state: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    credibilityScore: integer("credibility_score"),
    // verified | pending | suspicious | rejected
    verificationStatus: text("verification_status").notNull().default("pending"),
    // LOW | MODERATE | HIGH | SEVERE | EXTREME
    severity: text(),
    timestamp: timestamp({ withTimezone: true }).notNull().defaultNow(),
    hasImage: boolean("has_image").notNull().default(false),
    duplicateGroup: text("duplicate_group"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reports_timestamp_idx").on(t.timestamp),
    index("reports_status_idx").on(t.verificationStatus),
    index("reports_event_type_idx").on(t.eventType),
  ],
);

export const events = pgTable(
  "events",
  {
    pk: serial().primaryKey(),
    id: text().notNull().unique(),
    eventType: text("event_type"),
    location: text(),
    city: text(),
    state: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    severity: text(),
    confidence: integer(),
    reportCount: integer("report_count").notNull().default(0),
    sourceCount: integer("source_count").notNull().default(0),
    // verified | active | monitoring
    status: text(),
    startTime: timestamp("start_time", { withTimezone: true }),
    lastUpdated: timestamp("last_updated", { withTimezone: true }),
    // Report IDs belonging to this event
    reports: text().array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_report_count_idx").on(t.reportCount)],
);
