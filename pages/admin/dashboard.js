import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";

function AnimatedValue({ value, suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    let raf;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString()}{suffix}</>;
}

const CARD_COLORS = {
  accent: { wrap: "ring-accent-500/20 bg-accent-500/10 group-hover:bg-accent-500/15", icon: "text-accent-400" },
  pulse: { wrap: "ring-pulse-500/20 bg-pulse-500/10 group-hover:bg-pulse-500/15", icon: "text-pulse-400" },
  purple: { wrap: "ring-purple-500/20 bg-purple-500/10 group-hover:bg-purple-500/15", icon: "text-purple-400" },
  red: { wrap: "ring-red-500/20 bg-red-500/10 group-hover:bg-red-500/15", icon: "text-red-400" },
};

function StatCard({ label, value, icon, color, trend }) {
  const cc = CARD_COLORS[color] || CARD_COLORS.accent;
  return (
    <div className="card card-hover p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-colors ${cc.wrap}`}>
          <svg className={`w-5 h-5 ${cc.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {icon}
          </svg>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? "text-pulse-400" : "text-red-400"} flex items-center gap-0.5`}>
            <svg className={`w-3 h-3 ${trend >= 0 ? "" : "rotate-180"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-white tabular-nums mb-1">
        <AnimatedValue value={value} />
      </p>
      <p className="text-xs text-dark-400 font-medium">{label}</p>
    </div>
  );
}

const BAR_COLORS = {
  accent: "bg-accent-500",
  pulse: "bg-pulse-500",
};

function MiniBar({ value, max, color = "accent" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min((value / max) * 100, 100)), 100);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className="w-full h-1.5 rounded-full bg-dark-700/60 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${BAR_COLORS[color] || BAR_COLORS.accent}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function ActivityChart({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-dark-500 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1 h-48 pt-2">
      {data.map((point, i) => {
        const height = (point.count / maxCount) * 100;
        const isHigh = point.count >= maxCount * 0.8;
        return (
          <div key={point.hour} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            <span className="text-[10px] text-dark-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
              {point.count}
            </span>
            <div
              className={`w-full rounded-t-md transition-all duration-700 ease-out cursor-pointer
                ${isHigh ? "bg-gradient-to-t from-accent-500 to-accent-400" : "bg-accent-500/40 hover:bg-accent-500/60"}
                ${point.count > 0 ? "min-h-[4px]" : ""}
              `}
              style={{ height: `${Math.max(height, 0.5)}%` }}
            >
              <div className="absolute inset-0 bg-accent-400/0 group-hover:bg-accent-400/10 transition-colors rounded-t-md" />
            </div>
            <span className="text-[9px] text-dark-500 mt-1 truncate w-full text-center font-mono">
              {point.hour.slice(-2)}h
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RepoBreakdown({ repos }) {
  const maxCount = Math.max(...repos.map((r) => r.count), 1);

  if (repos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
        No repository searches yet
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {repos.slice(0, 10).map((r, i) => (
        <div key={r.repo} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-dark-200 truncate flex items-center gap-2">
              <span className="w-4 text-[10px] text-dark-500 font-mono">{i + 1}</span>
              {r.repo}
            </span>
            <span className="text-xs font-mono text-dark-400 tabular-nums">{r.count}</span>
          </div>
          <MiniBar value={r.count} max={maxCount} color={i === 0 ? "accent" : "pulse"} />
        </div>
      ))}
    </div>
  );
}

function ActivityFeed({ activities }) {
  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.slice(0, 30).map((a) => {
        const typeColors = {
          page_view: { dot: "bg-accent-500", label: "Page View", icon: "○" },
          repo_search: { dot: "bg-pulse-500", label: "Repo Search", icon: "◆" },
          section_view: { dot: "bg-yellow-500", label: "Section View", icon: "▣" },
          error: { dot: "bg-red-500", label: "Error", icon: "▲" },
        };
        const tc = typeColors[a.type] || { dot: "bg-dark-500", label: a.type, icon: "●" };
        const time = new Date(a.timestamp);
        const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        return (
          <div key={a.id} className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-dark-700/30 transition-colors group">
            <div className="flex flex-col items-center gap-0.5">
              <span className={`w-2 h-2 rounded-full ${tc.dot} mt-1.5`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-dark-200">{tc.label}</span>
                {a.metadata?.repo && (
                  <span className="text-[10px] font-mono text-accent-400 truncate">{a.metadata.repo}</span>
                )}
              </div>
              <p className="text-[10px] text-dark-500 font-mono mt-0.5 truncate">
                {a.metadata?.section && `${a.metadata.section} · `}
                {a.ip !== "unknown" && `${a.ip} · `}
                {timeStr}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ErrorList({ errors }) {
  if (errors.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-dark-500 text-sm">
        No errors recorded
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {errors.map((e) => (
        <div key={e.id} className="flex items-start gap-3 py-2 px-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-red-300">{e.metadata?.message || "Unknown error"}</p>
            <p className="text-[10px] text-dark-500 font-mono mt-0.5">
              {new Date(e.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimeRangeSelector({ value, onChange }) {
  const ranges = [
    { value: "1h", label: "1H" },
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
  ];
  return (
    <div className="flex gap-1 bg-dark-800/80 rounded-xl p-1 border border-dark-600/30">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            value === r.value
              ? "bg-accent-500/20 text-accent-400 shadow-sm"
              : "text-dark-400 hover:text-dark-200"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-10 w-10 rounded-xl mb-3" />
            <div className="skeleton h-8 w-24 mb-1" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="skeleton h-5 w-32 mb-6" />
          <div className="skeleton h-48 w-full rounded-xl" />
        </div>
        <div className="card p-6">
          <div className="skeleton h-5 w-28 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton h-3 w-full mb-1" />
                <div className="skeleton h-1.5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = useCallback(async (range) => {
    let token;
    try { token = sessionStorage.getItem("admin_token"); } catch {}
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    try {
      const res = await fetch(`/api/analytics/logs?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const d = await res.json();
      setData(d);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    fetchData(timeRange);
    const interval = setInterval(() => fetchData(timeRange), 15000);
    return () => clearInterval(interval);
  }, [mounted, timeRange, fetchData]);

  const handleLogout = () => {
    setLoggingOut(true);
    try { sessionStorage.removeItem("admin_token"); } catch {}
    document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Strict";
    router.push("/admin/login");
  };

  const handleRangeChange = (range) => {
    setTimeRange(range);
    setLoading(true);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <header className="relative z-20 border-b border-dark-600/20 bg-dark-900/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center ring-1 ring-accent-500/15">
                <span className="text-xs font-bold text-accent-400">D</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">DevPulse</h1>
                <p className="text-[10px] text-dark-400 font-medium -mt-0.5">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="relative flex items-center gap-2">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-pulse-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-pulse-500" />
                </span>
                <span className="text-[11px] text-dark-400 hidden sm:inline font-medium">Live</span>
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn btn-ghost h-8 px-3 text-xs disabled:opacity-50"
              >
                {loggingOut ? "..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {!data && loading ? (
            <LoadingSkeleton />
          ) : data ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Analytics Overview</h2>
                  <p className="text-xs text-dark-400 mt-0.5">
                    {data.summary.totalEvents} events recorded in the selected period
                  </p>
                </div>
                <TimeRangeSelector value={timeRange} onChange={handleRangeChange} />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                  label="Page Views"
                  value={data.summary.pageViews}
                  color="accent"
                  icon={<><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></>}
                />
                <StatCard
                  label="Repo Searches"
                  value={data.summary.repoSearches}
                  color="pulse"
                  icon={<><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></>}
                />
                <StatCard
                  label="Unique Visitors"
                  value={data.summary.uniqueIPs}
                  color="purple"
                  icon={<><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></>}
                />
                <StatCard
                  label="Errors"
                  value={data.summary.errors}
                  color="red"
                  icon={<><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></>}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white">Activity Timeline</h3>
                    <span className="text-[10px] text-dark-500 font-mono">{data.timeline.length} data points</span>
                  </div>
                  <ActivityChart data={data.timeline} />
                </div>

                <div className="card p-4 sm:p-6">
                  <h3 className="text-sm font-bold text-white mb-5">Top Repositories</h3>
                  <RepoBreakdown repos={data.repoBreakdown} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Recent Activity</h3>
                    <span className="text-[10px] text-dark-500 font-mono">
                      {data.recentActivity.length} events
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto hide-scrollbar -mx-2">
                    <ActivityFeed activities={data.recentActivity} />
                  </div>
                </div>

                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Error Log</h3>
                    <span className="text-[10px] text-dark-500 font-mono">
                      {data.errors.length} errors
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto hide-scrollbar -mx-2">
                    <ErrorList errors={data.errors} />
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Summary</h3>
                  <span className="text-[10px] text-dark-500 font-mono">All time</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: "Unique Repos", value: data.summary.uniqueRepos },
                    { label: "Section Views", value: data.summary.sectionViews },
                    { label: "Total Events", value: data.summary.totalEvents },
                    { label: "Unique IPs", value: data.summary.uniqueIPs },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-dark-800/40 border border-dark-600/20">
                      <p className="text-lg font-extrabold text-white tabular-nums">
                        <AnimatedValue value={s.value} />
                      </p>
                      <p className="text-[10px] text-dark-400 font-medium mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="skeleton h-12 w-12 rounded-2xl mx-auto mb-4" />
                <p className="text-dark-400 text-sm">Failed to load analytics data</p>
                <button
                  onClick={() => { setLoading(true); fetchData(timeRange); }}
                  className="btn btn-secondary mt-4 text-xs"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-dark-600/20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-[11px] text-dark-500 text-center">
            DevPulse Admin &middot; Data is stored locally and never sent to third parties
          </p>
        </div>
      </footer>
    </div>
  );
}
