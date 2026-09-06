import HeroSectionSkeleton from './HeroSectionSkeleton';
import LocationBrowseSkeleton from './LocationBrowseSkeleton';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import WhyChooseUsSkeleton from './WhyChooseUsSkeleton';
import { SkeletonText } from './Skeleton';

/** Section-for-section mirror of HomePage so the swap happens in place. */
export default function HomePageSkeleton() {
  return (
    <>
      <HeroSectionSkeleton />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl sm:text-2xl font-bold">
            <SkeletonText className="w-48" />
          </div>
          <div className="text-xs sm:text-sm font-semibold">
            <SkeletonText className="w-16" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <PropertyCardSkeleton count={12} />
        </div>
      </section>

      <LocationBrowseSkeleton count={4} />
      <WhyChooseUsSkeleton />
    </>
  );
}
