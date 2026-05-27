import { useState, useEffect, useMemo } from "react";
import { ClipboardDocumentListIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";

function TodoItem({ todo, onToggle }) {
  const isFixme = todo.text.startsWith("FIXME");
  const badgeLabel = isFixme ? "FIXME" : "TODO";

  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-200 ${
      todo.resolved
        ? "bg-dark-800/30 opacity-50"
        : "bg-dark-800/50 hover:bg-dark-800/70 border border-dark-600/20"
    }`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
          todo.resolved
            ? "bg-pulse-500 border-pulse-500 shadow-sm shadow-pulse-500/20"
            : "border-dark-400/50 hover:border-accent-400"
        }`}
        aria-label={todo.resolved ? "Mark as unresolved" : "Mark as resolved"}
      >
        {todo.resolved && <CheckIcon className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs font-mono text-dark-400/80 ${todo.resolved ? "line-through" : ""}`}>
            {todo.file}:{todo.line}
          </span>
          <span className={`badge text-[10px] ${isFixme ? "badge-red" : "badge-yellow"}`}>
            {badgeLabel}
          </span>
        </div>
        <p className={`text-sm ${todo.resolved ? "text-dark-500 line-through" : "text-dark-200"}`}>
          {todo.text}
        </p>
      </div>
    </div>
  );
}

export default function TodoTracker({ codeHealth }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (codeHealth?.todos) setTodos(codeHealth.todos);
  }, [codeHealth?.todos]);

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, resolved: !t.resolved } : t));
  };

  if (!todos.length && !codeHealth?.todos) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <ClipboardDocumentListIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">TODO & FIXME Tracker</h2>
            <p className="text-sm text-dark-400/80">Track code comments that need attention</p>
          </div>
        </div>
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-7 h-7 text-dark-400" />
          </div>
          <h3 className="text-base font-semibold text-dark-200 mb-1">All clear</h3>
          <p className="text-sm text-dark-400">No TODO or FIXME comments found in this repository</p>
        </div>
      </div>
    );
  }

  const filtered = todos.filter((todo) => {
    if (filter === "open") return !todo.resolved;
    if (filter === "resolved") return todo.resolved;
    return true;
  });

  const unresolvedCount = todos.filter((t) => !t.resolved).length;
  const fixmeCount = todos.filter((t) => t.text.startsWith("FIXME")).length;
  const todoCount = todos.filter((t) => t.text.startsWith("TODO")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center shrink-0 ring-1 ring-accent-500/10">
            <ClipboardDocumentListIcon className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">TODO & FIXME Tracker</h2>
            <p className="text-sm text-dark-400/80">Track code comments that need attention</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/5 text-yellow-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            {todoCount} TODOs
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/5 text-red-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {fixmeCount} FIXMEs
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-1 bg-dark-800/60 rounded-xl p-1 border border-dark-600/30">
          {["all", "open", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === f ? "bg-accent-600 text-white shadow-sm" : "text-dark-400 hover:text-dark-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "open" && ` (${unresolvedCount})`}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments..."
            className="input text-xs h-9 pl-9 pr-3 w-full"
          />
          <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered
            .filter(
              (t) =>
                !searchQuery ||
                t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.file.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((todo, index) => (
              <div key={todo.id} className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
                <TodoItem todo={todo} onToggle={toggleTodo} />
              </div>
            ))}
        </div>
      ) : (
        <div className="card text-center py-10">
          <p className="text-sm text-dark-400">
            {searchQuery ? "No matching comments found" :
             filter === "resolved" ? "No resolved items yet" :
             "No open TODO or FIXME comments"}
          </p>
        </div>
      )}
    </div>
  );
}
