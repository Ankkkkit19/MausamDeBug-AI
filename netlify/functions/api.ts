/**
 * MausamDeBug API — backed by Netlify Database (Postgres via Drizzle ORM).
 * Replaces the former Express + MongoDB server in /backend.
 */
import type { Config } from "@netlify/functions";
import { and, count, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import { events, reports } from "../../db/schema.js";
import { MOCK_EVENTS, MOCK_REPORTS } from "../../src/data/mockData.js";

const STATUSES = ["verified", "pending", "suspicious", "rejected"];
const SEVERITIES = ["LOW", "MODERATE", "HIGH", "SEVERE", "EXTREME"];

type ReportRow = typeof reports.$inferSelect;
type EventRow = typeof events.$inferSelect;

// ─── Serializers (keep the snake_case shape the frontend expects) ─────────────
function toReport(r: ReportRow) {
  return {
    id: r.id,
    event_type: r.eventType,
    text: r.text,
    source: r.source,
    source_label: r.sourceLabel,
    location: r.location,
    city: r.city,
    state: r.state,
    latitude: r.latitude,
    longitude: r.longitude,
    credibility_score: r.credibilityScore,
    verification_status: r.verificationStatus,
    severity: r.severity,
    timestamp: r.timestamp.toISOString(),
    minutes_ago: Math.max(0, Math.floor((Date.now() - r.timestamp.getTime()) / 60000)),
    has_image: r.hasImage,
    duplicate_group: r.duplicateGroup,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function toEvent(e: EventRow) {
  return {
    id: e.id,
    event_type: e.eventType,
    location: e.location,
    city: e.city,
    state: e.state,
    latitude: e.latitude,
    longitude: e.longitude,
    severity: e.severity,
    confidence: e.confidence,
    report_count: e.reportCount,
    source_count: e.sourceCount,
    status: e.status,
    start_time: e.startTime?.toISOString() ?? null,
    last_updated: e.lastUpdated?.toISOString() ?? null,
    reports: e.reports,
  };
}

// ─── Seeding: populate an empty database with demo data on first use ─────────
let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const [{ value }] = await db.select({ value: count() }).from(reports);
  if (value === 0) {
    await db
      .insert(reports)
      .values(
        MOCK_REPORTS.map((r: any) => ({
          id: r.id,
          eventType: r.event_type,
          text: r.text,
          source: r.source,
          sourceLabel: r.source_label,
          location: r.location,
          city: r.city,
          state: r.state,
          latitude: r.latitude,
          longitude: r.longitude,
          credibilityScore: r.credibility_score,
          verificationStatus: r.verification_status,
          severity: r.severity,
          timestamp: new Date(r.timestamp),
          hasImage: r.has_image,
          duplicateGroup: r.duplicate_group,
        })),
      )
      .onConflictDoNothing();
    await db
      .insert(events)
      .values(
        MOCK_EVENTS.map((e: any) => ({
          id: e.id,
          eventType: e.event_type,
          location: e.location,
          city: e.city,
          state: e.state,
          latitude: e.latitude,
          longitude: e.longitude,
          severity: e.severity,
          confidence: e.confidence,
          reportCount: e.report_count,
          sourceCount: e.source_count,
          status: e.status,
          startTime: new Date(e.start_time),
          lastUpdated: new Date(e.last_updated),
          reports: e.reports,
        })),
      )
      .onConflictDoNothing();
  }
  seeded = true;
}

const json = (data: unknown, status = 200) => Response.json(data, { status });
const notFound = (what: string) => json({ error: `${what} not found` }, 404);

// ─── Handlers ─────────────────────────────────────────────────────────────────
async function listReports(url: URL) {
  const p = url.searchParams;
  const status = p.get("status");
  const eventType = p.get("eventType");
  const source = p.get("source");
  const search = p.get("search");
  const limit = Math.min(Math.max(Number(p.get("limit")) || 100, 1), 500);
  const skip = Math.max(Number(p.get("skip")) || 0, 0);

  const conditions: SQL[] = [];
  if (status && status !== "all") conditions.push(eq(reports.verificationStatus, status));
  if (eventType && eventType !== "all") conditions.push(eq(reports.eventType, eventType));
  if (source && source !== "all") conditions.push(eq(reports.source, source));
  if (search) {
    const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(reports.text, pattern),
        ilike(reports.location, pattern),
        ilike(reports.city, pattern),
        ilike(reports.state, pattern),
      )!,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [[{ value: total }], rows] = await Promise.all([
    db.select({ value: count() }).from(reports).where(where),
    db.select().from(reports).where(where).orderBy(desc(reports.timestamp)).limit(limit).offset(skip),
  ]);
  return json({ total, reports: rows.map(toReport) });
}

async function getReport(id: string) {
  const [row] = await db.select().from(reports).where(eq(reports.id, id));
  return row ? json(toReport(row)) : notFound("Report");
}

async function createReport(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (!body?.event_type || typeof body.event_type !== "string") {
    return json({ error: "event_type is required" }, 400);
  }
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

  const [row] = await db
    .insert(reports)
    .values({
      id: `MSA-2026-${Date.now()}${Math.floor(Math.random() * 100)}`,
      eventType: body.event_type,
      text: str(body.text),
      source: str(body.source) ?? "citizen",
      sourceLabel: str(body.source_label) ?? "Citizen Report",
      location: str(body.location),
      city: str(body.city),
      state: str(body.state),
      latitude: num(body.latitude),
      longitude: num(body.longitude),
      credibilityScore: num(body.credibility_score) === null ? null : Math.round(body.credibility_score),
      verificationStatus: STATUSES.includes(body.verification_status) ? body.verification_status : "pending",
      severity: SEVERITIES.includes(body.severity) ? body.severity : null,
      timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
      hasImage: Boolean(body.has_image),
      duplicateGroup: str(body.duplicate_group),
    })
    .returning();
  return json(toReport(row), 201);
}

async function updateStatus(req: Request, id: string) {
  const body = await req.json().catch(() => ({}));
  if (!STATUSES.includes(body?.status)) return json({ error: "Invalid status" }, 400);
  const [row] = await db
    .update(reports)
    .set({ verificationStatus: body.status, updatedAt: new Date() })
    .where(eq(reports.id, id))
    .returning();
  return row ? json(toReport(row)) : notFound("Report");
}

async function listEvents() {
  const rows = await db.select().from(events).orderBy(desc(events.reportCount));
  return json({ total: rows.length, events: rows.map(toEvent) });
}

async function getEvent(id: string) {
  const [row] = await db.select().from(events).where(eq(events.id, id));
  return row ? json(toEvent(row)) : notFound("Event");
}

async function getStats() {
  const [byStatus, [{ value: activeEvents }]] = await Promise.all([
    db
      .select({ status: reports.verificationStatus, value: count() })
      .from(reports)
      .groupBy(reports.verificationStatus),
    db
      .select({ value: count() })
      .from(events)
      .where(inArray(events.status, ["verified", "active", "monitoring"])),
  ]);
  const counts = Object.fromEntries(byStatus.map((s) => [s.status, s.value]));
  const totalReports = byStatus.reduce((sum, s) => sum + s.value, 0);
  return json({
    totalReports,
    verified: counts.verified ?? 0,
    pending: counts.pending ?? 0,
    suspicious: counts.suspicious ?? 0,
    rejected: counts.rejected ?? 0,
    activeEvents,
    regionsMonitored: 28,
    dataQuality: 91.4,
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default async (req: Request) => {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const method = req.method;

  try {
    if (parts[0] === "health" && parts.length === 1 && method === "GET") {
      let dbState = "connected";
      try {
        await db.select({ value: count() }).from(events);
      } catch {
        dbState = "disconnected";
      }
      return json({ status: "ok", db: dbState, timestamp: new Date().toISOString() });
    }

    await ensureSeeded();

    if (parts[0] === "reports") {
      if (parts.length === 1 && method === "GET") return await listReports(url);
      if (parts.length === 1 && method === "POST") return await createReport(req);
      if (parts.length === 2 && method === "GET") return await getReport(parts[1]);
      if (parts.length === 3 && parts[2] === "status" && method === "PATCH") return await updateStatus(req, parts[1]);
    }
    if (parts[0] === "events") {
      if (parts.length === 1 && method === "GET") return await listEvents();
      if (parts.length === 2 && method === "GET") return await getEvent(parts[1]);
    }
    if (parts[0] === "stats" && parts.length === 1 && method === "GET") return await getStats();

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: "Internal server error" }, 500);
  }
};

export const config: Config = {
  path: ["/api", "/api/*"],
};
