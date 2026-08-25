import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Share2,
  Heart,
  ExternalLink,
  CheckCircle2,
  Star,
  Send,
  Phone,
  MessageCircle,
  Wind,
  Wifi,
  Home as HomeIcon,
  Car,
  ShieldCheck,
  Building2
} from 'lucide-react';
import PropertyDetailSkeleton from '../../../components/skeletons/PropertyDetailSkeleton';
import PriceTag from '../../../components/property/PriceTag';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getPropertyById, getSimilarProperties } from '../../../service/api';

const fallbackImage =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80';

const ownerAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || image.image_url || image.src || null;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    getPropertyById(id)
      .then((data) => {
        if (!isMounted) return;
        const prop = data?.property || data;
        setProperty(prop);
        setIsSaved(prop?.is_saved || false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load this property. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    getSimilarProperties(id)
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.content || data?.properties || [];
        setSimilarProperties(list.slice(0, 1));
      })
      .catch(() => {
        if (isMounted) setSimilarProperties([]);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const galleryImages = useMemo(() => {
    const images = [
      property?.cover_image_url,
      property?.coverImageUrl,
      ...(Array.isArray(property?.images) ? property.images.map(getImageUrl) : []),
    ].filter(Boolean);

    return [...new Set(images)].slice(0, 4);
  }, [property]);

  if (loading) return <PropertyDetailSkeleton />;

  if (error || !property) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-12 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-800">{error || 'Property not found.'}</p>
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0070c0] text-white text-xs font-bold hover:bg-[#005da1] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to properties
          </button>
        </div>
      </div>
    );
  }

  const title = property.title || property.name || 'Studio Room In BKK1';
  const address = property.address || property.location || property.province || 'BKK1, Phnom Penh, Cambodia';
  const owner = property.owner || property.seller || property.agent || {};
  const ownerName = owner.full_name || owner.fullName || owner.name || property.owner_name || 'Dara Property';
  const ownerPhone = owner.phone_number || owner.phone || property.phone_number || property.phone || '+85512345678';
  const ownerTelegram = owner.telegram_username || 'roomkhSeller';
  const images = galleryImages.length ? galleryImages : [fallbackImage];
  
  const similar = similarProperties[0] || property;
  const similarImage =
    similar?.cover_image_url ||
    similar?.coverImageUrl ||
    getImageUrl(similar?.images?.[0]) ||
    images[0];

  const quickSpecs = [
    { icon: Bed, label: `${property.bedrooms || 1} Bedroom` },
    { icon: Bath, label: `${property.bathrooms || 1} Bathroom` },
    { icon: Maximize, label: `${property.size_sqm || property.size || 45} m²` },
  ];

  const amenitiesList = [
    { icon: Wind, label: 'Air Conditioning' },
    { icon: Wifi, label: 'Free Wi-Fi' },
    { icon: HomeIcon, label: 'Balcony' },
    { icon: Car, label: 'Parking' },
    { icon: Building2, label: 'Elevator' },
    { icon: ShieldCheck, label: 'Laundry Area' },
    { icon: CheckCircle2, label: 'Pet Friendly' },
    { icon: ShieldCheck, label: '24/7 Security' },
  ];

  const lat = property.latitude || 11.5564;
  const lng = property.longitude || 104.9282;

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-12 py-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-[#0070c0] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0070c0]" />
            <span>Home</span>
          </button>
          <span>&gt;</span>
          <Link to="/properties" className="hover:text-[#0070c0] transition">View all</Link>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">Details</span>
        </div>

        {/* Top Hero Card Section */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          
          {/* Share & Save Top Right Actions */}
          <div className="flex justify-end items-center gap-2">
            <button 
              type="button"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0070c0]" />
              <span>Share</span>
            </button>
            <button 
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isSaved 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-[#0070c0] text-white hover:bg-[#005da1] shadow-xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-600 text-red-600' : 'text-white'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Grid Layout: Images Left, Specs Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Gallery Left */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-2 h-64 sm:h-80 rounded-2xl overflow-hidden">
              <div className="col-span-2 h-full bg-gray-100 overflow-hidden">
                <img src={images[0]} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 grid grid-rows-3 gap-2 h-full">
                {[images[1], images[2], images[3]].map((image, index) => (
                  <div key={index} className="w-full h-full bg-gray-100 overflow-hidden">
                    <img
                      src={image || images[0]}
                      alt={`${title} thumb ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Right */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 pt-1">
              <div>
                <PriceTag
                  price={property.price || 650}
                  currency={property.currency}
                  priceUnit={property.price_unit || property.priceUnit}
                  purpose={property.purpose}
                  size="lg"
                />
                <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">{title}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0070c0]" />
                  <span>{address}</span>
                </p>

                {/* Quick Spec Pills */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {quickSpecs.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 bg-[#0070c0] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-4 border-t border-gray-100">
                <span>Property ID: {property.id || id || '1234567'}</span>
                <span>Listed 2 days ago</span>
              </div>
            </div>

          </div>
        </div>

        {/* Content Layout: Details Left & Sidebar Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Details Left */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About This Property */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-900">About This Property</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {property.description ||
                  'Enjoy comfortable city living in this fully furnished one-bedroom studio located in the BKK1, Phnom Penh. The studio features a bright living room, modern kitchen, private balcony, and large windows with beautiful city views. Conveniently located near shopping malls, restaurants, cafes, schools, and public transportation.'}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-gray-900">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0070c0] px-3.5 py-1.5 text-xs font-semibold text-white"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Location & Map Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-gray-900">Location</h2>
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
                <iframe
                  title="Property Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                  className="w-full h-full filter saturate-150"
                />
                <a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 left-4 bg-[#0070c0] hover:bg-[#005da1] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar Right */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Owner Details Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-lg font-extrabold text-gray-900">Owner</h2>

              <div className="flex items-center gap-3">
                <img
                  src={owner.avatar_url || owner.avatarUrl || ownerAvatar}
                  alt={ownerName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{ownerName}</h3>
                  <p className="text-[11px] text-[#0070c0] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Verified Owner
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Member since January 2022
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-1 border-t border-gray-50">
                <p className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Response Rate 98%</span>
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  ⏱ <span>Response Time usually replies within 1 hour</span>
                </p>
              </div>

              {/* Action Contact Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://t.me/${ownerTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#0070c0] hover:bg-[#005da1] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${ownerPhone}`}
                    className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${ownerPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Similar Properties Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">Similar Properties</h2>
                <Link to="/properties" className="text-xs font-semibold text-[#0070c0] hover:underline">
                  View all
                </Link>
              </div>

              <Link 
                to={`/properties/${similar?.id || similar?.slug || id}`} 
                className="grid grid-cols-12 gap-3 group items-center pt-1"
              >
                <img
                  src={similarImage}
                  alt={similar?.title || 'Similar property'}
                  className="col-span-5 h-24 rounded-2xl object-cover bg-gray-100"
                />
                <div className="col-span-7 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-extrabold text-gray-900 leading-none">
                      {formatCurrency(similar?.price || 180)}
                      <span className="text-[10px] font-normal text-gray-400"> / month</span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#0070c0] transition">
                    {similar?.title || 'Studio Room in BKK1'}
                  </h3>
                  <p className="text-[10px] text-gray-400 truncate">
                    {similar?.address || similar?.province || 'BKK1, Phnom Penh'}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-[#0070c0] font-semibold pt-1">
                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> 1 Bed</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> 1 Bath</span>
                    <span className="flex items-center gap-0.5"><Maximize className="w-3 h-3" /> 30 m²</span>
                  </div>
                </div>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}