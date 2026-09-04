import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Share2,
  Heart,
  ExternalLink,
  Send,
  Phone,
  MessageCircle,
  Wind,
  Wifi,
  Home as HomeIcon,
  Car,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Star,
  Clock,
} from 'lucide-react';
import PropertyDetailSkeleton from '../../../components/skeletons/PropertyDetailSkeleton';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getPropertyById, getSimilarProperties } from '../../../service/api';
import { useFavorites } from '../../../hooks/useFavorites';
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
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
     let isMounted = true;

    getPropertyById(id ?? '')
      .then((data) => {
        if (!isMounted) return;
        const prop = data as Property | null;
        setProperty(prop);
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

  // Dynamically build a 4-image gallery directly from API property object
  const images = useMemo(() => {
    if (!property) return [];

    const rawImages: Array<{ url: string; is_cover?: boolean; sort_order?: number }> = [];

    if (Array.isArray(property.images)) {
      for (const img of property.images) {
        const url = getImageUrl(img);
        if (url) rawImages.push({ url, is_cover: img.is_cover, sort_order: img.sort_order });
      }
    }

    if (rawImages.length === 0 && Array.isArray(property.photos)) {
      for (const img of property.photos) {
        const url = getImageUrl(img);
        if (url) rawImages.push({ url });
      }
    }

    const coverFromApi =
      getImageUrl(property.cover_image_url) ||
      getImageUrl(property.coverImageUrl) ||
      getImageUrl(property.cover_image) ||
      getImageUrl(property.thumbnail) ||
      '';

    if (coverFromApi && rawImages.length === 0) {
      rawImages.push({ url: coverFromApi, is_cover: true, sort_order: 0 });
    }

    rawImages.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    const uniqueImages = Array.from(new Set(rawImages.map((img) => img.url))).filter(Boolean);

    const cover = coverFromApi || uniqueImages[0] || '';
    if (cover && !uniqueImages.includes(cover)) {
      uniqueImages.unshift(cover);
    }

    while (uniqueImages.length < 4) {
      const fallback =
        uniqueImages[0] ||
        cover ||
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
      uniqueImages.push(fallback);
    }

    return uniqueImages.slice(0, 4);
  }, [property]);

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-12 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-xs">
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
  const address = property.address || property.location || property.province || 'BKK1, Phnom Penh, Cambodia';
  const owner: Owner = property.owner || property.seller || property.agent || property.user || ({} as Owner);
  const ownerName = owner.full_name || owner.fullName || owner.name || property.owner_name || 'Dara Property';
  const ownerAvatar =
    getImageUrl(owner.avatar) ||
    getImageUrl(owner.avatar_url) ||
    getImageUrl(owner.profile_picture) ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const ownerPhone = owner.phone_number || owner.phone || property.phone_number || property.phone || '';
  const ownerTelegram = owner.telegram_username || owner.telegram || 'daraproperty';

  // Similar property details
  const similar = similarProperties[0] || null;
  const similarImage =
    getImageUrl(similar?.cover_image_url) ||
    getImageUrl(similar?.coverImageUrl) ||
    getImageUrl(similar?.images?.[0]) ||
    images[0];

  const quickSpecs = [
    { label: `${property.bedrooms || 1} Bedroom` },
    { label: `${property.bathrooms || 1} Bathroom` },
    { label: `${property.size_sqm || property.size || property.area || 45} m²` },
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
        { icon: HomeIcon, label: 'Laundry Area' },
        { icon: ShieldCheck, label: 'Pet Friendly' },
        { icon: ShieldCheck, label: '24/7 Security' },
      ];

  const lat = property.latitude || property.lat || 11.5564;
  const lng = property.longitude || property.lng || 104.9282;

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 font-sans text-gray-900 antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-[#0070c0] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0070c0]" />
            <span>Home</span>
          </button>
          <span className="text-gray-400">&gt;</span>
          <Link to="/properties" className="hover:text-[#0070c0] transition">View all</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-900 font-bold">Details</span>
        </div>

        {/* Top Hero Container */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs relative">
          
          {/* Action Buttons Top Right */}
          <div className="absolute top-6 right-6 flex items-center gap-2.5 z-10">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0070c0]" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={() => property && toggleFavorite(property)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                property && isFavorite(property.id)
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-[#0070c0] text-white hover:bg-[#005da1] shadow-xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${property && isFavorite(property.id) ? 'fill-red-600 text-red-600' : 'text-white'}`} />
              <span>{property && isFavorite(property.id) ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 lg:pt-0">
            
            {/* Gallery Section Left */}
            <div className="lg:col-span-7 flex gap-2 h-[280px] sm:h-[320px] rounded-2xl overflow-hidden">
              <div className="w-2/3 h-full overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/3 flex flex-col gap-2 h-full">
                <div className="h-1/3 rounded-xl overflow-hidden bg-gray-100">
                  <img src={images[1]} alt={`${title} 2`} className="w-full h-full object-cover" />
                </div>
                <div className="h-1/3 rounded-xl overflow-hidden bg-gray-100">
                  <img src={images[2]} alt={`${title} 3`} className="w-full h-full object-cover" />
                </div>
                <div className="h-1/3 rounded-xl overflow-hidden bg-gray-100">
                  <img src={images[3]} alt={`${title} 4`} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Property Meta Right */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatCurrency(property.price || 650)}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">/ month</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
                  {title || 'Studio Room In BKK1'}
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#0070c0] shrink-0" />
                  <span>{address}</span>
                </p>

                {/* Spec Pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {quickSpecs.map(({ label }) => (
                    <span
                      key={label}
                      className="bg-[#0070c0] text-white rounded-full px-4 py-1.5 text-xs font-bold"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-6 border-t border-gray-100 font-medium">
                <span>Property ID: {property.id || '1234567'}</span>
                <span>Listed 2 days ago</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Content Left */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* About Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">About This Property</h2>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                {property.description ||
                  'Enjoy comfortable city living in this fully furnished one-bedroom studio located in the BKK1, Phnom Penh. The studio features a bright living room, modern kitchen, private balcony, and large windows with beautiful city views. Conveniently located near shopping malls, restaurants, cafés, schools, and public transportation.'}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(({ icon: Icon, label }, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0070c0] px-4 py-1.5 text-xs font-bold text-white"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Location</h2>
              <div className="relative h-64 rounded-2xl overflow-hidden border border-gray-100 shadow-2xs">
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
            
            {/* Owner Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Owner</h2>

              <div className="flex items-center gap-3">
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{ownerName}</h3>
                  <p className="text-xs text-[#0070c0] font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Owner
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Member since January 2022</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Response Rate 98%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0070c0]" />
                  <span>Response Time usually replies within 1 hour</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://t.me/${ownerTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#42a5f5] hover:bg-[#2196f3] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${ownerPhone || '012345678'}`}
                    className="py-2.5 bg-blue-50/70 hover:bg-blue-100/80 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${(ownerPhone || '012345678').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-blue-50/70 hover:bg-blue-100/80 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Similar Properties Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Similar Properties</h2>
                <Link to="/properties" className="text-xs font-bold text-[#0070c0] hover:underline">
                  View all
                </Link>
              </div>

              <Link
                to={`/properties/${similar?.id || '101'}`}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition group"
              >
                <img
                  src={similarImage}
                  alt={similar?.title || 'Similar property'}
                  className="w-24 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">
                      {formatCurrency(similar?.price || 180)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">/ month</span>
                    <div className="flex items-center gap-1 ml-auto text-[10px] font-bold text-gray-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#0070c0] transition">
                    {similar?.title || 'Studio Room in BKK1'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium truncate">
                    {similar?.address || 'BKK1, Phnom Penh'}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-0.5">
                    <span>1 Bed</span>
                    <span>1 Bath</span>
                    <span>30 m²</span>
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