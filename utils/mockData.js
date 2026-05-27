export const MOCK_REPO_DATA = {
  name: "react-project",
  full_name: "user/react-project",
  description: "A modern React application with TypeScript and TailwindCSS",
  html_url: "https://github.com/user/react-project",
  owner: { login: "user", avatar_url: "" },
  stargazers_count: 142,
  forks_count: 38,
  open_issues_count: 12,
  language: "TypeScript",
  languages: {
    TypeScript: 65,
    JavaScript: 20,
    CSS: 10,
    HTML: 5,
  },
  updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  pushed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
  size: 2840,
  topics: ["react", "typescript", "tailwindcss", "dashboard"],
  default_branch: "main",
  license: { name: "MIT" },
};

export const MOCK_CODE_HEALTH = {
  filesAnalyzed: 127,
  totalLines: 48500,
  score: 72,
  findings: [
    {
      type: "warning",
      severity: "high",
      title: "High number of TODO comments detected",
      description:
        "Found 24 TODO comments across 12 files. These represent incomplete features or known technical debt that should be addressed.",
      count: 24,
    },
    {
      type: "warning",
      severity: "medium",
      title: "Large files detected",
      description:
        "3 files exceed 500 lines of code. Large files are harder to maintain and understand. Consider breaking them into smaller modules.",
      files: ["src/components/Dashboard.tsx (842 lines)", "src/utils/api.ts (634 lines)", "src/store/index.ts (523 lines)"],
    },
    {
      type: "insight",
      severity: "info",
      title: "Good modular structure detected",
      description:
        "Project follows a modular architecture with clear separation of concerns. Components, hooks, and utilities are well-organized.",
    },
    {
      type: "issue",
      severity: "medium",
      title: "Inconsistent naming conventions",
      description:
        "Mixed use of camelCase and snake_case detected in 8 files. Consider standardizing on camelCase for consistency.",
    },
    {
      type: "warning",
      severity: "low",
      title: "Console.log statements in production code",
      description:
        "Found 15 console.log statements in source files. Consider removing or replacing with a proper logging solution.",
      count: 15,
    },
    {
      type: "issue",
      severity: "high",
      title: "Missing error boundaries in React components",
      description:
        "No React error boundaries detected. Uncaught errors could crash the entire application. Add error boundaries at key routing levels.",
    },
    {
      type: "insight",
      severity: "info",
      title: "TypeScript usage is strong",
      description:
        "65% of the codebase is TypeScript. Good type coverage helps prevent runtime errors and improves developer experience.",
    },
    {
      type: "warning",
      severity: "medium",
      title: "Duplicate code patterns detected",
      description:
        "Similar API call patterns found in 5 different files. Consider creating a centralized API client to reduce duplication.",
    },
    {
      type: "issue",
      severity: "low",
      title: "Hardcoded configuration values",
      description:
        "Found 7 hardcoded URLs and configuration values. Move these to environment variables or a config file.",
    },
    {
      type: "insight",
      severity: "info",
      title: "Well-structured component tree",
      description:
        "Components are well-organized with clear parent-child relationships. Average component depth is 3 levels.",
    },
  ],
  todos: [
    { id: "td1", file: "src/components/Dashboard.tsx", line: 42, text: "TODO: Add loading state for data fetching", resolved: false },
    { id: "td2", file: "src/utils/api.ts", line: 15, text: "TODO: Implement retry logic for failed requests", resolved: false },
    { id: "td3", file: "src/components/Chart.tsx", line: 88, text: "FIXME: Fix axis label overlap on small screens", resolved: false },
    { id: "td4", file: "src/hooks/useAuth.ts", line: 23, text: "TODO: Add token refresh mechanism", resolved: false },
    { id: "td5", file: "src/pages/index.tsx", line: 56, text: "TODO: Add SEO meta tags", resolved: false },
    { id: "td6", file: "src/utils/helpers.ts", line: 34, text: "TODO: Add unit tests for utility functions", resolved: false },
    { id: "td7", file: "src/components/Modal.tsx", line: 12, text: "FIXME: Modal closes on inner click when using portal", resolved: false },
    { id: "td8", file: "src/store/actions.ts", line: 67, text: "TODO: Optimize reducer for large state updates", resolved: false },
    { id: "td9", file: "src/styles/global.css", line: 120, text: "TODO: Remove deprecated CSS vendor prefixes", resolved: false },
    { id: "td10", file: "src/components/Form.tsx", line: 45, text: "TODO: Add form validation error messages", resolved: false },
    { id: "td11", file: "src/config/index.ts", line: 8, text: "FIXME: Update API base URL for production", resolved: false },
    { id: "td12", file: "src/utils/logger.ts", line: 3, text: "TODO: Implement log levels (info, warn, error)", resolved: false },
    { id: "td13", file: "src/components/Navbar.tsx", line: 28, text: "TODO: Add mobile responsive hamburger menu", resolved: false },
    { id: "td14", file: "src/pages/api/users.ts", line: 52, text: "TODO: Add pagination for user list endpoint", resolved: false },
  ],
  dependencies: [
    { name: "react", version: "18.2.0", latest: "18.3.1", type: "production", outdated: false, risk: "low" },
    { name: "react-dom", version: "18.2.0", latest: "18.3.1", type: "production", outdated: false, risk: "low" },
    { name: "typescript", version: "5.3.3", latest: "5.5.0", type: "dev", outdated: true, risk: "low" },
    { name: "tailwindcss", version: "3.4.1", latest: "3.4.3", type: "dev", outdated: false, risk: "low" },
    { name: "axios", version: "1.6.2", latest: "1.7.2", type: "production", outdated: true, risk: "medium" },
    { name: "lodash", version: "4.17.21", latest: "4.17.21", type: "production", outdated: false, risk: "low" },
    { name: "moment", version: "2.29.4", latest: "2.30.1", type: "production", outdated: true, risk: "low" },
    { name: "express", version: "4.18.2", latest: "4.19.2", type: "production", outdated: true, risk: "medium" },
    { name: "jest", version: "29.7.0", latest: "29.7.0", type: "dev", outdated: false, risk: "low" },
    { name: "@types/react", version: "18.2.48", latest: "18.3.3", type: "dev", outdated: true, risk: "low" },
    { name: "next", version: "14.1.0", latest: "14.2.3", type: "production", outdated: true, risk: "medium" },
    { name: "eslint", version: "8.56.0", latest: "9.4.0", type: "dev", outdated: true, risk: "low" },
  ],
  suggestions: [
    {
      id: "sug1",
      category: "architecture",
      title: "Split large components into smaller modules",
      description:
        "Components like Dashboard.tsx (842 lines) could be broken into smaller, focused components. Consider splitting by feature or responsibility.",
      priority: "high",
      effort: "medium",
    },
    {
      id: "sug2",
      category: "reliability",
      title: "Add error boundaries in React components",
      description:
        "Implement React error boundaries at the route level to prevent crashes from propagating. Wrap each major section with an error boundary component.",
      priority: "high",
      effort: "low",
    },
    {
      id: "sug3",
      category: "maintainability",
      title: "Improve API error handling consistency",
      description:
        "Standardize error handling across all API calls. Create a centralized error handler with proper status code mapping and user-friendly messages.",
      priority: "high",
      effort: "medium",
    },
    {
      id: "sug4",
      category: "performance",
      title: "Implement code splitting and lazy loading",
      description:
        "Use React.lazy and Suspense to code-split routes and heavy components. This will reduce initial bundle size and improve load times.",
      priority: "medium",
      effort: "medium",
    },
    {
      id: "sug5",
      category: "testing",
      title: "Increase test coverage for critical paths",
      description:
        "Add unit tests for utility functions and integration tests for API flows. Aim for at least 70% coverage on core business logic.",
      priority: "medium",
      effort: "high",
    },
    {
      id: "sug6",
      category: "security",
      title: "Audit and fix hardcoded credentials",
      description:
        "Remove any hardcoded API keys, tokens, or secrets. Use environment variables and consider a secrets management solution.",
      priority: "high",
      effort: "low",
    },
    {
      id: "sug7",
      category: "performance",
      title: "Optimize bundle size with tree shaking",
      description:
        "Review imports from large libraries like lodash. Use specific imports (e.g., import debounce from 'lodash/debounce') to enable better tree shaking.",
      priority: "medium",
      effort: "low",
    },
    {
      id: "sug8",
      category: "dx",
      title: "Add comprehensive TypeScript strict mode",
      description:
        "Enable strict mode in tsconfig.json to catch more type errors at compile time. This improves code quality and developer experience.",
      priority: "low",
      effort: "low",
    },
    {
      id: "sug9",
      category: "architecture",
      title: "Implement a state management strategy",
      description:
        "Consider using Zustand or Jotai for simpler state management instead of raw React context. This reduces boilerplate and improves performance.",
      priority: "medium",
      effort: "medium",
    },
    {
      id: "sug10",
      category: "reliability",
      title: "Add request retry and circuit breaker patterns",
      description:
        "Implement retry logic with exponential backoff for API calls and a circuit breaker pattern to handle downstream service failures gracefully.",
      priority: "medium",
      effort: "high",
    },
  ],
};

