import { useState } from 'react';
import {
  Search,
  MapPin,
  Home,
  Tag,
  DollarSign,
  RotateCcw,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FilterState {
  search?: string;
  propertyType?: string;
  purpose?: string;
  minPrice?: string;
  maxPrice?: string;
  province?: string;
  bedrooms?: string;
  bathrooms?: string;
}

export default function PropertyFilter({
  filters = {},
  onFilterChange,
  onReset,
}: {
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onReset?: () => void;
}) {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState<FilterState>({
    search: filters.search || '',
    propertyType: filters.propertyType || '',
    purpose: filters.purpose || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    province: filters.province || '',
    bedrooms: filters.bedrooms || '',
    bathrooms: filters.bathrooms || '',
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleChange = (field: keyof FilterState, value: string) => {
    const updated: FilterState = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleReset = () => {
    const resetState = {
      search: '',
      propertyType: '',
      purpose: '',
      minPrice: '',
      maxPrice: '',
      province: '',
      bedrooms: '',
      bathrooms: '',
    };
    setLocalFilters(resetState);
    if (onReset) onReset();
    if (onFilterChange) onFilterChange(resetState);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8">
      {/* Mobile Toggle Button */}
      <div className="flex items-center justify-between lg:hidden mb-2">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-gray-100 py-2 px-3.5 rounded-xl"
        >
          <Filter className="w-4 h-4 text-blue-600" />
          <span>{t('filter.filters')} {Object.values(localFilters).some(Boolean) && '• ' + t('filter.active')}</span>
        </button>

        <button
          onClick={handleReset}
          className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('filter.reset')}</span>
        </button>
      </div>

      {/* Main Filter Controls Container */}
      <div className={`${isMobileOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('filter.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition"
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Province / Location */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.location')}
            </label>
            <div className="flex items-center gap-1.5 relative mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <select
                className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none appearance-none pr-4 cursor-pointer"
                value={localFilters.province}
                onChange={(e) => handleChange('province', e.target.value)}
              >
                <option value="">{t('filter.allLocations')}</option>
                <option value="Phnom Penh">Phnom Penh</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Battambang">Battambang</option>
                <option value="Sihanoukville">Sihanoukville</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Property Type */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.propertyType')}
            </label>
            <div className="flex items-center gap-1.5 relative mt-0.5">
              <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <select
                className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none appearance-none pr-4 cursor-pointer"
                value={localFilters.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
              >
                <option value="">{t('filter.allTypes')}</option>
                <option value="ROOM">{t('property.studioRoom')}</option>
                <option value="APARTMENT">{t('property.apartment')}</option>
                <option value="CONDO">{t('property.condo')}</option>
                <option value="HOUSE">{t('property.house')}</option>
                <option value="VILLA">{t('property.villa')}</option>
                <option value="LAND">{t('property.land')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Purpose */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.purpose')}
            </label>
            <div className="flex items-center gap-1.5 relative mt-0.5">
              <Tag className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <select
                className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none appearance-none pr-4 cursor-pointer"
                value={localFilters.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
              >
                <option value="">{t('filter.anyPurpose')}</option>
                <option value="RENT">{t('hero.forRent')}</option>
                <option value="SALE">{t('hero.forSale')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Min Price */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.minPrice')}
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <input
                type="number"
                placeholder="0"
                className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none"
                value={localFilters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.maxPrice')}
            </label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <input
                type="number"
                placeholder="Any"
                className="w-full text-xs font-semibold text-gray-800 bg-transparent outline-none"
                value={localFilters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Footer Reset & Actions */}
        <div className="hidden lg:flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('filter.resetFilters')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
