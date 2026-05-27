import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function EmptyState({
  icon: Icon = DocumentTextIcon,
  title = "No data yet",
  description = "Enter a GitHub repository URL to get started",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dark-600/50 to-dark-700/50 flex items-center justify-center mb-4 ring-1 ring-dark-500/30">
        <Icon className="w-7 h-7 text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-dark-200 mb-1.5">{title}</h3>
      <p className="text-sm text-dark-400 text-center max-w-sm mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