export const INDIE_HACKER_MOCK = {
  name: "indie-hacker-saas",
  full_name: "builder/indie-hacker-saas",
  description: "A bootstrapped SaaS built with Next.js, Stripe, and Supabase",
  html_url: "https://github.com/builder/indie-hacker-saas",
  owner: { login: "builder", avatar_url: "" },
  stargazers_count: 89,
  forks_count: 24,
  open_issues_count: 5,
  language: "TypeScript",
  languages: {
    TypeScript: 55,
    JavaScript: 25,
    SQL: 12,
    CSS: 8,
  },
  updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  pushed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
  size: 1200,
  topics: ["saas", "nextjs", "stripe", "supabase", "startup"],
  default_branch: "main",
  license: { name: "MIT" },
};

export const generateHealthScore = (findings) => {
  let score = 100;
  const deductions = {
    high: 12,
    medium: 6,
    low: 3,
  };

  for (const finding of findings) {
    if (finding.type === "issue" || finding.type === "warning") {
      score -= deductions[finding.severity] || 5;
    }
  }

  return Math.max(0, Math.min(100, score));
};

export const getScoreColor = (score) => {
  if (score >= 75) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
};

export const getScoreBg = (score) => {
  if (score >= 75) return "bg-green-500/10 border-green-500/30";
  if (score >= 50) return "bg-yellow-500/10 border-yellow-500/30";
  return "bg-red-500/10 border-red-500/30";
};

export const getScoreBarColor = (score) => {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
};
