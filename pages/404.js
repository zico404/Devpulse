import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500/20 to-pulse-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-accent-500/15">
          <span className="text-4xl">◉</span>
        </div>
        <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
        <p className="text-dark-400 mb-6">Page not found</p>
        <Link
          href="/"
          className="btn btn-primary inline-flex"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
