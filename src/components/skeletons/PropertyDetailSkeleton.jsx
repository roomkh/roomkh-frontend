import React from 'react';

export default function PropertyDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-200 rounded-md w-48" />

        {/* Top Header Card & Gallery */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6">
          <div className="flex justify-end gap-2">
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 grid grid-cols-3 gap-2 h-64 sm:h-80">
              <div className="col-span-2 bg-gray-200 rounded-2xl h-full" />
              <div className="grid grid-rows-3 gap-2 h-full">
                <div className="bg-gray-200 rounded-xl h-full" />
                <div className="bg-gray-200 rounded-xl h-full" />
                <div className="bg-gray-200 rounded-xl h-full" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 pt-2">
              <div className="h-8 bg-gray-200 rounded-md w-1/3" />
              <div className="h-6 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
              <div className="flex gap-2 pt-4">
                <div className="h-8 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-full w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
              <div className="h-6 bg-gray-200 rounded-md w-1/4" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
              <div className="h-4 bg-gray-200 rounded-md w-5/6" />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 h-64">
              <div className="h-full bg-gray-200 rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
              <div className="h-6 bg-gray-200 rounded-md w-1/3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                  <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}