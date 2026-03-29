export function NewsCardSkeleton() {
  return (
    <div className="card flex flex-col sm:flex-row gap-0 overflow-hidden">
      <div className="sm:w-40 h-44 sm:h-auto flex-shrink-0 skeleton" />
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-5 w-full rounded" />
          <div className="skeleton h-5 w-4/5 rounded" />
          <div className="skeleton h-4 w-3/5 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-56 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-32 rounded mt-3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
