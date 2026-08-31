export default function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse antialiased font-sans text-slate-800">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="h-7 bg-slate-200 rounded-lg w-52" />
          <div className="h-3 bg-slate-200 rounded-md w-72" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
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
              <div className="h-3 bg-slate-200 rounded-md w-24" />
              <div className="h-8 bg-slate-200 rounded-lg w-28" />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="h-3 bg-slate-200 rounded-md w-36" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded-md w-40" />
              <div className="h-3 bg-slate-200 rounded-md w-60" />
            </div>
            <div className="flex gap-4">
              <div className="h-3 bg-slate-200 rounded w-16" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
          </div>
          <div className="w-full h-52 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-center">
            <div className="w-full h-40 mx-6 bg-slate-200/60 rounded-lg" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-slate-200 rounded-md w-44" />
            <div className="h-3 bg-slate-200 rounded-md w-36" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-8 border-slate-200 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 bg-slate-200 rounded w-24" />
                <div className="h-3 bg-slate-200 rounded w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Table Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 bg-slate-200 rounded-md w-36" />
            <div className="h-3 bg-slate-200 rounded-md w-56" />
          </div>
          <div className="h-6 bg-slate-200 rounded-lg w-20" />
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-4 bg-slate-200 rounded-md w-44" />
              <div className="h-4 bg-slate-200 rounded-md w-32" />
              <div className="h-4 bg-slate-200 rounded-md w-20" />
              <div className="flex items-center gap-2 ml-auto">
                <div className="h-6 bg-slate-200 rounded-md w-16" />
                <div className="h-8 bg-slate-200 rounded-lg w-20" />
                <div className="h-8 bg-slate-200 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
