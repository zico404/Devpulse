import { useState, useMemo } from "react";
import { CubeIcon } from "@heroicons/react/24/outline";

function RiskBadge({ risk }) {
  const config = { high: "badge-red", medium: "badge-yellow", low: "badge-green" };
  return <span className={`badge text-[10px] font-semibold ${config[risk] || "badge-green"}`}>{risk}</span>;
}

function DependencyItem({ dep }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-dark-800/50 transition-colors gap-3 group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg bg-dark-700/50 flex items-center justify-center text-xs text-dark-400 font-mono font-bold group-hover:bg-dark-700 transition-colors">
          {dep.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-dark-200 truncate">{dep.name}</span>
            <span className="text-xs text-dark-500 font-mono">v{dep.version}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-medium text-dark-500 uppercase tracking-wider">{dep.type}</span>
            {dep.outdated && (
              <span className="text-[10px] text-yellow-400/80 font-mono">→ v{dep.latest}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <RiskBadge risk={dep.risk} />
        {dep.outdated && (
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-sm shadow-yellow-400/30 shrink-0" />
        )}
      </div>
    </div>
  );
}

export default function Dependencies({ codeHealth }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const deps = codeHealth?.dependencies || [];

  const filtered = useMemo(() => {
    let result = [...deps];
    if (filter === "outdated") result = result.filter((d) => d.outdated);
    if (filter === "risky") result = result.filter((d) => d.risk === "high" || d.risk === "medium");
    if (filter === "production") result = result.filter((d) => d.type === "production");
    if (filter === "dev") result = result.filter((d) => d.type === "dev");
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.risk] || 2) - (order[b.risk] || 2);
    });
    return result;
  }, [deps, filter, sortBy]);

  if (!deps.length) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <CubeIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Dependencies</h2>
            <p className="text-sm text-dark-400/80">Track and manage package dependencies</p>
          </div>
        </div>
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
            <CubeIcon className="w-7 h-7 text-dark-400" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-1">No data available</h3>
          <p className="text-sm text-dark-400">Dependency information is not available for this repository</p>
        </div>
      </div>
    );
  }

  const outdatedCount = deps.filter((d) => d.outdated).length;
  const riskyCount = deps.filter((d) => d.risk === "high" || d.risk === "medium").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <CubeIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Dependencies</h2>
            <p className="text-sm text-dark-400/80">{deps.length} packages tracked</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {outdatedCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-yellow-500/5 text-yellow-400 font-medium">{outdatedCount} outdated</span>
          )}
          {riskyCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-red-500/5 text-red-400 font-medium">{riskyCount} risky</span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-1 bg-dark-800/60 rounded-xl p-1 border border-dark-600/30 overflow-x-auto hide-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "production", label: "Production" },
            { id: "dev", label: "Dev" },
            { id: "outdated", label: `Outdated (${outdatedCount})` },
            { id: "risky", label: `Risky (${riskyCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === f.id ? "bg-accent-600 text-white shadow-sm" : "text-dark-400 hover:text-dark-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-dark-800/60 border border-dark-600/30 rounded-xl text-xs text-dark-200 px-3.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500/25 focus:border-accent-500/50"
        >
          <option value="name">Sort by Name</option>
          <option value="risk">Sort by Risk</option>
        </select>
      </div>

      <div className="card divide-y divide-dark-600/20 p-2">
        {filtered.length > 0 ? (
          filtered.map((dep) => <DependencyItem key={dep.name} dep={dep} />)
        ) : (
          <div className="py-10 text-center text-sm text-dark-400">No dependencies match this filter</div>
        )}
      </div>

      {riskyCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-300">Security risk detected</p>
              <p className="text-xs text-dark-400 mt-1 leading-relaxed">
                {riskyCount} package{riskyCount > 1 ? "s" : ""} flagged with medium or high risk.
                Update to latest versions to patch known vulnerabilities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
