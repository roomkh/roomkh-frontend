import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from '../skeletons/PropertyCardSkeleton';
import { getProperties } from '../../service/api';

export default function PropertyGrid({ filters = {} }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slowNotice, setSlowNotice] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setSlowNotice(false);

    const timer = setTimeout(() => {
      if (loading) setSlowNotice(true);
    }, 3000);

    getProperties(filters)
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.content || [];
          setProperties(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to fetch properties. Server may be waking up.');
          setLoading(false);
        }
      })
      .finally(() => clearTimeout(timer));

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [JSON.stringify(filters)]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-3">
        <PropertyCardSkeleton count={8} />
        {slowNotice && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full animate-pulse border border-amber-200">
            Render server is starting up, please wait a moment...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 text-xs sm:text-sm">{error}</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-xs sm:text-sm">
        No properties found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id || property.slug} property={property} />
      ))}
    </div>
  );
}