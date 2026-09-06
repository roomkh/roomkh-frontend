import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import LocationBrowseSkeleton from '../skeletons/LocationBrowseSkeleton';
import { getAllProperties, getLocations } from '../../service/api';
import { useLanguage } from '../../context/LanguageContext';
import type { Property } from '../../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80';

const MAX_TILES = 8;

interface Destination {
  name: string;
  imageUrl: string;
  count: number;
}

/** `/locations` answers with plain strings; older/mock builds send objects. */
function locationName(entry: unknown): string {
  if (typeof entry === 'string') return entry.trim();
  if (entry && typeof entry === 'object') {
    const record = entry as { name?: string; title?: string };
    return (record.name || record.title || '').trim();
  }
  return '';
}

const isIn = (property: Property, name: string) => {
  const needle = name.toLowerCase();
  return [property.province, property.district, property.address, property.location]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(needle));
};

/**
 * Pairs each destination with a real cover photo and listing count taken from
 * the catalogue, since the locations endpoint only returns names.
 */
function buildDestinations(rawLocations: unknown[], properties: Property[]): Destination[] {
  const names = rawLocations.map(locationName).filter(Boolean);
  // No names from the API: fall back to whatever provinces the listings show.
  const fallbackNames = [...new Set(properties.map((property) => property.province).filter(Boolean))];
  const unique = [...new Set(names.length > 0 ? names : (fallbackNames as string[]))];

  return unique
    .map((name) => {
      const matches = properties.filter((property) => isIn(property, name));
      const withImage = matches.find((property) => property.cover_image_url);
      return {
        name,
        count: matches.length,
        imageUrl: withImage?.cover_image_url || FALLBACK_IMAGE,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_TILES);
}

export default function LocationBrowse() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getLocations().catch(() => [] as unknown[]),
      getAllProperties().catch(() => [] as Property[]),
    ])
      .then(([rawLocations, properties]) => {
        if (cancelled) return;
        setDestinations(
          buildDestinations(
            Array.isArray(rawLocations) ? rawLocations : [],
            (Array.isArray(properties) ? properties : []) as Property[]
          )
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LocationBrowseSkeleton count={4} />;
  if (destinations.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('location.title')}</h2>
        <Link to="/search" className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline">
          {t('property.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {destinations.map((destination) => (
          <Link
            key={destination.name}
            to={`/search?location=${encodeURIComponent(destination.name)}`}
            className="relative h-36 sm:h-40 rounded-xl overflow-hidden group cursor-pointer shadow-sm block"
          >
            <img
              src={destination.imageUrl}
              alt={destination.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold text-xs sm:text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {destination.name}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-300">
                {t('location.count', { count: destination.count.toLocaleString() })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
