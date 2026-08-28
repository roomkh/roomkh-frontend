
export default function PropertyFilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8 animate-pulse">
      <div className="lg:hidden flex items-center justify-between mb-2">
        <div className="h-8 w-24 bg-gray-300 rounded-xl" />
        <div className="h-8 w-16 bg-gray-300 rounded-lg" />
      </div>

      <div className={`space-y-4`}>
        <div className="relative">
          <div className="h-10 bg-gray-300 rounded-xl w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded-xl" />
          ))}
        </div>

        <div className="hidden lg:flex items-center justify-end pt-2">
          <div className="h-8 w-24 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
