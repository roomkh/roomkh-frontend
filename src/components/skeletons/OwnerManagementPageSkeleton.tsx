export default function OwnerManagementPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse antialiased font-sans text-slate-800">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 bg-slate-200 rounded-lg w-56" />
          <div className="h-3 bg-slate-200 rounded-md w-80" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-40" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between shadow-2xs"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <div className="h-5 bg-slate-200 rounded-full w-16" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded-md w-28" />
              <div className="h-7 bg-slate-200 rounded-lg w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        {/* Controls Bar Skeleton */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          {/* Search Input */}
          <div className="flex-1 md:w-72 h-9 bg-slate-200 rounded-lg" />

          {/* Action Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
            <div className="h-9 bg-slate-200 rounded-lg w-20" />
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
          </div>
        </div>

        {/* Table Area Skeleton */}
        <div className="overflow-x-auto">
          <div className="p-4 space-y-4">
            {/* Header Column Titles Placeholder */}
            <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
              <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-20 w-48 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-32 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-28 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-16 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-20 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-20 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-16 shrink-0" />
              <div className="h-3 bg-slate-200 rounded w-12 ml-auto shrink-0" />
            </div>

            {/* Table Rows Skeleton */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />

                {/* Owner Name & Initial Circle */}
                <div className="flex items-center space-x-3 w-48 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 rounded-md w-32" />
                    <div className="h-2.5 bg-slate-200 rounded-md w-20" />
                  </div>
                </div>

                {/* Email */}
                <div className="h-4 bg-slate-200 rounded-md w-36 shrink-0" />

                {/* Phone */}
                <div className="h-4 bg-slate-200 rounded-md w-28 shrink-0" />

                {/* Plan Badge */}
                <div className="h-6 bg-slate-200 rounded-md w-16 shrink-0" />

                {/* Properties Count */}
                <div className="h-4 bg-slate-200 rounded-md w-12 shrink-0" />

                {/* Join Date */}
                <div className="h-4 bg-slate-200 rounded-md w-24 shrink-0" />

                {/* Status Badge */}
                <div className="h-6 bg-slate-200 rounded-full w-20 shrink-0" />

                {/* Action Menu Button */}
                <div className="w-8 h-8 rounded-lg bg-slate-200 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Footer Skeleton */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-4 bg-slate-200 rounded-md w-48" />
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-7 h-7 rounded-md bg-slate-200" />
              <div className="w-7 h-7 rounded-md bg-slate-200" />
              <div className="w-7 h-7 rounded-md bg-slate-200" />
              <div className="w-7 h-7 rounded-md bg-slate-200" />
            </div>
            <div className="h-7 bg-slate-200 rounded-md w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}