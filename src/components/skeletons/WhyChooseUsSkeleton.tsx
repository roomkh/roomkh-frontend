import { Skeleton, SkeletonText } from './Skeleton';

/** Mirrors WhyChooseUs: same card padding, icon box and two-line copy block. */
export default function WhyChooseUsSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 font-sans">
      <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 sm:p-8">
        <div className="text-xl sm:text-2xl font-bold mb-6">
          <SkeletonText className="w-56" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3.5 items-start">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm">
                  <SkeletonText className="w-2/3" />
                </div>
                <div className="text-xs mt-1 leading-relaxed">
                  <SkeletonText className="w-full" />
                  <SkeletonText className="w-3/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
