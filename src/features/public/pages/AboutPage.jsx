import React, { useState, useEffect } from 'react';
import {
  Target,
  Eye,
  Handshake,
  Scale,
  Lightbulb,
  HeartHandshake,
  Home,
  Key,
  Building2
} from 'lucide-react';
import AboutPageSkeleton from '../../../components/skeletons/AboutPageSkeleton';

export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AboutPageSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500">
          <span>Home</span> &gt; <span className="font-semibold text-gray-800">About Us</span>
        </div>

        {/* Header Title Section */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About RoomKH
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
            RoomKH is Cambodia's leading property marketplace, connecting buyers, renters, sellers, and verified property owners through a secure, modern and easy-to-use platform.
          </p>
        </div>

        {/* Golden Hour Sunset Cityscape Hero Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 sm:h-80 w-full">
          <img
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80"
            alt="Phnom Penh Skyline"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Our Mission & Our Vision Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                To simplify Cambodia's real estate experience by providing a trusted digital marketplace where people can discover, rent, buy and sell properties safely and efficiently.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Our Vision</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                To become Cambodia's leading online real estate platform by delivering innovative technology, trusted services, and exceptional customer experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Trust */}
            <div className="bg-blue-50/60 border border-blue-100/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Trust</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                We believe transparency builds long-lasting relationships.
              </p>
            </div>

            {/* Integrity */}
            <div className="bg-blue-50/60 border border-blue-100/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Integrity</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                We operate honestly and responsibly in every interaction.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-blue-50/60 border border-blue-100/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Innovation</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                We continuously improve our platform using modern technology.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-blue-50/60 border border-blue-100/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Customer First</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Every feature is designed to create a better experience for our users.
              </p>
            </div>
          </div>
        </div>

        {/* Our Service Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Our Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buy Property */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-900 mb-1">Buy Property</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Find verified rooms, apartments and condos for sale.
                </p>
              </div>
            </div>

            {/* Rent Property */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-900 mb-1">Rent Property</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Browse rental listings that fit your lifestyle and budget.
                </p>
              </div>
            </div>

            {/* Sell Property */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-900 mb-1">Sell Property</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Request seller approval and publish your property to thousands of buyers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
          <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-48 sm:h-56">
            <img
              src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80"
              alt="Phnom Penh Riverside"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-8 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              RoomKH is proudly developed by Techcy Company, a technology company dedicated to building innovative digital solutions. Our goal is to simplify the property journey in Cambodia by providing a secure, modern and user-friendly platform where people can confidently buy, rent and sell properties. Through continuous innovation and reliable services, we aim to make finding the perfect property easier for everyone.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}