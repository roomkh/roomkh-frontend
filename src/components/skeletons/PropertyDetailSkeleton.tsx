export default function PropertyDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-48" />

        {/* Top Header Card & Gallery */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
          
          {/* Top Right Action Buttons (Share & Save) */}
          <div className="flex justify-end gap-2">
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
          </div>

          {/* Grid Layout: 4-Image Bento Grid Left, Specs Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Bento Gallery Skeleton */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[320px] sm:h-[380px] md:h-[420px]">
              {/* Featured Cover Skeleton (Left) */}
              <div className="sm:col-span-2 h-full bg-gray-200 rounded-2xl" />

              {/* 3 Secondary Stacked Image Skeletons (Right Column) */}
              <div className="hidden sm:grid grid-rows-3 gap-2 h-full">
                <div className="bg-gray-200 rounded-2xl h-full" />
                <div className="bg-gray-200 rounded-2xl h-full" />
                <div className="bg-gray-200 rounded-2xl h-full" />
              </div>
            </div>

            {/* Right Side Specs Skeleton */}
            <div className="lg:col-span-5 space-y-4 pt-1">
              <div className="h-8 bg-gray-200 rounded-md w-1/3" />
              <div className="h-7 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
              
              <div className="flex flex-wrap gap-2 pt-3">
                <div className="h-7 bg-gray-200 rounded-full w-24" />
                <div className="h-7 bg-gray-200 rounded-full w-24" />
                <div className="h-7 bg-gray-200 rounded-full w-24" />
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded-md w-28" />
                <div className="h-3 bg-gray-200 rounded-md w-20" />
              </div>
            </div>

          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Details Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About Skeleton */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-3 shadow-sm">
              <div className="h-6 bg-gray-200 rounded-md w-1/4" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
              <div className="h-4 bg-gray-200 rounded-md w-5/6" />
              <div className="h-4 bg-gray-200 rounded-md w-2/3" />
            </div>

            {/* Amenities Skeleton */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <div className="h-6 bg-gray-200 rounded-md w-1/3" />
              <div className="flex flex-wrap gap-2">
                <div className="h-8 bg-gray-200 rounded-full w-28" />
                <div className="h-8 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-full w-32" />
                <div className="h-8 bg-gray-200 rounded-full w-20" />
                <div className="h-8 bg-gray-200 rounded-full w-28" />
              </div>
            </div>

            {/* Map Location Skeleton */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <div className="h-6 bg-gray-200 rounded-md w-1/3" />
              <div className="h-64 sm:h-72 bg-gray-200 rounded-2xl" />
            </div>

          </div>

          {/* Sidebar Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Owner Skeleton */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-5 shadow-sm">
              <div className="h-6 bg-gray-200 rounded-md w-1/3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                  <div className="h-3 bg-gray-200 rounded-md w-1/3" />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-10 bg-gray-200 rounded-xl w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-200 rounded-xl" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Similar Property Skeleton */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded-md w-1/3" />
                <div className="h-4 bg-gray-200 rounded-md w-16" />
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 items-center pt-1">
                <div className="w-full h-40 sm:h-24 sm:col-span-5 bg-gray-200 rounded-2xl" />
                <div className="sm:col-span-7 space-y-2 w-full">
                  <div className="h-5 bg-gray-200 rounded-md w-1/2" />
                  <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-md w-2/3" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}