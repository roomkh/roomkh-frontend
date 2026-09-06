export default function SearchPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="h-4 skeleton rounded-md w-40 mb-4" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter rail */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 space-y-4">
            <div className="h-28 skeleton rounded-2xl" />
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
              <div className="h-4 skeleton rounded w-24" />
              <div className="h-9 skeleton rounded-xl" />
              <div className="h-16 skeleton rounded" />
              {[0, 1, 2].map((group) => (
                <div key={group} className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="h-3.5 skeleton rounded w-28" />
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center gap-2.5">
                      <div className="w-[18px] h-[18px] skeleton rounded" />
                      <div className="h-3 skeleton rounded flex-1" />
                      <div className="h-3 skeleton rounded w-5" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-7 skeleton rounded-md w-64" />
                <div className="h-3 skeleton rounded-md w-36" />
              </div>
              <div className="h-8 skeleton rounded-full w-56" />
            </div>

            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4">
                <div className="w-56 h-44 skeleton rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 skeleton rounded w-2/3" />
                  <div className="h-3 skeleton rounded w-1/3" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-6 skeleton rounded-lg w-40" />
                </div>
                <div className="w-40 flex-shrink-0 space-y-3">
                  <div className="h-8 skeleton rounded-lg w-24 ml-auto" />
                  <div className="h-6 skeleton rounded w-20 ml-auto" />
                  <div className="h-8 skeleton rounded-lg w-28 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
