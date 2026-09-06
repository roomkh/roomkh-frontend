import { useState } from "react";
import SelectDropdown from '../../../components/common/SelectDropdown';
import { 
  Bed, 
  Bath, 
  MapPin, 
  UploadCloud, 
  Trash2, 
  Wind, 
  Wifi, 
  ArrowUp, 
  Zap, 
  Building2, 
  Maximize2, 
  Eye, 
  Dumbbell, 
  Waves, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Dog 
} from "lucide-react";
import SellerPropertyPreviewModal from "./SellerPropertyPreviewModal";
import type { PropertyImage } from '../../../types';

export interface FormImage extends PropertyImage {
  id: number;
  file: File;
}

export interface PropertyFormData {
  title: string;
  property_type: string;
  purpose: string;
  price: string;
  price_unit: string;
  province: string;
  district: string;
  commune: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: string;
  size?: string;
  area?: string;
  floor: string;
  furnished: boolean;
  age_years: string;
  amenity_codes: string[];
  images: FormImage[];
  status?: string;
}

const PROPERTY_TYPE_OPTIONS = [
  { value: 'ROOM', label: 'Room' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'HOME', label: 'Home' },
  { value: 'TOURISM', label: 'Tourism Area' },
];

const PURPOSE_OPTIONS = [
  { value: 'RENT', label: 'Rent' },
  { value: 'SALE', label: 'Sale' },
];

const PROVINCE_OPTIONS = [
  { value: 'Phnom Penh', label: 'Phnom Penh' },
  { value: 'Siem Reap', label: 'Siem Reap' },
];

const DISTRICT_OPTIONS = [
  { value: 'Chamkarmon', label: 'Chamkarmon' },
  { value: 'Tuol Kouk', label: 'Tuol Kouk' },
];

const COMMUNE_OPTIONS = [
  { value: 'Boeng Keng Kang 1', label: 'BKK1' },
];

