import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../context/LanguageContext';
import type { Property, PropertyImage } from '../../types';

export default function PropertyCard({ property }: { property: Property }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  if (!property) return null;

  // Extract fields matching mock API's property card DTO schema
  const {
    id,
    title,
    price,
    price_unit = 'MONTH',
    address,
    province,
    bedrooms = 1,
    bathrooms = 1,
    size_sqm = 0,
    is_featured = false,
    cover_image_url,
    images = [],
  } = property;
  const propertyPath = `/properties/${id || property.slug}`;

  const saved = isFavorite(id);

  // Fallback image handling: cover_image_url -> images array -> placeholder
  const displayImage =
    cover_image_url ||
    images.find((img: PropertyImage) => img.is_cover)?.url ||
    images[0]?.url ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';

  // Format display location
  const displayLocation = address || province || t('property.defaultLocation');

  // Toggle favorite stored in localStorage
  const handleToggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  return (
    <Link to={propertyPath} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition duration-200 flex flex-col justify-between cursor-pointer">
      {/* Property Image & Badges */}
      <div className="relative h-36 sm:h-44 bg-gray-100 overflow-hidden">
        <img
          src={displayImage}
          alt={title || t('property.untitled')}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Featured Tag */}
        {is_featured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <Badge variant="primary" className="text-[9px] sm:text-xs px-2 py-0.5 font-bold shadow-sm">
              {t('property.feature')}
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition shadow-sm cursor-pointer"
          aria-label={t('property.save')}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              saved ? 'text-red-500 fill-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="text-blue-600 font-extrabold text-base sm:text-lg">
            {formatCurrency(price)}{' '}
            <span className="text-[10px] sm:text-xs text-gray-400 font-normal">
              / {price_unit ? price_unit.toLowerCase() : t('property.month')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm mt-1 truncate">
            {title || t('property.untitled')}
          </h3>

          {/* Location */}
          <p className="text-[10px] sm:text-xs text-gray-400 mb-2 truncate flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span>{displayLocation}</span>
          </p>
        </div>

        {/* Specifications Footer */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-medium text-gray-500 border-t border-gray-100 pt-2.5 sm:pt-3 mt-1">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-gray-400" />
            <span>{bedrooms} {t('property.bed')}</span>
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-gray-400" />
            <span>{bathrooms} {t('property.bath')}</span>
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5 text-gray-400" />
            <span>{size_sqm} m²</span>
          </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
