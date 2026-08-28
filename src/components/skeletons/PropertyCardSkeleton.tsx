
export default function PropertyCardSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="h-36 sm:h-44 bg-gray-200 w-full" />

          {/* Body Skeleton */}
          <div className="p-3 sm:p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-1/2" />

            <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
