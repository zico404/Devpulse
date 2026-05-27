import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");
const MAX_EVENTS = 10000;

function readStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return { events: [] };
}

function writeStore(store) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store), "utf-8");
  } catch {}
}

export function trackEvent({ type, ip, userAgent, url, metadata = {} }) {
  const store = readStore();
  const event = {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    ip: ip || "unknown",
    userAgent: userAgent || "unknown",
    url: url || "unknown",
    metadata,
  };
  store.events.push(event);
  if (store.events.length > MAX_EVENTS) {
    store.events = store.events.slice(-MAX_EVENTS);
  }
  writeStore(store);
  return event;
}

export function getAnalytics(timeRange = "24h") {
  const store = readStore();
  const now = Date.now();
  const ranges = { "1h": 3600000, "24h": 86400000, "7d": 604800000, "30d": 2592000000 };
  const windowMs = ranges[timeRange] || ranges["24h"];
  const cutoff = new Date(now - windowMs).toISOString();

  const filtered = store.events.filter((e) => e.timestamp >= cutoff);

  const pageViews = filtered.filter((e) => e.type === "page_view").length;
  const repoSearches = filtered.filter((e) => e.type === "repo_search");
  const errors = filtered.filter((e) => e.type === "error");
  const sectionViews = filtered.filter((e) => e.type === "section_view");

  const uniqueIPs = new Set(filtered.map((e) => e.ip));
  const uniqueRepos = new Set(
    repoSearches.map((e) => e.metadata?.repo).filter(Boolean)
  );

  const repoBreakdown = {};
  for (const s of repoSearches) {
    const name = s.metadata?.repo || "unknown";
    repoBreakdown[name] = (repoBreakdown[name] || 0) + 1;
  }

  const hourlyBuckets = {};
  for (const e of filtered) {
    const hour = e.timestamp.slice(0, 13);
    hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1;
  }

  const timeline = Object.entries(hourlyBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({ hour, count }));

  return {
    summary: {
      pageViews,
      repoSearches: repoSearches.length,
      uniqueIPs: uniqueIPs.size,
      uniqueRepos: uniqueRepos.size,
      errors: errors.length,
      sectionViews: sectionViews.length,
      totalEvents: filtered.length,
    },
    timeline,
    repoBreakdown: Object.entries(repoBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([repo, count]) => ({ repo, count })),
    recentActivity: filtered.slice(-50).reverse(),
    errors: errors.slice(-20).reverse(),
  };
}

export function getEvents(limit = 100) {
  const store = readStore();
  return store.events.slice(-limit).reverse();
}
