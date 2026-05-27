export function CardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 rounded-lg" />
          <div className="skeleton h-3 w-24 rounded-lg" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-4/5 rounded-lg" />
        <div className="skeleton h-3 w-3/5 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton h-5 w-5 rounded-lg" />
        <div className="skeleton h-4 w-40 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-3 w-3 rounded-full" />
            <div className="skeleton h-3 flex-1 rounded-lg" />
            <div className="skeleton h-3 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ cards = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton h-3 w-20 rounded-lg mb-2" />
          <div className="skeleton h-7 w-12 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 6 }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton h-5 w-5 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-dark-700/20 rounded-xl">
            <div className="skeleton h-4 w-4 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-3/4 rounded-lg" />
              <div className="skeleton h-2.5 w-1/2 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
