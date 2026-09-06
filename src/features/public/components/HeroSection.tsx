import { useState } from 'react';
import type { FormEvent } from 'react';
import heroBg from '../../../assets/images/hero.jpg';
import DestinationInput from '../../../components/common/DestinationInput';
import SelectDropdown from '../../../components/common/SelectDropdown';
import { useLanguage } from '../../../context/LanguageContext';
import type { PropertyFilters } from '../../../types';

export default function HeroSection({
  onSearch,
}: {
  onSearch?: (filters: PropertyFilters) => void;
}) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<PropertyFilters>({
    location: '',
    propertyType: '',
    purpose: '',
    priceRange: '',
  });

  const [activeTag, setActiveTag] = useState('');

  const POPULAR_TAGS = [
    { labelKey: 'hero.tagRoom', value: 'ROOM' },
    { labelKey: 'hero.tagHome', value: 'HOUSE' },
    { labelKey: 'hero.tagCondo', value: 'CONDO' },
    { labelKey: 'hero.tagApartment', value: 'APARTMENT' },
    { labelKey: 'hero.tagVilla', value: 'VILLA' },
    { labelKey: 'hero.tagLand', value: 'LAND' },
    { labelKey: 'hero.tagTourism', value: 'TOURISM' },
  ];

  // Values are unchanged from the previous <option> list.
  const PROPERTY_TYPE_OPTIONS = [
    { value: 'CONDO', label: t('property.condo') },
    { value: 'APARTMENT', label: t('property.apartment') },
    { value: 'VILLA', label: t('property.villa') },
    { value: 'HOUSE', label: t('property.house') },
    { value: 'ROOM', label: t('property.studioRoom') },
    { value: 'TOURISM', label: t('property.tourism') },
    { value: 'LAND', label: t('property.land') },
  ];

  const PURPOSE_OPTIONS = [
    { value: 'RENT', label: t('hero.forRent') },
    { value: 'SALE', label: t('hero.forSale') },
  ];

  const PRICE_RANGE_OPTIONS = [
    { value: '0-200', label: t('hero.price0to200') },
    { value: '200-500', label: t('hero.price200to500') },
    { value: '500-1500', label: t('hero.price500to1500') },
    { value: '1500+', label: t('hero.price1500plus') },
  ];

  const handleInputChange = (field: keyof PropertyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleTagClick = (tagValue: string) => {
    const nextValue = activeTag === tagValue ? '' : tagValue;
    setActiveTag(nextValue);
    const updatedFilters = { ...filters, propertyType: nextValue };
    setFilters(updatedFilters);
    if (onSearch) {
      onSearch(updatedFilters);
    }
  };

  return (
    <section className="relative min-h-[70vh] lg:min-h-[78vh] w-full flex items-center justify-center pt-12 pb-8 px-4 sm:px-6 lg:px-12 bg-gray-200/60 font-sans">
      
      {/* City Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Hero Content Area */}
      <div className="max-w-6xl w-full mx-auto relative z-20 flex flex-col justify-center">
        
        {/* Title & Description */}
        <div className="max-w-2xl text-left mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.6]">
            {t('hero.titleLine1')} <br />
            {t('hero.titleLine2')}
          </h1>
          <p className="text-black text-xs sm:text-base mt-4 leading-relaxed max-w-lg font-medium">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Blue Filter Card Wrapper */}
        <div className="bg-[#0070c0] border border-white/20 p-4 sm:p-6 rounded-xl shadow-xl shadow-sky-900/20">
          <form 
            onSubmit={handleSearchSubmit} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
          >
            
            {/* Location Field */}
            <div className="flex flex-col">
              <label className="text-base font-medium text-white mb-1.5 ml-1">
                {t('hero.location')}
              </label>
              <DestinationInput
                value={filters.location ?? ''}
                onChange={(next) => handleInputChange('location', next)}
              />
            </div>

            {/* Property Type Field */}
            <div className="flex flex-col">
              <label className="text-base font-medium text-white mb-1.5 ml-1">
                {t('hero.propertyType')}
              </label>
              <SelectDropdown
                value={filters.propertyType ?? ''}
                onChange={(next) => handleInputChange('propertyType', next)}
                options={PROPERTY_TYPE_OPTIONS}
                placeholder={t('hero.selectType')}
                triggerClassName="w-full bg-white hover:bg-blue-50 rounded-lg px-3 py-2.5 border-2 border-transparent transition text-base font-normal text-gray-900"
                placeholderClassName="text-gray-500"
              />
            </div>

            {/* Purpose Field */}
            <div className="flex flex-col">
              <label className="text-base font-medium text-white mb-1.5 ml-1">
                {t('hero.purpose')}
              </label>
              <SelectDropdown
                value={filters.purpose ?? ''}
                onChange={(next) => handleInputChange('purpose', next)}
                options={PURPOSE_OPTIONS}
                placeholder={t('hero.selectPurpose')}
                triggerClassName="w-full bg-white hover:bg-blue-50 rounded-lg px-3 py-2.5 border-2 border-transparent transition text-base font-normal text-gray-900"
                placeholderClassName="text-gray-500"
              />
            </div>

            {/* Price Range Field */}
            <div className="flex flex-col">
              <label className="text-base font-medium text-white mb-1.5 ml-1">
                {t('hero.priceRange')}
              </label>
              <SelectDropdown
                value={filters.priceRange ?? ''}
                onChange={(next) => handleInputChange('priceRange', next)}
                options={PRICE_RANGE_OPTIONS}
                placeholder={t('hero.priceAll')}
                triggerClassName="w-full bg-white hover:bg-blue-50 rounded-lg px-3 py-2.5 border-2 border-transparent transition text-base font-normal text-gray-900"
                placeholderClassName="text-gray-500"
              />
            </div>

            {/* Search Button */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1 justify-end">
              <span className="hidden lg:block text-base font-medium opacity-0 mb-1.5">{t('hero.search')}</span>
              <button
                type="submit"
                className="w-full h-[48px] bg-blue-900 hover:bg-blue-950 active:scale-[0.98] text-white font-semibold rounded-lg text-base flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>{t('hero.search')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Popular Searches White Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-base font-medium text-white mr-1">
            {t('hero.popularSearches')}
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = activeTag === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagClick(tag.value)}
                className={`text-base px-5 py-2 rounded-lg font-medium transition duration-150 cursor-pointer shadow-sm border ${
                  isSelected
                    ? 'bg-[#0070c0] text-white border-[#0070c0]'
                    : 'bg-white text-[#0070c0] border-white hover:border-[#0070c0]'
                }`}
              >
                {t(tag.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
