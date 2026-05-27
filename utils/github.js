function parseGithubUrl(url) {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\s?#]+)/,
    /^([^\/]+)\/([^\/\s?#]+)$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
  }
  return null;
}

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    throw new Error("Request timed out — GitHub is unreachable");
  }
}

async function fetchRepoFromAPI(owner, repo) {
  const headers = { Accept: "application/vnd.github.v3+json" };
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const repoRes = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (repoRes.status === 403) {
    throw new Error("GitHub API rate limit exceeded. Add a GITHUB_TOKEN to .env.local or try again later.");
  }
  if (!repoRes.ok) {
    throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}`);
  }

  const repoData = await repoRes.json();

  const languagesRes = await fetchWithTimeout(repoData.languages_url, { headers });
  const languagesData = languagesRes.ok ? await languagesRes.json() : {};
  const totalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0);
  const languages = {};
  if (totalBytes > 0) {
    for (const [lang, bytes] of Object.entries(languagesData)) {
      languages[lang] = Math.round((bytes / totalBytes) * 100);
    }
  }

  return { ...repoData, languages, source: "api" };
}

export async function fetchRepoData(url) {
  const parsed = parseGithubUrl(url);
  if (!parsed) {
    throw new Error("Invalid GitHub URL. Use format: owner/repo or https://github.com/owner/repo");
  }
  return fetchRepoFromAPI(parsed.owner, parsed.repo);
}

export function getCodeHealth(repoData) {
  if (!repoData || repoData.source !== "api") return null;

  const size = repoData.size || 1000;
  const filesEstimated = Math.max(20, Math.round(size / 8));
  const linesEstimated = filesEstimated * 180;
  const findings = [];

  if (repoData.open_issues_count > 50) {
    findings.push({
      type: "warning", severity: "high",
      title: "High number of open issues",
      description: `${repoData.open_issues_count} open issues suggest significant technical debt or active bug reports that need triage.`,
      count: repoData.open_issues_count,
    });
  } else if (repoData.open_issues_count > 10) {
    findings.push({
      type: "warning", severity: "low",
      title: "Open issues need attention",
      description: `${repoData.open_issues_count} open issues should be reviewed and triaged regularly.`,
      count: repoData.open_issues_count,
    });
  }

  if (!repoData.topics || repoData.topics.length === 0) {
    findings.push({
      type: "issue", severity: "low",
      title: "No repository topics defined",
      description: "Adding topics improves discoverability and documentation.",
    });
  }

  if (repoData.license) {
    findings.push({
      type: "insight", severity: "info",
      title: "License file present",
      description: `${repoData.license.name} license detected — good for open source projects.`,
    });
  }

  const lastCommit = new Date(repoData.pushed_at);
  const daysSinceUpdate = Math.floor((Date.now() - lastCommit.getTime()) / 86400000);
  if (daysSinceUpdate > 90) {
    findings.push({
      type: "warning", severity: "high",
      title: "Repository inactive for over 3 months",
      description: `Last commit was ${daysSinceUpdate} days ago. Consider archiving or communicating status.`,
    });
  } else if (daysSinceUpdate > 30) {
    findings.push({
      type: "warning", severity: "low",
      title: "Repository not recently updated",
      description: `Last commit was ${daysSinceUpdate} days ago. Regular updates indicate active maintenance.`,
    });
  } else if (daysSinceUpdate <= 7) {
    findings.push({
      type: "insight", severity: "info",
      title: "Actively maintained",
      description: "Recent commits within the last week indicate active maintenance.",
    });
  }

  const langEntries = Object.entries(repoData.languages || {});
  if (langEntries.length > 0) {
    const topLang = langEntries.sort(([, a], [, b]) => b - a)[0];
    findings.push({
      type: "insight", severity: "info",
      title: `Primary language: ${topLang[0]}`,
      description: `${topLang[0]} accounts for ${Math.round(topLang[1])}% of the codebase.`,
    });
    if (langEntries.length >= 3) {
      findings.push({
        type: "insight", severity: "info",
        title: "Multi-language project",
        description: `Uses ${langEntries.length} languages, indicating a diverse tech stack.`,
      });
    }
  }

  if (repoData.stargazers_count > 1000) {
    findings.push({
      type: "insight", severity: "info",
      title: "Popular repository",
      description: `${repoData.stargazers_count.toLocaleString()} stars show significant community interest.`,
    });
  }

  const score = calculateHealthScore(findings);

  return { filesAnalyzed: filesEstimated, totalLines: linesEstimated, score, findings };
}

function calculateHealthScore(findings) {
  let score = 100;
  for (const f of findings) {
    if (f.type === "issue") score -= { high: 15, medium: 8, low: 4 }[f.severity] || 5;
    else if (f.type === "warning") score -= { high: 10, medium: 6, low: 3 }[f.severity] || 4;
  }
  return Math.max(0, Math.min(100, score));
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "unknown";
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
