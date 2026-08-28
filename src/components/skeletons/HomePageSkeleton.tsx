import HeroSectionSkeleton from './HeroSectionSkeleton';
import LocationBrowseSkeleton from './LocationBrowseSkeleton';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import WhyChooseUsSkeleton from './WhyChooseUsSkeleton';

export default function HomePageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans animate-pulse">
      <HeroSectionSkeleton />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 bg-gray-300 rounded-md w-48" />
          <div className="h-4 bg-gray-300 rounded-md w-16" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <PropertyCardSkeleton count={8} />
        </div>
      </section>

      <LocationBrowseSkeleton count={4} />
      <WhyChooseUsSkeleton />
    </div>
  );
}
