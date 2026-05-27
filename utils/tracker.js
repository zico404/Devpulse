function getUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

export function trackEvent(type, metadata = {}) {
  try {
    const payload = { type, metadata, url: getUrl() };
    const body = JSON.stringify(payload);
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function trackPageView() {
  trackEvent("page_view");
}

export function trackRepoSearch(repo, success = true, errorMessage = "") {
  trackEvent("repo_search", { repo, success, error: errorMessage });
}

export function trackSectionView(section) {
  trackEvent("section_view", { section });
}

export function trackError(message, source = "") {
  trackEvent("error", { message, source });
}
