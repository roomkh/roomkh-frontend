export interface PropertyImage {
  id?: number;
  url: string;
  is_cover?: boolean;
  sort_order?: number;
}

export type Amenity = string | { name?: string; title?: string };

export interface Property {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;
  price?: number;
  currency?: string;
  price_unit?: string;
  priceUnit?: string;
  address?: string;
  province?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  size?: number;
  area?: number;
  is_featured?: boolean;
  is_saved?: boolean;
  isSaved?: boolean;
  cover_image_url?: string | null;
  coverImageUrl?: string;
  cover_image?: string;
  thumbnail?: string;
  images?: PropertyImage[];
  photos?: PropertyImage[];
  description?: string;
  listing_type?: string;
  purpose?: string;
  property_type?: string;
  amenities?: Amenity[];
  latitude?: number;
  lat?: number;
  longitude?: number;
  lng?: number;
  created_at?: string;
  owner_name?: string;
  phone_number?: string;
  phone?: string;
  telegram_username?: string;
  telegram?: string;
  views?: number;
  inquiries?: number;
  status?: string;
  owner?: Owner;
  seller?: Owner;
  agent?: Owner;
  user?: Owner;
  floor?: number;
  furnished?: boolean;
  age_years?: number;
  district?: string;
  commune?: string;
  rating?: number;
  view_count?: number;
  inquiry_count?: number;
  listed_at?: string;
}

export interface Owner {
  id?: string | number;
  name?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  avatar_url?: string;
  avatarUrl?: string;
  avatar?: string;
  photo_url?: string;
  photoUrl?: string;
  profile_picture?: string;
  telegram?: string;
  telegram_username?: string;
  whatsapp_number?: string;
  is_verified?: boolean;
  response_rate?: number;
  response_time?: string;
  member_since?: string;
  plan?: string;
  properties_count?: number;
  status?: string;
  joined_date?: string;
}

export interface PropertyFilters {
  location?: string;
  propertyType?: string;
  purpose?: string;
  priceRange?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  sort_by?: string;
  page?: number;
  size?: number;
  search?: string;
  [key: string]: string | number | undefined;
}

export interface ListResponse<T> {
  content?: T[];
  total?: number;
  totalElements?: number;
  current_page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface User {
  id?: string | number;
  email?: string;
  full_name?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  phone_number?: string;
  role?: string;
  status?: string;
  seller_status?: string;
  sellerStatus?: string;
  is_verified?: boolean;
  avatar_url?: string;
  avatarUrl?: string;
  photo_url?: string;
  photoUrl?: string;
  auth_provider?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  jwt?: string;
  user?: User;
  account?: User;
  tokens?: {
    access_token?: string;
    refresh_token?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  token_type?: string;
  expires_in?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  agreedTerms?: boolean;
}

export interface SellerRequestData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  companyName?: string;
  reason: string;
  agreedTerms: boolean;
}

export interface HomeData {
  featured_properties: PropertyCard[];
  popular_locations: Location[];
  property_types: string[];
}

export interface PropertyCard {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  currency: string;
  price_unit: string;
  status: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  is_featured: boolean;
  is_saved: boolean;
  rating: number;
  cover_image_url: string | null;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  property_count: number;
  image_url: string;
}

export interface HelpTopic {
  id: number;
  title: string;
  icon: string;
}

export interface FAQ {
  id: number;
  topic_id: number;
  question: string;
  answer: string;
}

export interface SellerDashboard {
  seller_status: string | null;
  total_properties: number;
  active_count: number;
  pending_count: number;
  draft_count: number;
  sold_rented_count: number;
  total_views: number;
  total_inquiries: number;
}

export interface SellerProperty {
  id: number;
  title: string;
  slug: string;
  property_type: string;
  purpose: string;
  price: number;
  currency: string;
  price_unit: string;
  status: string;
  province: string;
  district: string;
  commune: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  floor: number;
  furnished: boolean;
  age_years: number;
  amenities: string[];
  images: PropertyImage[];
  is_featured: boolean;
  is_saved: boolean;
  rating: number;
  view_count: number;
  inquiry_count: number;
  listed_at: string;
  updated_at?: string;
  owner: Owner;
}

export interface AdminSellerRequest {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  position: string;
  business_name: string;
  reason: string;
  status: string;
  submitted_at: string;
  admin_note?: string;
  reviewed_at?: string;
}

export interface AdminUser {
  id: number;
  user_id?: string;
  full_name: string;
  name?: string;
  email: string;
  phone_number: string;
  phone?: string;
  role: string;
  seller_status: string | null;
  auth_provider: string;
  account_status?: string;
  status?: string;
  joined_date?: string;
  avatar_url?: string;
}

export interface AdminDashboardStats {
  cards: {
    total_users: number;
    seekers_count: number;
    owners_count: number;
    user_growth: number;
    total_owners: number;
    pending_owners: number;
    churn_rate: number;
    owner_growth: number;
    total_listings: number;
    pending_listings: number;
    active_percentage: number;
    monthly_revenue: number;
    last_month_revenue: number;
  };
  platform_growth_chart: {
    labels: string[];
    user_signups: number[];
    listings_added: number[];
  };
  revenue_source_chart: Array<{
    name: string;
    value: number;
  }>;
}

export interface AdminUserStats {
  total?: number;
  active?: number;
  pending?: number;
  inactive?: number;
  seekers_count?: number;
  owners_count?: number;
  agents_count?: number;
  [key: string]: unknown;
}

export interface AdminOwnerStats {
  total?: number;
  active?: number;
  pending?: number;
  inactive?: number;
  [key: string]: unknown;
}

export interface AdminPropertyStats {
  total?: number;
  active?: number;
  pending?: number;
  inactive?: number;
  [key: string]: unknown;
}

export interface FavoriteResponse {
  property_id: number;
  is_saved: boolean;
}

export interface InquiryRequest {
  message: string;
  contact_method: string;
}

export interface InquiryResponse {
  id: number;
  property_id: number;
  user_id: number;
  message: string;
  contact_method: string;
  status: string;
  created_at: string;
}

export interface ImageUploadResponse {
  id: number;
  url: string;
  is_cover: boolean;
  sort_order: number;
  property_id: number;
}

export interface ImageOrderItem {
  id: number;
  sort_order?: number;
  is_cover?: boolean;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}
