import type { PropertyFormData, FormImage } from "./AddPropertyForm";
import { useState } from "react";
import { X, Bed, Bath, Maximize, MapPin, Phone, MessageCircle, Send, CheckCircle2, Share2, Heart } from "lucide-react";

const SellerPropertyPreviewModal = ({ property, images, onClose }: { property: PropertyFormData; images: (FormImage | string)[]; onClose: () => void }) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!property) return null;

  const title = property.title || "Untitled Property";
  const address = [property.address, property.district, property.province].filter(Boolean).join(", ") || "No address";
  const price = property.price || 0;
  const priceUnit = property.price_unit || "MONTH";
  const purpose = property.purpose || "RENT";
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const sizeSqm = property.size_sqm || 0;
  const description = property.description || "No description provided.";
  const floor = property.floor || "";
  const furnished = property.furnished ? "Yes" : "No";
  const ageYears = property.age_years || "";
  const amenities = Array.isArray(property.amenity_codes) ? property.amenity_codes : [];

  const amenityLabels: Record<string, string> = {
    AIR_CONDITIONING: "Air Conditioning",
    WIFI: "WiFi",
    ELEVATOR: "Elevator",
    GENERATOR: "Generator",
    BALCONY: "Balcony",
    FULLY_FURNISHED: "Fully Furnished",
    CITY_VIEW: "City View",
    BATHTUB: "Bathtub",
    GYM: "Gym",
    POOL: "Pool",
    PARKING: "Parking",
    SECURITY_24H: "24h Security",
    CLEANING: "Cleaning",
    PET_FRIENDLY: "Pet Friendly",
  };

  const displayImages = images && images.length > 0 ? images.map((img) => (typeof img === "string" ? img : img.url)) : [];

  const fallbackImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

  const previewImages = displayImages.length > 0 ? displayImages : [fallbackImage];
  while (previewImages.length < 4) {
    previewImages.push(previewImages[0] || fallbackImage);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>&gt;</span>
            <span className="font-semibold text-gray-800">Property Preview</span>
          </div>

          {/* Top Hero Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-3xl border border-gray-100 space-y-6">
            <div className="flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0070c0]" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isSaved ? "bg-red-50 text-red-600 border border-red-200" : "bg-[#0070c0] text-white hover:bg-[#005da1]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-600 text-red-600" : "text-white"}`} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Gallery */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-2 h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden">
                <div className="col-span-2 sm:col-span-2 sm:row-span-2 h-48 sm:h-full bg-gray-100 overflow-hidden rounded-xl min-h-0">
                  <img src={previewImages[0]} alt={title} className="w-full h-full object-cover" />
                </div>
                {[previewImages[1], previewImages[2], previewImages[3]].map((image, index) => (
                  <div key={index} className="h-24 sm:h-full bg-gray-100 overflow-hidden rounded-xl min-h-0">
                    <img src={image} alt={`${title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 pt-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">${price}</span>
                    <span className="text-xs font-normal text-gray-500">/ {priceUnit.toLowerCase()}</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">{title}</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0070c0]" />
                    <span>{address}</span>
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <span className="inline-flex items-center gap-1.5 bg-[#0070c0] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold">
                      <Bed className="w-3.5 h-3.5" /> {bedrooms} Bed
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#0070c0] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold">
                      <Bath className="w-3.5 h-3.5" /> {bathrooms} Bath
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#0070c0] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold">
                      <Maximize className="w-3.5 h-3.5" /> {sizeSqm} m²
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-4 border-t border-gray-100">
                  <span>Preview Mode</span>
                  <span>Draft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                <h2 className="text-lg font-extrabold text-gray-900">About This Property</h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-extrabold text-gray-900">Property Details</h2>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div><span className="font-semibold">Type:</span> {property.property_type || "-"}</div>
                  <div><span className="font-semibold">Purpose:</span> {purpose}</div>
                  <div><span className="font-semibold">Floor:</span> {floor || "-"}</div>
                  <div><span className="font-semibold">Furnished:</span> {furnished}</div>
                  {ageYears && <div><span className="font-semibold">Age:</span> {ageYears} years</div>}
                </div>
              </div>

              {amenities.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h2 className="text-lg font-extrabold text-gray-900">Amenities & Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((code: string) => (
                      <span key={code} className="inline-flex items-center gap-1.5 rounded-full bg-[#0070c0] px-3.5 py-1.5 text-xs font-semibold text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {amenityLabels[code] || code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                <h2 className="text-lg font-extrabold text-gray-900">Contact Seller</h2>
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    className="w-full py-2.5 bg-[#0070c0] hover:bg-[#005da1] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                    <button
                      type="button"
                      className="py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0070c0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPropertyPreviewModal;
