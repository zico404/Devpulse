import { useState, useEffect } from "react";
import { StarIcon, ArrowPathRoundedSquareIcon, ExclamationTriangleIcon, ClockIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { formatRelativeTime } from "../utils/github";
import HealthScore from "./HealthScore";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card card-hover group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider">{label}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color || "text-dark-400"} bg-dark-700/50 group-hover:bg-dark-700 transition-colors`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function LanguageBar({ name, percent, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-dark-600/50" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-dark-200 font-medium truncate">{name}</span>
          <span className="text-dark-400 tabular-nums font-medium">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-dark-600/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          />
        </div>
      </div>
    </div>
  );
}

const LANG_COLORS = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572a5",
  CSS: "#563d7c", HTML: "#e34c26", Solidity: "#363636",
  Rust: "#dea584", Go: "#00add8", Java: "#b07219",
  Ruby: "#701516", SQL: "#e38c00", Kotlin: "#A97BFF",
  Swift: "#F05138", Dart: "#00B4AB", PHP: "#777BB4",
  C: "#555555", "C++": "#f34b7d", "C#": "#178600",
  Shell: "#89e051", Lua: "#000080", Scala: "#c22d40",
};

export default function Overview({ repoData, codeHealth }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!repoData) return null;

  const languages = repoData.languages || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card card-accent">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center text-lg shrink-0 ring-1 ring-accent-500/10">
                <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.253.611.566.633a48.194 48.194 0 004.666-.354 48.374 48.374 0 00-.642-5.056c-.023-.31.222-.57.532-.57v0c.31 0 .555.26.532.57a48.04 48.04 0 01.642 5.056 48.39 48.39 0 004.163-.3 48.04 48.04 0 00-.315-4.907.656.656 0 01.658-.663v0c.355 0 .676.186.959.401.29.221.634.349 1.003.349 1.036 0 1.875-1.007 1.875-2.25s-.84-2.25-1.875-2.25c-.369 0-.713.128-1.003.349-.283.215-.604.401-.959.401v0a.656.656 0 01-.658-.663 48.422 48.422 0 01.315-4.907 48.39 48.39 0 00-4.163.3.64.64 0 01-.657-.643v0c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.656.656 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.04 48.04 0 01-.642 5.056 48.39 48.39 0 004.163.3" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                    {repoData.name || repoData.full_name}
                  </h2>
                  <a
                    href={repoData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-dark-200 transition-colors shrink-0 hover:scale-110 active:scale-95"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                </div>
                {repoData.description && (
                  <p className="text-sm text-dark-400/80 mt-1.5 max-w-2xl leading-relaxed">{repoData.description}</p>
                )}
              </div>
            </div>
            {repoData.topics?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 ml-[52px] sm:ml-0">
                {repoData.topics.slice(0, 6).map((topic) => (
                  <span key={topic} className="px-2.5 py-1 text-[10px] font-medium bg-accent-500/8 text-accent-400/90 rounded-lg border border-accent-500/15">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
          {codeHealth && (
            <div className="w-full sm:w-32 shrink-0">
              <HealthScore score={codeHealth.score} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Stars" value={repoData.stargazers_count?.toLocaleString() || "0"} icon={StarIcon} color="text-yellow-400" />
        <StatCard label="Forks" value={repoData.forks_count?.toLocaleString() || "0"} icon={ArrowPathRoundedSquareIcon} color="text-accent-400" />
        <StatCard
          label="Open Issues"
          value={repoData.open_issues_count?.toLocaleString() || "0"}
          icon={ExclamationTriangleIcon}
          color={repoData.open_issues_count > 20 ? "text-red-400" : "text-pulse-400"}
        />
        <StatCard label="Last Commit" value={mounted ? formatRelativeTime(repoData.pushed_at) : "..."} icon={ClockIcon} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-accent-500" />
            <h3 className="text-sm font-semibold text-dark-200">Language Breakdown</h3>
          </div>
          {Object.keys(languages).length > 0 ? (
            <div className="space-y-4">
              <div className="flex h-2.5 rounded-full overflow-hidden bg-dark-600/30">
                {Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lang, percent]) => (
                    <div
                      key={lang}
                      style={{ width: `${percent}%`, backgroundColor: LANG_COLORS[lang] || "#64748b" }}
                      className="first:rounded-l-full last:rounded-r-full transition-all duration-500"
                      title={`${lang}: ${Math.round(percent)}%`}
                    />
                  ))}
              </div>
              {Object.entries(languages)
                .sort(([, a], [, b]) => b - a)
                .map(([lang, percent]) => (
                  <LanguageBar key={lang} name={lang} percent={Math.round(percent)} color={LANG_COLORS[lang] || "#64748b"} />
                ))}
            </div>
          ) : (
            <p className="text-sm text-dark-400">No language data available</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-pulse-500" />
            <h3 className="text-sm font-semibold text-dark-200">Repository Details</h3>
          </div>
          <div className="space-y-0 divide-y divide-dark-600/20">
            {[
              { label: "Default Branch", value: repoData.default_branch || "main", mono: true },
              { label: "License", value: repoData.license?.name || "Not specified" },
              { label: "Created", value: new Date(repoData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) },
              { label: "Visibility", value: repoData.private ? "Private" : "Public" },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-xs font-medium text-dark-400">{label}</span>
                {mono ? (
                  <span className="text-xs text-dark-200 font-mono px-2.5 py-0.5 bg-dark-700/50 rounded-lg">{value}</span>
                ) : (
                  <span className="text-xs text-dark-200 capitalize font-medium">{value}</span>
                )}
              </div>
            ))}
            {codeHealth && (
              <>
                <div className="border-t border-dark-600/20 pt-3 mt-0" />
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-medium text-dark-400">Files Analyzed</span>
                  <span className="text-xs text-dark-200 font-semibold tabular-nums">{codeHealth.filesAnalyzed.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-medium text-dark-400">Total Lines</span>
                  <span className="text-xs text-dark-200 font-semibold tabular-nums">{codeHealth.totalLines.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
