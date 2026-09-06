import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PropertyListPageSkeleton from '../../../components/skeletons/PropertyListPageSkeleton';
import {
  ArrowLeft,
  Map,
  SlidersHorizontal,
} from 'lucide-react';
import PropertyCard from '../../../components/property/PropertyCard';
import DestinationInput from '../../../components/common/DestinationInput';
import SelectDropdown from '../../../components/common/SelectDropdown';
import { getProperties } from '../../../service/api';
import { filterMockTourismProperties } from '../../../data/mockTourismProperties';
import { useLanguage } from '../../../context/LanguageContext';
import type { Property, PropertyFilters } from '../../../types';

export default function PropertyListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  // /tourism is the tourism-area entry point, so it pre-selects that type.
  const isTourismRoute = location.pathname === '/tourism';

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: isTourismRoute ? 'TOURISM' : searchParams.get('propertyType') || '',
    purpose: searchParams.get('purpose') || '',
    priceRange: searchParams.get('priceRange') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
  });

  const [sortBy, setSortBy] = useState('newest');
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchListings = useCallback((activeFilters: PropertyFilters) => {
    setLoading(true);
    setError(null);

    // The API has no tourism listings yet, so /tourism falls back to mock areas
    // whenever it comes back empty or unreachable.
    const showMockTourism = (usedFilters: PropertyFilters) => {
      const mocks = filterMockTourismProperties(usedFilters, sortBy);
      setProperties(mocks);
      setTotalCount(mocks.length);
      setLoading(false);
    };

    getProperties({ ...activeFilters, sort_by: sortBy })
      .then((data) => {
        const list = Array.isArray(data) ? (data as Property[]) : data?.content || [];
        if (isTourismRoute && list.length === 0) {
          showMockTourism(activeFilters);
          return;
        }
        setProperties(list);
        setTotalCount(data?.total || list.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch properties:', err);
        if (isTourismRoute) {
          showMockTourism(activeFilters);
          return;
        }
        setError(err.message || 'Failed to fetch properties. Server may be waking up.');
        setLoading(false);
      });
  }, [sortBy, isTourismRoute]);

  useEffect(() => {
    Promise.resolve().then(() => fetchListings(filters));
  }, [fetchListings, filters]);

  const PROPERTYTYPE_OPTIONS = [
    { value: 'ROOM', label: t('property.room') },
    { value: 'APARTMENT', label: t('property.apartment') },
    { value: 'CONDO', label: t('property.condo') },
    { value: 'VILLA', label: t('property.villa') },
    { value: 'LAND', label: t('property.land') },
    { value: 'TOURISM', label: t('property.tourism') },
  ];

  const PURPOSE_OPTIONS = [
    { value: 'RENT', label: t('propertyList.forRent') },
    { value: 'SALE', label: t('propertyList.forSale') },
  ];

  const PRICERANGE_OPTIONS = [
    { value: '0-200', label: t('propertyList.price0to200') },
    { value: '200-500', label: t('propertyList.price200to500') },
    { value: '500-1500', label: t('propertyList.price500to1500') },
  ];

  const BEDROOMS_OPTIONS = [
    { value: '1', label: t('propertyList.1bed') },
    { value: '2', label: t('propertyList.2beds') },
    { value: '3', label: t('propertyList.3plusBeds') },
  ];

  const BATHROOMS_OPTIONS = [
    { value: '1', label: t('propertyList.1bath') },
    { value: '2', label: t('propertyList.2plusBaths') },
  ];

  const SORT_OPTIONS = [
    { value: 'newest', label: t('propertyList.newest') },
    { value: 'price_asc', label: t('propertyList.priceLowToHigh') },
    { value: 'price_desc', label: t('propertyList.priceHighToLow') },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchListings(filters);
  };

  if (loading) {
    return <PropertyListPageSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchListings(filters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Button & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('propertyList.home')}</span>
          </button>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">
            {isTourismRoute ? t('nav.tourism') : t('propertyList.viewAll')}
          </span>
        </div>

        {/* Top Blue Filter Bar Card */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 items-center">

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.location')}</label>
              <DestinationInput
                value={filters.location}
                onChange={(next) => handleFilterChange('location', next)}
                placeholder={t('propertyList.searchLocation')}
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.propertyType')}</label>
              <SelectDropdown
                value={filters.propertyType}
                onChange={(next) => handleFilterChange('propertyType', next)}
                options={PROPERTYTYPE_OPTIONS}
                placeholder={t('propertyList.selectType')}
                triggerClassName="w-full bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 border-2 border-transparent transition text-xs font-semibold text-white"
                chevronClassName="text-white/80"
              />
            </div>

            {/* Purpose */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.purpose')}</label>
              <SelectDropdown
                value={filters.purpose}
                onChange={(next) => handleFilterChange('purpose', next)}
                options={PURPOSE_OPTIONS}
                placeholder={t('propertyList.select')}
                triggerClassName="w-full bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 border-2 border-transparent transition text-xs font-semibold text-white"
                chevronClassName="text-white/80"
              />
            </div>

            {/* Price Range */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.priceRange')}</label>
              <SelectDropdown
                value={filters.priceRange}
                onChange={(next) => handleFilterChange('priceRange', next)}
                options={PRICERANGE_OPTIONS}
                placeholder={t('propertyList.priceAll')}
                triggerClassName="w-full bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 border-2 border-transparent transition text-xs font-semibold text-white"
                chevronClassName="text-white/80"
              />
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.bedrooms')}</label>
              <SelectDropdown
                value={filters.bedrooms}
                onChange={(next) => handleFilterChange('bedrooms', next)}
                options={BEDROOMS_OPTIONS}
                placeholder={t('propertyList.any')}
                triggerClassName="w-full bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 border-2 border-transparent transition text-xs font-semibold text-white"
                chevronClassName="text-white/80"
              />
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.bathrooms')}</label>
              <SelectDropdown
                value={filters.bathrooms}
                onChange={(next) => handleFilterChange('bathrooms', next)}
                options={BATHROOMS_OPTIONS}
                placeholder={t('propertyList.any')}
                triggerClassName="w-full bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 border-2 border-transparent transition text-xs font-semibold text-white"
                chevronClassName="text-white/80"
              />
            </div>

            {/* Search Button */}
            <div className="flex flex-col col-span-2 sm:col-span-1 justify-end">
              <label className="hidden lg:block text-[10px] font-bold opacity-0 mb-1">{t('propertyList.search')}</label>
              <button
                type="submit"
                className="w-full h-[36px] bg-[#0070c0] hover:bg-[#005da1] active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>{t('propertyList.search')}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Results Info & Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {t('propertyList.propertiesFound', { count: totalCount.toLocaleString() })}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {t('propertyList.foundMatching')}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">{t('propertyList.sortBy')}</span>
              <SelectDropdown
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                align="right"
                triggerClassName="bg-white border-2 border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700"
                panelClassName="w-48"
              />
            </div>

            <Link
              to={filters.location ? `/search?location=${encodeURIComponent(filters.location)}` : '/search'}
              className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('search.filters')}</span>
            </Link>

            <button
              type="button"
              className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <Map className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('propertyList.area')}</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {properties.map((property) => (
            <PropertyCard key={property.id || property.slug} property={property} />
          ))}
        </div>

      </div>
    </div>
  );
}
