import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from '../skeletons/PropertyCardSkeleton';
import { getProperties } from '../../service/api';
import { useLanguage } from '../../context/LanguageContext';
import type { Property, PropertyFilters } from '../../types';

export default function PropertyGrid({ filters = {} }: { filters?: PropertyFilters }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [slowNotice, setSlowNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
      setSlowNotice(false);

      let isMounted = true;
      const timer = setTimeout(() => {
        if (isMounted) setSlowNotice(true);
      }, 3000);

      getProperties(filters)
        .then((data) => {
          if (isMounted) {
            const list = Array.isArray(data) ? (data as Property[]) : data?.content || [];
            setProperties(list);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setError(t('property.fetchError'));
            setLoading(false);
          }
        })
        .finally(() => clearTimeout(timer));

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    });
  }, [filters, t]);

  if (loading) {
    return (
      // No extra padding here: the grid has to sit exactly where the loaded
      // grid below will sit, otherwise the cards jump when data lands.
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Same count as the page size the API is being asked for, so the
              placeholder grid is exactly as tall as the grid that replaces it. */}
          <PropertyCardSkeleton count={filters.size ?? 12} />
        </div>
        {slowNotice && (
          <p className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-max text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {t('property.loadingSlow')}
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
        {t('property.empty')}
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
