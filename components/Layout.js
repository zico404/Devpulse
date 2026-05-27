import { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";

export default function Layout({ children, activeSection, onSectionChange, repoName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setCollapsed(mq.matches);
    const handler = (e) => {
      setCollapsed(e.matches);
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <Sidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        repoName={repoName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-dark-900/90 backdrop-blur-xl border-b border-dark-600/20 z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl bg-dark-700/80 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors shrink-0 active:scale-95"
          aria-label="Open menu"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-white truncate">DevPulse</h1>
          {repoName && <p className="text-[11px] text-dark-400 truncate">{repoName}</p>}
        </div>
        <span className="relative flex w-2 h-2 shrink-0">
          <span className="absolute inline-flex w-full h-full rounded-full bg-pulse-500 opacity-75 animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-pulse-500" />
        </span>
      </div>

      <main className={`flex-1 transition-all duration-300 pt-14 md:pt-0 ${collapsed ? "md:ml-16" : "md:ml-60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>

      <footer className={`transition-all duration-300 border-t border-dark-600/20 bg-dark-900/50 backdrop-blur-sm ${collapsed ? "md:ml-16" : "md:ml-60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-dark-400">
              &copy; {new Date().getFullYear()} DevPulse. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-dark-500">
                built by <span className="text-dark-400 font-medium">ztechNG</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com/0xchux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-dark-700/80 flex items-center justify-center text-dark-400 hover:text-dark-100 hover:bg-dark-600 transition-all active:scale-95"
                  aria-label="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/zico404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-dark-700/80 flex items-center justify-center text-dark-400 hover:text-dark-100 hover:bg-dark-600 transition-all active:scale-95"
                  aria-label="GitHub"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
