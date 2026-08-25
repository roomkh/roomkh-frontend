// src/features/public/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PropertyGrid from '../../../components/property/PropertyGrid';
import LocationBrowse from '../../../components/property/LocationBrowse';
import WhyChooseUs from '../../../components/common/WhyChooseUs';

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState({});

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleSelectLocation = (locationName) => {
    setSearchFilters((prev) => ({
      ...prev,
      location: locationName,
    }));
  };
const navigate = useNavigate();
  return (
    <>
      {/* Hero Section with Search Bar */}
      <HeroSection onSearch={handleSearch} />

      {/* Featured Properties Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured properties</h2>
        <button
  onClick={() => navigate('/properties')}
  className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
>
  View all
</button>
        </div>

        <PropertyGrid filters={searchFilters} />
      </section>

      {/* Locations Section */}
      <LocationBrowse onSelectLocation={handleSelectLocation} />

      {/* Trust & Value Proposition Banner */}
      <WhyChooseUs />
    </>
  );
}