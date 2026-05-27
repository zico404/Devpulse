import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import RepoInput from "../components/RepoInput";
import Overview from "../components/Overview";
import CodeHealth from "../components/CodeHealth";
import TodoTracker from "../components/TodoTracker";
import Dependencies from "../components/Dependencies";
import AISuggestions from "../components/AISuggestions";
import { CardSkeleton, StatsSkeleton, ListSkeleton } from "../components/LoadingSkeleton";
import { useRepoData } from "../hooks/useRepoData";

function DashboardContent({ activeSection, repoData, codeHealth, loading }) {
  const loadingSections = {
    overview: (
      <div className="space-y-6">
        <div className="card">
          <div className="skeleton h-6 w-64 rounded-lg mb-2" />
          <div className="skeleton h-4 w-96 rounded-lg mb-4" />
          <div className="flex gap-2">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    ),
    health: (
      <div className="space-y-6">
        <div className="card">
          <div className="skeleton h-6 w-48 rounded-lg mb-2" />
          <div className="skeleton h-4 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
          <CardSkeleton />
        </div>
      </div>
    ),
    todos: <ListSkeleton rows={8} />,
    dependencies: <ListSkeleton rows={6} />,
    suggestions: <ListSkeleton rows={5} />,
  };

  const sectionComponents = {
    overview: <Overview repoData={repoData} codeHealth={codeHealth} />,
    health: <CodeHealth codeHealth={codeHealth} />,
    todos: <TodoTracker codeHealth={codeHealth} />,
    dependencies: <Dependencies codeHealth={codeHealth} />,
    suggestions: <AISuggestions codeHealth={codeHealth} />,
  };

  if (loading) return loadingSections[activeSection] || loadingSections.overview;
  return sectionComponents[activeSection] || sectionComponents.overview;
}

export default function Home() {
  const { repoData, codeHealth, loading, error, recentRepos, fetchRepo } = useRepoData();
  const [activeSection, setActiveSection] = useState("overview");
  const [mounted, setMounted] = useState(false);

  const hasData = !!(repoData && codeHealth);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = window.localStorage.getItem("devpulse_current");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.repoData?.full_name) {
          fetchRepo(parsed.repoData.full_name);
        }
      }
    } catch {}
  }, [mounted, fetchRepo]);

  const handleFetch = useCallback(
    (url) => { fetchRepo(url); if (!hasData) setActiveSection("overview"); },
    [fetchRepo, hasData]
  );

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      repoName={repoData?.full_name}
    >
      {!hasData && !loading && (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500/20 via-accent-500/10 to-pulse-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-accent-500/15 shadow-lg shadow-accent-500/5 animate-float">
                <span className="text-4xl text-accent-400">◉</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                <span className="text-gradient">DevPulse</span>
              </h1>
              <p className="text-dark-400/80 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                AI-powered code health analysis and project insights for your GitHub repositories
              </p>
            </div>
            <div className="animate-slide-up">
              <RepoInput onFetch={handleFetch} loading={loading} error={error} recentRepos={recentRepos} />
            </div>
          </div>
        </div>
      )}

      {hasData && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-xl">
              <RepoInput onFetch={handleFetch} loading={loading} error={error} recentRepos={recentRepos} />
            </div>
          </div>

          <DashboardContent
            activeSection={activeSection}
            repoData={repoData}
            codeHealth={codeHealth}
            loading={loading}
          />
        </div>
      )}
    </Layout>
  );
}
