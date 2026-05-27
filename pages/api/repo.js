export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: "Missing owner or repo" });
  }

  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!repoRes.ok) {
      return res.status(repoRes.status).json({
        error: `GitHub API error: ${repoRes.status} ${repoRes.statusText}`,
      });
    }

    const repoData = await repoRes.json();

    const langRes = await fetch(repoData.languages_url, { headers });
    const langData = langRes.ok ? await langRes.json() : {};

    const totalBytes = Object.values(langData).reduce((a, b) => a + b, 0);
    const languages = {};
    if (totalBytes > 0) {
      for (const [lang, bytes] of Object.entries(langData)) {
        languages[lang] = Math.round((bytes / totalBytes) * 100);
      }
    }

    return res.status(200).json({ ...repoData, languages });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch repository data" });
  }
}
