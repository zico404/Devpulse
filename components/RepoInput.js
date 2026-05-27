import { useState } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function RepoInput({ onFetch, loading, error, recentRepos }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onFetch(url.trim());
  };

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="owner/repo or full GitHub URL"
              className="input pl-11 pr-4 h-12 text-sm w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn btn-primary h-12 px-6 gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <span>Analyze</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/15 animate-slide-down">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-300">{error}</p>
              <p className="text-xs text-dark-400 mt-1">
                Make sure the repository exists and is publicly accessible
              </p>
            </div>
          </div>
        </div>
      )}

      {recentRepos.length > 0 && (
        <div className="mt-5 animate-fade-in">
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Recent Repositories</p>
          <div className="flex flex-wrap gap-2">
            {recentRepos.map((repo) => (
              <button
                key={repo.name}
                onClick={() => setUrl(repo.url || repo.name)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-dark-800/60 border border-dark-600/30 rounded-xl text-xs font-medium text-dark-300 hover:text-dark-100 hover:border-dark-500/60 hover:bg-dark-800 transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {repo.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
