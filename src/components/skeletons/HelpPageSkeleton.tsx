
export default function HelpPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <div className="h-4 skeleton rounded-md w-36" />

        {/* Search Banner */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 h-56 flex items-center justify-between">
          <div className="space-y-4 w-1/2">
            <div className="h-8 skeleton rounded-md w-3/4" />
            <div className="h-4 skeleton rounded-md w-full" />
            <div className="h-10 skeleton rounded-xl w-full" />
          </div>
          <div className="w-48 h-40 skeleton rounded-2xl" />
        </div>

        {/* Topics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 h-36 space-y-3">
              <div className="w-10 h-10 skeleton rounded-xl" />
              <div className="h-4 skeleton rounded-md w-2/3" />
              <div className="h-3 skeleton rounded-md w-full" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
