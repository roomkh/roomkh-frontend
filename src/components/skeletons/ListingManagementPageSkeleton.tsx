export default function ListingManagementPageSkeleton() {
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
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
            <div className="h-9 bg-slate-200 rounded-lg w-20" />
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="overflow-x-auto">
          <div className="p-4 space-y-4">
            {/* Table Header Placeholder */}
            <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
              <div className="w-4 h-4 rounded bg-slate-200" />
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-20 ml-12" />
              <div className="h-3 bg-slate-200 rounded w-16 ml-16" />
              <div className="h-3 bg-slate-200 rounded w-20 ml-16" />
              <div className="h-3 bg-slate-200 rounded w-16 ml-16" />
              <div className="h-3 bg-slate-200 rounded w-16 ml-16" />
              <div className="h-3 bg-slate-200 rounded w-12 ml-auto" />
            </div>

            {/* Table Body Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />

                {/* Listing Title & Thumbnail */}
                <div className="flex items-center space-x-3 w-56 shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 rounded-md w-36" />
                    <div className="h-2.5 bg-slate-200 rounded-md w-20" />
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-2 w-40 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-slate-200 rounded-md w-24" />
                    <div className="h-2 bg-slate-200 rounded-md w-16" />
                  </div>
                </div>

                {/* Type */}
                <div className="h-6 bg-slate-200 rounded-md w-16 shrink-0" />

                {/* Location */}
                <div className="h-4 bg-slate-200 rounded-md w-28 shrink-0" />

                {/* Price */}
                <div className="h-4 bg-slate-200 rounded-md w-20 shrink-0" />

                {/* Status */}
                <div className="h-6 bg-slate-200 rounded-full w-20 shrink-0" />

                {/* Actions Button */}
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