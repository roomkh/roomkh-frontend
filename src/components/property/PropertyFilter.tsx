import { useState } from 'react';
import SelectDropdown from '../common/SelectDropdown';
import {
  Search,
  MapPin,
  Home,
  Tag,
  DollarSign,
  RotateCcw,
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

  const PROVINCE_OPTIONS = [
    { value: 'Phnom Penh', label: 'Phnom Penh' },
    { value: 'Siem Reap', label: 'Siem Reap' },
    { value: 'Battambang', label: 'Battambang' },
    { value: 'Sihanoukville', label: 'Sihanoukville' },
  ];

  const PROPERTYTYPE_OPTIONS = [
    { value: 'ROOM', label: t('property.studioRoom') },
    { value: 'APARTMENT', label: t('property.apartment') },
    { value: 'CONDO', label: t('property.condo') },
    { value: 'HOUSE', label: t('property.house') },
    { value: 'VILLA', label: t('property.villa') },
    { value: 'LAND', label: t('property.land') },
  ];

  const PURPOSE_OPTIONS = [
    { value: 'RENT', label: t('hero.forRent') },
    { value: 'SALE', label: t('hero.forSale') },
  ];

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
              <SelectDropdown
                className="flex-1 min-w-0"
                value={localFilters.province ?? ''}
                onChange={(next) => handleChange('province', next)}
                options={PROVINCE_OPTIONS}
                placeholder={t('filter.allLocations')}
                triggerClassName="w-full text-xs font-semibold text-gray-800 bg-transparent border-2 border-transparent rounded"
                chevronClassName="text-gray-400"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.propertyType')}
            </label>
            <div className="flex items-center gap-1.5 relative mt-0.5">
              <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <SelectDropdown
                className="flex-1 min-w-0"
                value={localFilters.propertyType ?? ''}
                onChange={(next) => handleChange('propertyType', next)}
                options={PROPERTYTYPE_OPTIONS}
                placeholder={t('filter.allTypes')}
                triggerClassName="w-full text-xs font-semibold text-gray-800 bg-transparent border-2 border-transparent rounded"
                chevronClassName="text-gray-400"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {t('filter.purpose')}
            </label>
            <div className="flex items-center gap-1.5 relative mt-0.5">
              <Tag className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <SelectDropdown
                className="flex-1 min-w-0"
                value={localFilters.purpose ?? ''}
                onChange={(next) => handleChange('purpose', next)}
                options={PURPOSE_OPTIONS}
                placeholder={t('filter.anyPurpose')}
                triggerClassName="w-full text-xs font-semibold text-gray-800 bg-transparent border-2 border-transparent rounded"
                chevronClassName="text-gray-400"
              />
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
