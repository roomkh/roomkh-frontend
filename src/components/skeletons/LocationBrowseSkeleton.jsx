import React from 'react';

export default function LocationBrowseSkeleton({ count = 4 }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 sm:h-8 bg-gray-300 rounded-md w-48" />
        <div className="h-4 bg-gray-300 rounded-md w-16" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-36 sm:h-40 bg-gray-300 rounded-xl" />
        ))}
      </div>
    </section>
  );
}
