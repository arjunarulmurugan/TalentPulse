export default function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-4 w-2/3 rounded" />
          <div className="skeleton-shimmer h-3 w-1/2 rounded" />
        </div>
        <div className="skeleton-shimmer h-11 w-11 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-5 w-20 rounded-full mb-4" />
      <div className="skeleton-shimmer h-16 w-full rounded-xl" />
    </div>
  );
}
