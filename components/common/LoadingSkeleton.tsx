"use client";

export const LoadingSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-orange-200/10 rounded-xl h-20 mb-4 animate-pulse"
        />
      ))}
    </>
  );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-1 h-10 bg-orange-200/10 rounded animate-pulse" />
          <div className="w-20 h-10 bg-orange-200/10 rounded animate-pulse" />
          <div className="w-20 h-10 bg-orange-200/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-4 shadow border border-slate-700">
      <div className="h-6 bg-orange-200/10 rounded w-1/3 mb-4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-orange-200/10 rounded w-full animate-pulse" />
        <div className="h-4 bg-orange-200/10 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-orange-200/10 rounded w-4/6 animate-pulse" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

