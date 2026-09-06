import PropertyCardSkeleton from './PropertyCardSkeleton';

export default function PropertyListPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <div className="h-4 skeleton rounded-md w-32" />

        {/* Search Bar Skeleton */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 h-20 flex items-center gap-3">
          <div className="h-10 skeleton rounded-xl flex-1" />
          <div className="h-10 skeleton rounded-xl flex-1" />
          <div className="h-10 skeleton rounded-xl flex-1" />
          <div className="h-10 skeleton rounded-xl w-28" />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-2">
            <div className="h-7 skeleton rounded-md w-48" />
            <div className="h-3 skeleton rounded-md w-32" />
          </div>
          <div className="h-8 skeleton rounded-lg w-36" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <PropertyCardSkeleton count={6} />
        </div>

      </div>
    </div>
  );
}
