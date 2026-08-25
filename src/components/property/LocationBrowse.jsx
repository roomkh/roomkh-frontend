import React, { useEffect, useState } from 'react';
import LocationBrowseSkeleton from '../skeletons/LocationBrowseSkeleton';
import { getLocations } from '../../service/api';

export default function LocationBrowse({ onSelectLocation }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocations()
      .then((data) => {
        setLocations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch locations:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LocationBrowseSkeleton count={4} />;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse by location</h2>
        <a href="#" className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline">
          View all
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => onSelectLocation && onSelectLocation(loc.name)}
            className="relative h-36 sm:h-40 rounded-xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              src={loc.image_url}
              alt={loc.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold text-xs sm:text-sm">{loc.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-300">
                {loc.property_count ? loc.property_count.toLocaleString() : 0} properties
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}