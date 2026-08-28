import { useEffect, useMemo, useState } from 'react';
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
  Send,
  Phone,
  MessageCircle,
  Wind,
  Wifi,
  Home as HomeIcon,
  Car,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import PropertyDetailSkeleton from '../../../components/skeletons/PropertyDetailSkeleton';
import PriceTag from '../../../components/property/PriceTag';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getPropertyById, getSimilarProperties } from '../../../service/api';
import { useLanguage } from '../../../context/LanguageContext';
import type { Owner, Property } from '../../../types';

// Helper to extract clean image URL strictly from API objects or strings
const getImageUrl = (image: unknown): string => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  const img = image as Record<string, unknown>;
  return (
    (typeof img.url === 'string' && img.url) ||
    (typeof img.image_url === 'string' && img.image_url) ||
    (typeof img.imageUrl === 'string' && img.imageUrl) ||
    (typeof img.src === 'string' && img.src) ||
    (typeof img.path === 'string' && img.path) ||
    (typeof img.cover_image_url === 'string' && img.cover_image_url) ||
    (typeof img.photo === 'string' && img.photo) ||
    (typeof img.file === 'string' && img.file) ||
    ''
  );
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    getPropertyById(id ?? '')
      .then((data) => {
        if (!isMounted) return;
        const prop = data?.property || data;
        setProperty(prop);
        setIsSaved(prop?.is_saved || prop?.isSaved || false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError(t('propertyDetail.loadError'));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    getSimilarProperties(id ?? '')
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? (data as Property[]) : [];
        setSimilarProperties(list.slice(0, 1));
      })
      .catch(() => {
        if (isMounted) setSimilarProperties([]);
      });

    return () => {
      isMounted = false;
    };
  }, [id, t]);

  // Dynamically build the full gallery directly from API property object
  const images = useMemo(() => {
    if (!property) return [];

    // Extract cover photo from API
    const cover =
      getImageUrl(property?.cover_image_url) ||
      getImageUrl(property?.coverImageUrl) ||
      getImageUrl(property?.cover_image) ||
      getImageUrl(property?.thumbnail) ||
      '';

    // Extract additional image list from API
    const rawImages = Array.isArray(property?.images)
      ? property.images
      : Array.isArray(property?.photos)
      ? property.photos
      : [];

    const extractedList = rawImages.map(getImageUrl).filter(Boolean);

    // Combine cover + images list without duplicates
    const combined = [cover, ...extractedList].filter(Boolean);
    const uniqueImages = Array.from(new Set(combined));

    // Fill missing grid slots using the cover image from API if fewer than 4 exist
    const primaryFallback = uniqueImages[0] || '';
    while (uniqueImages.length < 4) {
      uniqueImages.push(primaryFallback);
    }

    return uniqueImages.slice(0, 4);
  }, [property]);

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-12 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-800">{error || t('propertyDetail.notFound')}</p>
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0070c0] text-white text-xs font-bold hover:bg-[#005da1] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('propertyDetail.backToProperties')}
          </button>
        </div>
      </div>
    );
  }

  // Dynamic values directly from API
  const title = property.title || property.name || '';
  const address = property.address || property.location || property.province || '';
  const owner: Owner = property.owner || property.seller || property.agent || property.user || ({} as Owner);
  const ownerName = owner.full_name || owner.fullName || owner.name || property.owner_name || '';
  const ownerAvatar = getImageUrl(owner.avatar) || getImageUrl(owner.avatar_url) || getImageUrl(owner.profile_picture) || images[0];
  const ownerPhone = owner.phone_number || owner.phone || property.phone_number || property.phone || '';
  const ownerTelegram = owner.telegram_username || owner.telegram || '';

  // Similar property details strictly from API
  const similar = similarProperties[0] || null;
  const similarImage =
    getImageUrl(similar?.cover_image_url) ||
    getImageUrl(similar?.coverImageUrl) ||
    getImageUrl(similar?.images?.[0]) ||
    images[0];

  const quickSpecs = [
    { icon: Bed, label: `${property.bedrooms || 0} Bedroom` },
    { icon: Bath, label: `${property.bathrooms || 0} Bathroom` },
    { icon: Maximize, label: `${property.size_sqm || property.size || property.area || 0} m²` },
  ];

  const amenitiesList = Array.isArray(property.amenities)
    ? property.amenities.map((item) => ({
        icon: CheckCircle2,
        label: typeof item === 'string' ? item : item.name || item.title || '',
      }))
    : [
        { icon: Wind, label: 'Air Conditioning' },
        { icon: Wifi, label: 'Free Wi-Fi' },
        { icon: HomeIcon, label: 'Balcony' },
        { icon: Car, label: 'Parking' },
        { icon: Building2, label: 'Elevator' },
        { icon: ShieldCheck, label: '24/7 Security' },
      ];

  const lat = property.latitude || property.lat || 11.5564;
  const lng = property.longitude || property.lng || 104.9282;

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
            <span>{t('propertyDetail.breadcrumbHome')}</span>
          </button>
          <span>&gt;</span>
          <Link to="/properties" className="hover:text-[#0070c0] transition">{t('propertyDetail.breadcrumbViewAll')}</Link>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">{t('propertyDetail.breadcrumbDetails')}</span>
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
              <span>{t('propertyDetail.share')}</span>
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
              <span>{isSaved ? t('propertyDetail.saved') : t('propertyDetail.save')}</span>
            </button>
          </div>

          {/* Grid Layout: API Images Left, Specs Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Dynamic Gallery Left (Sourced exclusively from API) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2 h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
               
              {/* API Featured Cover Image */}
              <div className="col-span-1 sm:col-span-2 h-48 sm:h-full bg-gray-100 overflow-hidden rounded-xl">
                <img 
                  src={images[0]} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* API Secondary Stacked Images */}
              <div className="col-span-1 sm:col-span-1 grid grid-cols-3 sm:grid-rows-3 gap-2 h-24 sm:h-full min-h-0">
                {[images[1], images[2], images[3]].map((image, index) => (
                  <div key={index} className="w-full h-full min-h-0 bg-gray-100 overflow-hidden rounded-xl">
                    <img
                      src={image}
                      alt={`${title} ${index + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Meta Right */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 pt-1">
              <div>
                <PriceTag
                  price={property.price || 0}
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
                <span>{t('propertyDetail.propertyId')}: {property.id || id}</span>
                <span>{t('propertyDetail.listedAgo')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Details & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Details Left */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About This Property */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-900">{t('propertyDetail.aboutTitle')}</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description || t('propertyDetail.aboutDesc')}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-gray-900">{t('propertyDetail.amenitiesTitle')}</h2>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(({ icon: Icon, label }, idx) => (
                  <span
                    key={idx}
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
              <h2 className="text-lg font-extrabold text-gray-900">{t('propertyDetail.locationTitle')}</h2>
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
                  <span>{t('propertyDetail.openInMaps')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar Right */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Owner Details */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-lg font-extrabold text-gray-900">{t('propertyDetail.ownerTitle')}</h2>

              <div className="flex items-center gap-3">
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{ownerName || 'Property Owner'}</h3>
                  <p className="text-[11px] text-[#0070c0] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> {t('propertyDetail.verifiedOwner')}
                  </p>
                </div>
              </div>

              {/* Action Contact Buttons */}
              <div className="space-y-2 pt-1">
                {ownerTelegram && (
                  <a
                    href={`https://t.me/${ownerTelegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-[#0070c0] hover:bg-[#005da1] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('propertyDetail.telegram')}</span>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {ownerPhone && (
                    <a
                      href={`tel:${ownerPhone}`}
                      className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('propertyDetail.call')}</span>
                    </a>
                  )}

                  {ownerPhone && (
                    <a
                      href={`https://wa.me/${ownerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('propertyDetail.whatsapp')}</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Similar Property Card from API */}
            {similar && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-gray-900">{t('propertyDetail.similarTitle')}</h2>
                  <Link to="/properties" className="text-xs font-semibold text-[#0070c0] hover:underline">
                    {t('propertyDetail.viewAll')}
                  </Link>
                </div>

                <Link 
                  to={`/properties/${similar.id || similar.slug}`} 
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-3 group items-start sm:items-center pt-1"
                >
                  <img
                    src={similarImage}
                    alt={similar.title || 'Similar property'}
                    className="w-full h-40 sm:h-24 sm:col-span-5 rounded-2xl object-cover bg-gray-100"
                  />
                  <div className="sm:col-span-7 min-w-0 space-y-1">
                    <p className="text-base font-extrabold text-gray-900 leading-none">
                      {formatCurrency(similar.price || 0)}
                      <span className="text-[10px] font-normal text-gray-400"> {t('property.perMonth')}</span>
                    </p>
                    <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#0070c0] transition">
                      {similar.title || similar.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">
                      {similar.address || similar.location || similar.province}
                    </p>
                  </div>
                </Link>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
