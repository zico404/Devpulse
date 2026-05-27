import { useState, useMemo } from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";

function PriorityBadge({ priority }) {
  const config = { high: "badge-red", medium: "badge-yellow", low: "badge-green" };
  return <span className={`badge text-[10px] font-semibold ${config[priority] || "badge-green"}`}>{priority}</span>;
}

function EffortBadge({ effort }) {
  const config = { high: "badge-purple", medium: "badge-blue", low: "badge-green" };
  return <span className={`badge text-[10px] font-semibold ${config[effort] || config.low}`}>{effort} effort</span>;
}

export default function AISuggestions({ codeHealth }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const suggestions = codeHealth?.suggestions || [];

  const filtered = useMemo(() => {
    if (filter === "all") return suggestions;
    return suggestions.filter((s) => s.priority === filter);
  }, [suggestions, filter]);

  const priorityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    suggestions.forEach((s) => counts[s.priority]++);
    return counts;
  }, [suggestions]);

  if (!suggestions.length) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <LightBulbIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">AI Suggestions</h2>
            <p className="text-sm text-dark-400/80">Recommendations for improving code quality</p>
          </div>
        </div>
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
            <LightBulbIcon className="w-7 h-7 text-dark-400" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-1">No suggestions yet</h3>
          <p className="text-sm text-dark-400">AI-powered recommendations will appear here once available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <LightBulbIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">AI Suggestions</h2>
            <p className="text-sm text-dark-400/80">Recommendations for improving code quality</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-red-500/5 text-red-400 font-medium">{priorityCounts.high} high priority</span>
        </div>
      </div>

      <div className="flex gap-1 bg-dark-800/60 rounded-xl p-1 border border-dark-600/30 w-fit">
        {[
          { id: "all", label: "All" },
          { id: "high", label: `High (${priorityCounts.high})` },
          { id: "medium", label: `Medium (${priorityCounts.medium})` },
          { id: "low", label: `Low (${priorityCounts.low})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              filter === f.id ? "bg-accent-600 text-white shadow-sm" : "text-dark-400 hover:text-dark-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((sug, index) => (
            <div
              key={sug.id}
              className={`card card-hover animate-slide-up ${expanded === sug.id ? "border-accent-500/40" : ""}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  sug.priority === "high" ? "bg-red-500/10" :
                  sug.priority === "medium" ? "bg-yellow-500/10" : "bg-accent-500/10"
                }`}>
                  <span className="text-lg">
                    {sug.category === "architecture" ? "🏗️" :
                     sug.category === "reliability" ? "🔒" :
                     sug.category === "maintainability" ? "🔧" :
                     sug.category === "performance" ? "⚡" :
                     sug.category === "testing" ? "🧪" :
                     sug.category === "security" ? "🛡️" : "✨"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-dark-100">{sug.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <PriorityBadge priority={sug.priority} />
                        <EffortBadge effort={sug.effort} />
                        <span className="text-[10px] font-medium text-dark-500 capitalize">{sug.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === sug.id ? null : sug.id)}
                      className="shrink-0 w-7 h-7 rounded-lg bg-dark-700/50 flex items-center justify-center text-dark-400 hover:text-dark-200 hover:bg-dark-700 transition-colors"
                    >
                      <svg className={`w-4 h-4 transition-transform duration-200 ${expanded === sug.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {expanded === sug.id && (
                    <div className="mt-4 pt-4 border-t border-dark-600/30 animate-slide-down">
                      <p className="text-sm text-dark-300 leading-relaxed">{sug.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-10">
          <p className="text-sm text-dark-400">No suggestions for this priority level</p>
        </div>
      )}
    </div>
  );
}
