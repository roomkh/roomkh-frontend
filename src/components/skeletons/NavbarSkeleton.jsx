import React from 'react';

export default function NavbarSkeleton() {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm animate-pulse">
      <div className="max-w-6xl mx-auto py-3 px-4 sm:px-6 lg:px-12 flex justify-between items-center">
        <div className="h-9 sm:h-10 w-24 bg-gray-300 rounded-md" />
        <div className="hidden md:flex items-center gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded-md w-12" />
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-8 w-16 bg-gray-300 rounded-xl" />
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
        </div>
        <div className="md:hidden h-8 w-8 bg-gray-300 rounded-xl" />
      </div>
    </header>
  );
}
