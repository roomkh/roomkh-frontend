import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import heroBg from '../../../assets/images/hero.jpg';

const POPULAR_TAGS = [
  { label: 'Room', value: 'ROOM' },
  { label: 'Home', value: 'HOUSE' },
  { label: 'Condo', value: 'CONDO' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Villa', value: 'VILLA' },
  { label: 'Land', value: 'LAND' },
];

export default function HeroSection({ onSearch }) {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    purpose: '',
    priceRange: '',
  });

  const [activeTag, setActiveTag] = useState('');

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleTagClick = (tagValue) => {
    const nextValue = activeTag === tagValue ? '' : tagValue;
    setActiveTag(nextValue);
    const updatedFilters = { ...filters, propertyType: nextValue };
    setFilters(updatedFilters);
    if (onSearch) {
      onSearch(updatedFilters);
    }
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gray-200/60 font-sans">
      
      {/* City Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Hero Content Area */}
      <div className="max-w-6xl w-full mx-auto relative z-20 flex flex-col justify-center">
        
        {/* Title & Description */}
        <div className="max-w-2xl text-left mb-20">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.12]">
            Find Your Perfect <br />
            Property in Cambodia
          </h1>
          <p className="text-black text-xs sm:text-base mt-4 leading-relaxed max-w-lg font-medium">
            Thousands of rooms, apartments, houses or land for rent or sale across Cambodia.
          </p>
        </div>

        {/* Light Glassmorphism Card Wrapper */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-4 sm:p-6 rounded-3xl shadow-xl shadow-sky-900/10">
          <form 
            onSubmit={handleSearchSubmit} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
          >
            
            {/* Location Field */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1.5 ml-1">
                Location
              </label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-3 py-2.5 transition">
                <Search className="w-4 h-4 text-white flex-shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search location"
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none placeholder:text-white/80"
                  value={filters.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
                <ChevronDown className="w-4 h-4 text-white/80 flex-shrink-0 ml-1 pointer-events-none" />
              </div>
            </div>

            {/* Property Type Field */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1.5 ml-1">
                Property Type
              </label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-3 py-2.5 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-6"
                  value={filters.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">Select Type</option>
                  <option value="CONDO" className="text-gray-900 bg-white">Condo</option>
                  <option value="APARTMENT" className="text-gray-900 bg-white">Apartment</option>
                  <option value="VILLA" className="text-gray-900 bg-white">Villa</option>
                  <option value="HOUSE" className="text-gray-900 bg-white">House</option>
                  <option value="ROOM" className="text-gray-900 bg-white">Studio Room</option>
                  <option value="LAND" className="text-gray-900 bg-white">Land</option>
                </select>
                <ChevronDown className="w-4 h-4 text-white/80 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Purpose Field */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1.5 ml-1">
                Purpose
              </label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-3 py-2.5 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-6"
                  value={filters.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">Select Purpose</option>
                  <option value="RENT" className="text-gray-900 bg-white">For Rent</option>
                  <option value="SALE" className="text-gray-900 bg-white">For Sale</option>
                </select>
                <ChevronDown className="w-4 h-4 text-white/80 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Price Range Field */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1.5 ml-1">
                Price Range
              </label>
              <div className="relative flex items-center bg-[#0070c0] hover:bg-[#0060a8] rounded-xl px-3 py-2.5 transition">
                <select
                  className="w-full text-xs font-semibold text-white bg-transparent outline-none cursor-pointer appearance-none pr-6"
                  value={filters.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                >
                  <option value="" className="text-gray-900 bg-white">$0 - $3,000+</option>
                  <option value="0-200" className="text-gray-900 bg-white">$0 - $200</option>
                  <option value="200-500" className="text-gray-900 bg-white">$200 - $500</option>
                  <option value="500-1500" className="text-gray-900 bg-white">$500 - $1,500</option>
                  <option value="1500+" className="text-gray-900 bg-white">$1,500+</option>
                </select>
                <ChevronDown className="w-4 h-4 text-white/80 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1 justify-end">
              <span className="hidden lg:block text-xs font-bold opacity-0 mb-1.5">Search</span>
              <button
                type="submit"
                className="w-full h-[41px] bg-[#0070c0] hover:bg-[#005da1] active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Popular Searches White Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white mr-1">
            Popular searches
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = activeTag === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagClick(tag.value)}
                className={`text-xs px-5 py-2 rounded-full font-bold transition duration-150 cursor-pointer shadow-sm border ${
                  isSelected
                    ? 'bg-[#0070c0] text-white border-[#0070c0]'
                    : 'bg-white text-[#0070c0] border-white hover:border-[#0070c0]'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}