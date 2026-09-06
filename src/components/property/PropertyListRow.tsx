import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bath, Bed, ChevronRight, Heart, MapPin, Maximize } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../context/LanguageContext';
import { amenityNames, propertyRating, propertyTypeLabel } from '../../utils/propertyFacets';
import type { Property, PropertyImage } from '../../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';

/** Horizontal result row used by the search page's list view. */
export default function PropertyListRow({ property }: { property: Property }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    id,
    title,
    price,
    price_unit = 'MONTH',
    address,
    province,
    bedrooms = 0,
    bathrooms = 0,
    size_sqm = 0,
    is_featured = false,
    cover_image_url,
    images = [],
  } = property;

  const propertyPath = `/properties/${id || property.slug}`;
  const displayImage =
    cover_image_url ||
    images.find((image: PropertyImage) => image.is_cover)?.url ||
    images[0]?.url ||
    FALLBACK_IMAGE;

  const rating = propertyRating(property);
  const ratingLabel =
    rating >= 4.5 ? t('search.excellent') : rating >= 4 ? t('search.veryGood') : t('search.good');
  const amenities = amenityNames(property).slice(0, 3);
  const location = address || province || t('property.defaultLocation');
  const typeLabel = property.property_type ? propertyTypeLabel(String(property.property_type), t) : '';

  const handleToggleFavorite = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(property);
  };

  return (
    <Link
      to={propertyPath}
      className={`block bg-white rounded-2xl border overflow-hidden transition hover:shadow-md ${
        is_featured ? 'border-[#0070c0]/40 ring-1 ring-[#0070c0]/20' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4">
        {/* Image */}
        <div className="relative sm:w-56 lg:w-60 flex-shrink-0 h-40 sm:h-44 rounded-xl overflow-hidden bg-gray-100">
          <img src={displayImage} alt={title || t('property.untitled')} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={t('property.save')}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite(id) ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#0070c0] leading-snug">
                {title || t('property.untitled')}
              </h3>
              {is_featured && (
                <span className="text-[10px] font-bold text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 mt-0.5">
                  {t('property.feature')}
                </span>
              )}
            </div>

            <p className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{location}</span>
              {typeLabel && <span className="text-gray-300">•</span>}
              {typeLabel && <span className="font-semibold text-gray-600">{typeLabel}</span>}
            </p>

            <div className="flex items-center gap-3 mt-2.5 text-[11px] font-medium text-gray-600">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-gray-400" />
                {bedrooms} {t('property.bed')}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-gray-400" />
                {bathrooms} {t('property.bath')}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5 text-gray-400" />
                {size_sqm} m²
              </span>
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="text-[10px] font-semibold text-gray-600 bg-gray-100 rounded-md px-2 py-0.5"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Score + price */}
          <div className="sm:w-44 flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:border-l sm:border-gray-100 sm:pl-4">
            {rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="text-right leading-tight">
                  <p className="text-xs font-bold text-gray-800">{ratingLabel}</p>
                  <p className="text-[10px] text-gray-400">
                    {t('search.reviewScore', { rating: rating.toFixed(1) })}
                  </p>
                </div>
                <span className="w-8 h-8 rounded-lg rounded-bl-none bg-[#003b95] text-white text-xs font-bold flex items-center justify-center">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}

            <div className="sm:mt-auto text-right">
              <p className="text-lg font-extrabold text-gray-900">{formatCurrency(price)}</p>
              <p className="text-[10px] text-gray-400 -mt-0.5">
                / {price_unit ? price_unit.toLowerCase() : t('property.month')}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 bg-[#0070c0] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                {t('search.seeDetails')}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
