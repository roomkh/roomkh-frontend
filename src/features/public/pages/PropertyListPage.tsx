import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropertyListPageSkeleton from '../../../components/skeletons/PropertyListPageSkeleton';
import {
  ArrowLeft,
  ChevronDown,
  Map,
} from 'lucide-react';
import PropertyCard from '../../../components/property/PropertyCard';
import { getProperties } from '../../../service/api';
import { useLanguage } from '../../../context/LanguageContext';
import type { Property, PropertyFilters } from '../../../types';

export default function PropertyListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || '',
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
    getProperties({ ...activeFilters, sort_by: sortBy })
      .then((data) => {
        const list = Array.isArray(data) ? (data as Property[]) : data?.content || [];
        setProperties(list);
        setTotalCount(data?.total || list.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch properties:', err);
        setError(err.message || 'Failed to fetch properties. Server may be waking up.');
        setLoading(false);
      });
  }, [sortBy]);

  useEffect(() => {
    Promise.resolve().then(() => fetchListings(filters));
  }, [fetchListings, filters]);

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
          <span className="font-semibold text-gray-800">{t('propertyList.viewAll')}</span>
        </div>

        {/* Top Blue Filter Bar Card */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 items-center">

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.location')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <input
                  type="text"
                  placeholder={t('propertyList.searchLocation')}
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none placeholder:text-white/80 pr-4"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Property Type */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.propertyType')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">{t('propertyList.selectType')}</option>
                  <option value="ROOM" className="text-gray-900 bg-white">{t('property.room')}</option>
                  <option value="APARTMENT" className="text-gray-900 bg-white">{t('property.apartment')}</option>
                  <option value="CONDO" className="text-gray-900 bg-white">{t('property.condo')}</option>
                  <option value="VILLA" className="text-gray-900 bg-white">{t('property.villa')}</option>
                  <option value="LAND" className="text-gray-900 bg-white">{t('property.land')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Purpose */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.purpose')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">{t('propertyList.select')}</option>
                  <option value="RENT" className="text-gray-900 bg-white">{t('propertyList.forRent')}</option>
                  <option value="SALE" className="text-gray-900 bg-white">{t('propertyList.forSale')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.priceRange')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">{t('propertyList.priceAll')}</option>
                  <option value="0-200" className="text-gray-900 bg-white">{t('propertyList.price0to200')}</option>
                  <option value="200-500" className="text-gray-900 bg-white">{t('propertyList.price200to500')}</option>
                  <option value="500-1500" className="text-gray-900 bg-white">{t('propertyList.price500to1500')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.bedrooms')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">{t('propertyList.any')}</option>
                  <option value="1" className="text-gray-900 bg-white">{t('propertyList.1bed')}</option>
                  <option value="2" className="text-gray-900 bg-white">{t('propertyList.2beds')}</option>
                  <option value="3" className="text-gray-900 bg-white">{t('propertyList.3plusBeds')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-700 mb-1 ml-0.5">{t('propertyList.bathrooms')}</label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-2.5 py-2 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">{t('propertyList.any')}</option>
                  <option value="1" className="text-gray-900 bg-white">{t('propertyList.1bath')}</option>
                  <option value="2" className="text-gray-900 bg-white">{t('propertyList.2plusBaths')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/80 absolute right-2 pointer-events-none" />
              </div>
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="newest">{t('propertyList.newest')}</option>
                <option value="price_asc">{t('propertyList.priceLowToHigh')}</option>
                <option value="price_desc">{t('propertyList.priceHighToLow')}</option>
              </select>
            </div>

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
