import { Skeleton, SkeletonText } from './Skeleton';

/**
 * Mirrors PropertyCard's markup class for class, so the loaded card lands on
 * exactly the same pixels: same image height, same padding, same line boxes.
 */
export default function PropertyCardSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="block">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col justify-between">
            {/* Thumbnail */}
            <div className="relative h-36 sm:h-44 skeleton overflow-hidden" />

            {/* Details */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Price */}
                <div className="font-extrabold text-base sm:text-lg">
                  <SkeletonText className="w-2/3 max-w-[7rem]" />
                </div>

                {/* Title */}
                <div className="font-bold text-xs sm:text-sm mt-1">
                  <SkeletonText className="w-full" />
                </div>

                {/* Location */}
                <div className="text-[10px] sm:text-xs mb-2 flex items-center gap-1 mt-0.5">
                  <Skeleton className="w-3 h-3 rounded-full flex-shrink-0" />
                  <SkeletonText className="w-2/3" />
                </div>
              </div>

              {/* Specs footer */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-medium border-t border-gray-100 pt-2.5 sm:pt-3 mt-1">
                {Array.from({ length: 3 }).map((__, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <Skeleton className="w-3.5 h-3.5 rounded flex-shrink-0" />
                    <SkeletonText className="w-8" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