const AddPropertyForm = ({ onSubmit, loading }: { onSubmit: (data: PropertyFormData) => void; loading: boolean }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    property_type: "",
    purpose: "",
    price: "",
    price_unit: "MONTH",
    province: "",
    district: "",
    commune: "",
    address: "",
    description: "",
    bedrooms: 0,
    bathrooms: 0,
    size_sqm: "",
    floor: "",
    furnished: false,
    age_years: "",
    amenity_codes: [] as string[],
    images: [] as FormImage[],
  });

  const [images, setImages] = useState<FormImage[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Available amenities grouped by category
  const amenityCategories = [
    {
      title: "ESSENTIAL",
      items: [
        { code: "AIR_CONDITIONING", label: "Air Conditioning", icon: Wind },
        { code: "WIFI", label: "WiFi", icon: Wifi },
        { code: "ELEVATOR", label: "Elevator", icon: ArrowUp },
        { code: "GENERATOR", label: "Generator", icon: Zap },
      ],
    },
    {
      title: "COMFORT",
      items: [
        { code: "BALCONY", label: "Balcony", icon: Building2 },
        { code: "FULLY_FURNISHED", label: "Fully Furnished", icon: Maximize2 },
        { code: "CITY_VIEW", label: "City View", icon: Eye },
        { code: "BATHTUB", label: "Bathtub", icon: Bath },
      ],
    },
    {
      title: "FACILITIES",
      items: [
        { code: "GYM", label: "Gym", icon: Dumbbell },
        { code: "POOL", label: "Pool", icon: Waves },
        { code: "PARKING", label: "Parking", icon: Car },
        { code: "SECURITY_24H", label: "24h Security", icon: ShieldCheck },
      ],
    },
    {
      title: "SERVICES",
      items: [
        { code: "CLEANING", label: "Cleaning", icon: Sparkles },
        { code: "PET_FRIENDLY", label: "Pet Friendly", icon: Dog },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }) as PropertyFormData);
  };

  const setField = (name: string, value: string) => {
    setFormData((prev: PropertyFormData) => ({ ...prev, [name]: value }) as PropertyFormData);
  };

  const toggleAmenity = (code: string) => {
    setFormData((prev: PropertyFormData) => {
      const exists = prev.amenity_codes.includes(code);
      return {
        ...prev,
        amenity_codes: exists
          ? prev.amenity_codes.filter((c: string) => c !== code)
          : [...prev.amenity_codes, code],
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      file,
      is_cover: images.length === 0 && index === 0,
    }));
    setImages((prev: FormImage[]) => [...prev, ...newImages].slice(0, 10));
  };

  const removeImage = (id: number) => {
    setImages((prev: FormImage[]) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.is_cover)) {
        filtered[0].is_cover = true;
      }
      return filtered;
    });
  };

  const setCoverImage = (id: number) => {
    setImages((prev: FormImage[]) =>
      prev.map((img) => ({ ...img, is_cover: img.id === id }))
    );
  };

  const handleSubmit = (actionType: string) => {
    const status = actionType === "PUBLISH" ? "PENDING" : "DRAFT";
    onSubmit({ ...formData, status, images });
  };

  return (
    <div className="space-y-6">
      {/* Top 2 Columns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-slate-800 text-sm">
             Basic Details
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Property Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Apartment in BKK1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Property Type *</label>
              <SelectDropdown
                value={formData.property_type}
                onChange={(next) => setField('property_type', next)}
                options={PROPERTY_TYPE_OPTIONS}
                placeholder="Select type"
                ariaLabel="Select type"
                triggerClassName="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                placeholderClassName="text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Purpose *</label>
              <SelectDropdown
                value={formData.purpose}
                onChange={(next) => setField('purpose', next)}
                options={PURPOSE_OPTIONS}
                placeholder="Select purpose"
                ariaLabel="Select purpose"
                triggerClassName="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                placeholderClassName="text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700">Location *</label>
              <button type="button" className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Use map
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <SelectDropdown
                value={formData.province}
                onChange={(next) => setField('province', next)}
                options={PROVINCE_OPTIONS}
                placeholder="Province"
                ariaLabel="Province"
                triggerClassName="px-2 py-2 border-2 border-gray-300 rounded-lg text-xs bg-white"
                placeholderClassName="text-slate-400"
              />
              <SelectDropdown
                value={formData.district}
                onChange={(next) => setField('district', next)}
                options={DISTRICT_OPTIONS}
                placeholder="District"
                ariaLabel="District"
                triggerClassName="px-2 py-2 border-2 border-gray-300 rounded-lg text-xs bg-white"
                placeholderClassName="text-slate-400"
              />
              <SelectDropdown
                value={formData.commune}
                onChange={(next) => setField('commune', next)}
                options={COMMUNE_OPTIONS}
                placeholder="Commune"
                ariaLabel="Commune"
                triggerClassName="px-2 py-2 border-2 border-gray-300 rounded-lg text-xs bg-white"
                placeholderClassName="text-slate-400"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street number, House number (Optional)"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            <div className="text-right text-[10px] text-slate-400 mt-1">
              {formData.description.length} / 6500
            </div>
          </div>
        </div>

        {/* Right Column: Physical Details & Photos */}
        <div className="space-y-6">
          
          {/* Physical Details Box */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-800 text-xs border-b border-gray-100 pb-2">Physical Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Bedrooms</label>
                <div className="relative">
                  <Bed className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Bathrooms</label>
                <div className="relative">
                  <Bath className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Size (m²)</label>
                <input
                  type="number"
                  name="size_sqm"
                  value={formData.size_sqm}
                  onChange={handleChange}
                  placeholder="m²"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g. 5th"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <label className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Furnished
              </label>
              <input
                type="number"
                name="age_years"
                value={formData.age_years}
                onChange={handleChange}
                placeholder="Age (Years)"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Photos & Media Box */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-xs">Photos & Media</h3>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Max 10</span>
            </div>

            {/* Drop Zone */}
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-slate-50/50">
              <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xs font-medium text-slate-700">Drag and drop photos here</span>
              <span className="text-[10px] text-blue-600 hover:underline mt-0.5">
                or click to browse <span className="text-slate-400">(JPG, PNG)</span>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Uploaded Images List */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 h-20 bg-slate-100">
                    <img src={img.url} alt="Upload preview" className="w-full h-full object-cover" />
                    
                    {img.is_cover && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {!img.is_cover && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.id)}
                          className="p-1 bg-white/80 hover:bg-white rounded text-[10px] text-slate-800 font-semibold"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Section: Amenities & Features */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm border-b border-gray-100 pb-3 flex items-center gap-2">
          <span className="text-blue-600">≡</span> Amenities & Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenityCategories.map((cat) => (
            <div key={cat.title} className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{cat.title}</h4>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.amenity_codes.includes(item.code);
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => toggleAmenity(item.code)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-slate-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit("DRAFT")}
          className="px-5 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-lg transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-5 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-lg transition-colors"
        >
          Preview
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSubmit("PUBLISH")}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Save & Publish"}
        </button>
      </div>

      {showPreview && (
        <SellerPropertyPreviewModal
          property={formData}
          images={images}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default AddPropertyForm;