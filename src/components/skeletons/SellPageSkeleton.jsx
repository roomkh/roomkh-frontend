import React from 'react';

export default function SellPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans animate-pulse">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="h-4 bg-gray-300 rounded-md w-32" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-8 sm:h-10 bg-gray-300 rounded-md w-3/4" />
            <div className="h-4 bg-gray-300 rounded-md w-full" />
            <div className="h-24 bg-gray-300 rounded-lg w-full" />
          </div>
          <div className="lg:col-span-5 h-64 bg-gray-300 rounded-xl" />
        </div>

        <div>
          <div className="h-6 bg-gray-300 rounded-md w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <div className="w-9 h-9 bg-gray-300 rounded-lg" />
                <div className="h-4 bg-gray-300 rounded-md w-2/3" />
                <div className="h-3 bg-gray-300 rounded-md w-full" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-300 rounded-md w-32 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-7 h-7 bg-gray-300 rounded-full" />
                <div className="w-14 h-14 bg-gray-300 rounded-full" />
                <div className="h-4 bg-gray-300 rounded-md w-2/3" />
                <div className="h-3 bg-gray-300 rounded-md w-full max-w-[200px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 bg-gray-300 rounded-md w-3/4" />
            <div className="h-3 bg-gray-300 rounded-md w-full" />
            <div className="h-10 bg-gray-300 rounded-lg w-full" />
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 bg-gray-300 rounded-md w-3/4" />
            <div className="h-3 bg-gray-300 rounded-md w-full" />
            <div className="h-10 bg-gray-300 rounded-lg w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="h-6 bg-gray-300 rounded-md w-1/2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded-md w-24" />
                  <div className="h-9 bg-gray-300 rounded-lg w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded-md w-48" />
              <div className="h-20 bg-gray-300 rounded-lg w-full" />
            </div>
            <div className="h-10 bg-gray-300 rounded-lg w-full" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="h-5 bg-gray-300 rounded-md w-1/3" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="h-3 bg-gray-300 rounded-md w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="h-5 bg-gray-300 rounded-md w-1/3" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 bg-gray-300 rounded-md w-16" />
                    <div className="h-3 bg-gray-300 rounded-md w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
