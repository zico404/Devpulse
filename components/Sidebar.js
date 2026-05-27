import { Squares2X2Icon, ShieldCheckIcon, ClipboardDocumentListIcon, CubeIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Squares2X2Icon },
  { id: "health", label: "Code Health", icon: ShieldCheckIcon },
  { id: "todos", label: "TODOs", icon: ClipboardDocumentListIcon },
  { id: "dependencies", label: "Dependencies", icon: CubeIcon },
  { id: "suggestions", label: "AI Suggestions", icon: LightBulbIcon },
];

export default function Sidebar({ activeSection, onSectionChange, repoName, isOpen, onClose, collapsed, onToggleCollapse }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0 w-72" : "-translate-x-full"}
        md:translate-x-0 md:z-30 ${collapsed ? "md:w-16" : "md:w-60"}`}
      >
        <div className="flex-1 flex flex-col bg-dark-900/95 backdrop-blur-xl border-r border-dark-600/30 min-h-0">
          <div className="flex items-center gap-3 px-4 h-16 border-b border-dark-600/20 shrink-0">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 items-center justify-center text-accent-400 hover:from-accent-500/30 hover:to-pulse-500/20 transition-all shrink-0 ring-1 ring-accent-500/10"
            >
              <span className="text-base font-bold tracking-tight">D</span>
            </button>
            <button
              onClick={onClose}
              className="md:hidden w-9 h-9 rounded-xl bg-dark-700/80 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-white truncate">DevPulse</h1>
              {repoName && <p className="text-[11px] text-dark-400 truncate">{repoName}</p>}
            </div>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { onSectionChange(item.id); onClose(); }}
                  className={`nav-link w-full ${activeSection === item.id ? "nav-link-active" : "nav-link-inactive"}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 md:p-4 border-t border-dark-600/20 shrink-0">
            <div className="flex items-center gap-3 px-2 py-2">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-pulse-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-pulse-500" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-dark-400">AI Engine</p>
                <p className="text-[10px] text-dark-500">Active & Ready</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
