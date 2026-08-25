import React from 'react';

export default function AboutPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans animate-pulse">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="h-4 bg-gray-300 rounded-md w-40" />

        <div className="space-y-3">
          <div className="h-8 sm:h-10 bg-gray-300 rounded-md w-48" />
          <div className="h-4 bg-gray-300 rounded-md w-full max-w-4xl" />
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 sm:h-80 w-full bg-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-300 rounded-md w-1/3" />
                <div className="h-3 bg-gray-300 rounded-md w-full" />
                <div className="h-3 bg-gray-300 rounded-md w-5/6" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded-md w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-blue-50/60 border border-blue-100/60 p-6 rounded-2xl text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto" />
                <div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto" />
                <div className="h-3 bg-gray-300 rounded-md w-full mx-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded-md w-32" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-300 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded-md w-1/2" />
                  <div className="h-3 bg-gray-300 rounded-md w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
          <div className="md:col-span-4 h-48 sm:h-56 bg-gray-300 rounded-2xl" />
          <div className="md:col-span-8 space-y-3">
            <div className="h-6 bg-gray-300 rounded-md w-1/4" />
            <div className="h-3 bg-gray-300 rounded-md w-full" />
            <div className="h-3 bg-gray-300 rounded-md w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
