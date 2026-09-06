import { Skeleton, SkeletonText } from './Skeleton';

/** Mirrors LocationBrowse: same section padding, header row and tile grid. */
export default function LocationBrowseSkeleton({ count = 4 }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl sm:text-2xl font-bold">
          <SkeletonText className="w-48" />
        </div>
        <div className="text-xs sm:text-sm font-semibold">
          <SkeletonText className="w-16" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-36 sm:h-40 rounded-xl shadow-sm" />
        ))}
      </div>
    </section>
  );
}
