import heroBg from '../../assets/images/hero.jpg';
import { Skeleton, SkeletonText } from './Skeleton';

const TAG_WIDTHS = ['w-12', 'w-14', 'w-14', 'w-20', 'w-12', 'w-10', 'w-16'];

/**
 * Mirrors HeroSection: same section metrics, same background, same field
 * heights (px-3 py-2.5 + border-2 on text-base == 48px) and the same pill row,
 * so the real hero drops in without moving anything.
 */
export default function HeroSectionSkeleton() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[78vh] w-full flex items-center justify-center pt-12 pb-8 px-4 sm:px-6 lg:px-12 bg-gray-200/60 font-sans">
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="max-w-6xl w-full mx-auto relative z-20 flex flex-col justify-center">
        {/* Title & description */}
        <div className="max-w-2xl text-left mb-10">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.6]">
            <SkeletonText className="w-3/5" />
            <SkeletonText className="w-4/5" />
          </div>
          <div className="text-xs sm:text-base mt-4 leading-relaxed max-w-lg font-medium">
            <SkeletonText className="w-full" />
            <SkeletonText className="w-2/5" />
          </div>
        </div>

        {/* Filter card */}
        <div className="bg-[#0070c0] border border-white/20 p-4 sm:p-6 rounded-xl shadow-xl shadow-sky-900/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-base font-medium mb-1.5 ml-1">
                  <SkeletonText className="w-24" light />
                </div>
                <Skeleton className="h-[48px] rounded-lg" />
              </div>
            ))}

            <div className="flex flex-col sm:col-span-2 lg:col-span-1 justify-end">
              <span className="hidden lg:block text-base font-medium opacity-0 mb-1.5">&nbsp;</span>
              <Skeleton className="h-[48px] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Popular searches */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="text-base font-medium mr-1">
            <SkeletonText className="w-32" light />
          </div>
          {TAG_WIDTHS.map((width, i) => (
            <div
              key={i}
              className="text-base px-5 py-2 rounded-lg font-medium shadow-sm border bg-white border-white"
            >
              <SkeletonText className={width} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
