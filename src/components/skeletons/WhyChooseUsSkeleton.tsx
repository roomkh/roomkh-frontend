
export default function WhyChooseUsSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 font-sans animate-pulse">
      <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 sm:p-8">
        <div className="h-6 sm:h-8 bg-gray-300 rounded-md w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-gray-300 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded-md w-2/3" />
                <div className="h-3 bg-gray-300 rounded-md w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
