
export default function HeroSectionSkeleton() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gray-200/60 font-sans animate-pulse">
      <div className="max-w-6xl w-full mx-auto relative z-20 flex flex-col justify-center">
        <div className="max-w-2xl text-left mb-20 space-y-4">
          <div className="h-10 sm:h-14 lg:h-16 bg-gray-300 rounded-lg w-3/4" />
          <div className="h-4 sm:h-5 bg-gray-300 rounded-md w-full max-w-lg" />
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-4 sm:p-6 rounded-3xl shadow-xl shadow-sky-900/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="h-10 bg-gray-300 rounded-xl" />
            <div className="h-10 bg-gray-300 rounded-xl" />
            <div className="h-10 bg-gray-300 rounded-xl" />
            <div className="h-10 bg-gray-300 rounded-xl" />
            <div className="h-10 bg-gray-300 rounded-xl" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="h-4 bg-gray-300 rounded-md w-24 mr-1" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-300 rounded-full w-16 sm:w-20" />
          ))}
        </div>
      </div>
    </section>
  );
}
