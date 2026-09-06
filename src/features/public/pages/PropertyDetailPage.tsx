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
import ImageLightbox from '../../../components/property/ImageLightbox';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getOwnerProperties, getPropertyById } from '../../../service/api';
import {
  getMockTourismProperty,
  getMockTourismSimilar,
} from '../../../data/mockTourismProperties';
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
  const [apiProperty, setApiProperty] = useState<Property | null>(null);
  const [apiOwnerProperties, setApiOwnerProperties] = useState<Property[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  // Index of the image opened in the fullscreen viewer; null means closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mock tourism areas listed on /tourism are not on the API yet, so their
  // detail pages are served straight from the local mock data.
  const mockTourism = useMemo(() => getMockTourismProperty(id), [id]);
  const property = mockTourism ?? apiProperty;
  // Listings from the same owner, shown in the sidebar below the owner card.
  const ownerProperties = useMemo(
    () => (mockTourism ? getMockTourismSimilar(id) : apiOwnerProperties),
    [mockTourism, id, apiOwnerProperties]
  );
  const loading = mockTourism ? false : apiLoading;
  const error = mockTourism ? '' : apiError;

  useEffect(() => {
     let isMounted = true;

    if (mockTourism) return;

    getPropertyById(id ?? '')
      .then((data) => {
        if (!isMounted) return;
        const prop = data as Property | null;
        setApiProperty(prop);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiError(t('propertyDetail.loadError'));
      })
      .finally(() => {
        if (isMounted) setApiLoading(false);
      });

    getOwnerProperties(id ?? '')
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? (data as Property[]) : [];
        setApiOwnerProperties(list);
      })
      .catch(() => {
        if (isMounted) setApiOwnerProperties([]);
      });

    return () => {
      isMounted = false;
    };
  }, [id, t, mockTourism]);

  // Dynamically build the gallery directly from API property object:
  // `all` is every distinct photo (used by the fullscreen viewer), `grid` is
  // the 4 tiles of the hero collage, padded with repeats when photos are few.
  const gallery = useMemo<{ all: string[]; grid: string[] }>(() => {
    if (!property) return { all: [], grid: [] };

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

    const padded = [...uniqueImages];
    while (padded.length < 4) {
      const fallback =
        padded[0] ||
        cover ||
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
      padded.push(fallback);
    }
    if (uniqueImages.length === 0) uniqueImages.push(padded[0]);

    return { all: uniqueImages, grid: padded.slice(0, 4) };
  }, [property]);

  const images = gallery.grid;
  const lightboxImages = gallery.all;

  const openLightbox = (image: string) => {
    const index = lightboxImages.indexOf(image);
    setLightboxIndex(index >= 0 ? index : 0);
  };

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

  const getCardImage = (item: Property): string =>
    getImageUrl(item.cover_image_url) ||
    getImageUrl(item.coverImageUrl) ||
    getImageUrl(item.images?.[0]) ||
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
          
          {/* Owner Header + Contact & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <div className="flex items-center gap-3 min-w-0 sm:flex-1">
              <img
                src={ownerAvatar}
                alt={ownerName}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-gray-900 truncate">{ownerName}</h3>
                <p className="text-xs text-[#0070c0] font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Owner
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    98% response rate
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0070c0]" />
                    Replies within 1 hour
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <a
                href={`https://t.me/${ownerTelegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#42a5f5] hover:bg-[#2196f3] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              <a
                href={`tel:${ownerPhone || '012345678'}`}
                className="px-5 py-2.5 bg-blue-50/70 hover:bg-blue-100/80 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${(ownerPhone || '012345678').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-blue-50/70 hover:bg-blue-100/80 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0070c0]" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={() => property && toggleFavorite(property)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  property && isFavorite(property.id)
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-[#0070c0] text-white hover:bg-[#005da1] shadow-xs'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${property && isFavorite(property.id) ? 'fill-red-600 text-red-600' : 'text-white'}`} />
                <span>{property && isFavorite(property.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            
            {/* Gallery Section Left */}
            <div className="lg:col-span-7 flex gap-2 h-[280px] sm:h-[320px] rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => openLightbox(images[0])}
                aria-label="View photo 1 fullscreen"
                className="w-2/3 h-full overflow-hidden rounded-2xl bg-gray-100 cursor-zoom-in group"
              >
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </button>
              <div className="w-1/3 flex flex-col gap-2 h-full">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openLightbox(images[i])}
                    aria-label={`View photo ${i + 1} fullscreen`}
                    className="h-1/3 rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group relative"
                  >
                    <img
                      src={images[i]}
                      alt={`${title} ${i + 1}`}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.05]"
                    />
                    {i === 3 && lightboxImages.length > 4 && (
                      <span className="absolute inset-0 bg-black/50 text-white text-xs font-bold flex items-center justify-center">
                        +{lightboxImages.length - 4} more
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Meta Right */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatCurrency(property.price || 650)}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    / {(property.price_unit || property.priceUnit || 'MONTH').toLowerCase()}
                  </span>
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

            {/* Owner Listings Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  More from {ownerName}
                </h2>
                <span className="text-xs font-bold text-gray-400">
                  {ownerProperties.length}
                </span>
              </div>

              {ownerProperties.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium py-2">
                  This owner has no other listings right now.
                </p>
              ) : (
                <div className="space-y-4">
                  {ownerProperties.map((item) => (
                    <Link
                      key={item.id}
                      to={`/properties/${item.id}`}
                      className="flex items-center gap-5 p-3 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#0070c0]/40 hover:shadow-sm transition group"
                    >
                      <img
                        src={getCardImage(item)}
                        alt={item.title || 'Property'}
                        className="w-44 h-32 rounded-xl object-cover bg-gray-100 shrink-0"
                      />
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-gray-900">
                            {formatCurrency(item.price ?? 0)}
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            / {(item.price_unit || item.priceUnit || 'MONTH').toLowerCase()}
                          </span>
                          {item.rating != null && (
                            <div className="flex items-center gap-1 ml-auto text-xs font-bold text-gray-700">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-[#0070c0] transition">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium truncate">
                          {item.address || [item.district, item.province].filter(Boolean).join(', ')}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-1">
                          <span>{item.bedrooms ?? 0} Bed</span>
                          <span>{item.bathrooms ?? 0} Bath</span>
                          <span>{item.size_sqm ?? item.size ?? 0} m²</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Right */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
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

        </div>

      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={title || 'Property image'}
        />
      )}
    </div>
  );
}