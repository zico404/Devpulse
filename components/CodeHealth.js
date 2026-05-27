import { useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import HealthScore from "./HealthScore";

const SEVERITY_CONFIG = {
  high:   { color: "border-l-red-500/60", badge: "badge-red" },
  medium: { color: "border-l-yellow-500/60", badge: "badge-yellow" },
  low:    { color: "border-l-accent-500/60", badge: "badge-blue" },
  info:   { color: "border-l-dark-400/40", badge: "badge-purple" },
};

const TYPE_LABELS = { issue: "Issue", warning: "Warning", insight: "Insight" };

function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.info;

  return (
    <div
      className={`group relative border-l-2 ${config.color} rounded-r-2xl bg-dark-800/40 hover:bg-dark-800/70 transition-all duration-200 cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className={`shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
              finding.severity === "high" ? "bg-red-500/10" :
              finding.severity === "medium" ? "bg-yellow-500/10" :
              finding.severity === "low" ? "bg-accent-500/10" : "bg-dark-600/50"
            }`}>
              {finding.severity === "high" ? "❗" :
               finding.severity === "medium" ? "⚠️" :
               finding.severity === "low" ? "ℹ️" : "💡"}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-dark-100">{finding.title}</span>
                <span className={`badge text-[10px] ${config.badge}`}>{TYPE_LABELS[finding.type] || finding.type}</span>
              </div>
              <p className="text-xs text-dark-400 mt-1 line-clamp-2 leading-relaxed">{finding.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {finding.count && (
              <span className="text-xs text-dark-400 bg-dark-700/70 px-2.5 py-1 rounded-lg tabular-nums font-medium">{finding.count}x</span>
            )}
            <button className="p-1 text-dark-500 hover:text-dark-300 transition-colors">
              <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-dark-600/30 animate-slide-down space-y-3">
            <p className="text-sm text-dark-300 leading-relaxed">{finding.description}</p>
            {finding.files && (
              <div>
                <span className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider">Affected files</span>
                <div className="mt-2 space-y-1.5">
                  {finding.files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-dark-400 font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full ${finding.severity === "high" ? "bg-red-500" : finding.severity === "medium" ? "bg-yellow-500" : finding.severity === "low" ? "bg-accent-500" : "bg-dark-400"} shrink-0`} />
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CodeHealth({ codeHealth }) {
  if (!codeHealth) return null;

  const { findings = [], score } = codeHealth;
  const issues = findings.filter((f) => f.type === "issue");
  const warnings = findings.filter((f) => f.type === "warning");
  const insights = findings.filter((f) => f.type === "insight");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <ShieldCheckIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Code Health</h2>
            <p className="text-sm text-dark-400/80">Analysis of code quality and potential issues</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/5 text-red-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {issues.length} Issues
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/5 text-yellow-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {warnings.length} Warnings
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-500/5 text-accent-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-500" />
            {insights.length} Insights
          </span>
        </div>
      </div>

      {findings.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-pulse-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="w-7 h-7 text-pulse-400" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-1">Clean bill of health</h3>
          <p className="text-sm text-dark-400">No issues or warnings found in this repository</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-2">
          {findings.map((finding, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
              <FindingCard finding={finding} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <HealthScore score={score} />

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 rounded-full bg-accent-500" />
              <h3 className="text-sm font-semibold text-dark-200">Analysis Summary</h3>
            </div>
            <div className="space-y-3">
              <Row label="Files Analyzed" value={codeHealth.filesAnalyzed?.toLocaleString()} />
              <Row label="Total Lines" value={codeHealth.totalLines?.toLocaleString()} />
              <div className="divider my-2" />
              <Row label="Issues Found" value={issues.length} color="text-red-400" />
              <Row label="Warnings" value={warnings.length} color="text-yellow-400" />
              <Row label="Insights" value={insights.length} color="text-accent-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-dark-400 font-medium">{label}</span>
      <span className={`font-semibold tabular-nums ${color || "text-dark-200"}`}>{value}</span>
    </div>
  );
}
