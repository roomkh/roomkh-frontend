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
  }, [JSON.stringify(filters)]);

  if (loading) {
    return (
      <div className="py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <PropertyCardSkeleton count={8} />
        </div>
        {slowNotice && (
          <p className="mt-4 mx-auto w-fit text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full animate-pulse border border-amber-200">
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
