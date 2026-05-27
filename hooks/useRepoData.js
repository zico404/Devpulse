import { useState, useCallback, useEffect } from "react";
import { fetchRepoData, getCodeHealth } from "../utils/github";
import { trackRepoSearch } from "../utils/tracker";

export function useRepoData() {
  const [repoData, setRepoData] = useState(null);
  const [codeHealth, setCodeHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("devpulse_recent");
      if (stored) setRecentRepos(JSON.parse(stored));
    } catch {}
  }, []);

  const fetchRepo = useCallback(async (url) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRepoData(url);
      const health = getCodeHealth(data);

      setRepoData(data);
      setCodeHealth(health);
      trackRepoSearch(data.full_name, true);

      const repoEntry = {
        name: data.full_name,
        url: data.html_url,
        fetchedAt: new Date().toISOString(),
      };

      setRecentRepos((prev) => {
        const updated = [
          repoEntry,
          ...prev.filter((r) => r.name !== data.full_name),
        ].slice(0, 5);
        try {
          window.localStorage.setItem(
            "devpulse_recent",
            JSON.stringify(updated)
          );
        } catch {}
        return updated;
      });

      window.localStorage.setItem(
        "devpulse_current",
        JSON.stringify({ repoData: data, codeHealth: health })
      );
    } catch (err) {
      setError(err.message || "Failed to fetch repository data");
      setRepoData(null);
      setCodeHealth(null);
      trackRepoSearch(url, false, err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setRepoData(null);
    setCodeHealth(null);
    setError(null);
    try { window.localStorage.removeItem("devpulse_current"); } catch {}
  }, []);

  return {
    repoData,
    codeHealth,
    loading,
    error,
    recentRepos,
    fetchRepo,
    clearData,
  };
}
