import axiosInstance from '../config/axios';
import type {
  AdminSellerRequest,
  AdminUser,
  AuthResponse,
  FavoriteResponse,
  FAQ,
  HelpTopic,
  HomeData,
  ImageOrderItem,
  ImageUploadResponse,
  InquiryRequest,
  InquiryResponse,
  ListResponse,
  Location,
  Property,
  PropertyCard,
  PropertyFilters,
  SellerDashboard,
  SellerProperty,
  SellerRequestData,
  User,
} from '../types';

export const getHomeData = async (): Promise<HomeData> => {
  return axiosInstance.get('/home');
};

export const getProperties = async (filters: PropertyFilters = {}): Promise<ListResponse<PropertyCard>> => {
  const params: Record<string, unknown> = {
    page: filters.page || 1,
    size: filters.size || 12,
  };

  if (filters.propertyType) params.property_type = filters.propertyType;
  if (filters.purpose) params.purpose = filters.purpose;
  if (filters.location) params.location = filters.location;
  if (filters.minPrice) params.min_price = filters.minPrice;
  if (filters.maxPrice) params.max_price = filters.maxPrice;
  if (filters.bedrooms) params.bedrooms = filters.bedrooms;
  if (filters.bathrooms) params.bathrooms = filters.bathrooms;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.search) params.search = filters.search;
  if (filters.province) params.province = filters.province;
  if (filters.district) params.district = filters.district;

  return axiosInstance.get('/properties', { params });
};

export const getPropertyById = async (idOrSlug: string | number): Promise<{ property: Property }> =>
  axiosInstance.get(`/properties/${idOrSlug}`);

export const getLocations = async (): Promise<Location[]> =>
  axiosInstance.get('/locations');

export const getSimilarProperties = async (idOrSlug: string | number): Promise<PropertyCard[]> =>
  axiosInstance.get(`/properties/${idOrSlug}/similar`);

export const getHelpTopics = async (): Promise<HelpTopic[]> =>
  axiosInstance.get('/help/topics');

export const getFAQs = async (topicId?: number, search = ''): Promise<FAQ[]> => {
  const params: Record<string, unknown> = {};
  if (topicId) params.topic_id = topicId;
  if (search) params.search = search;
  return axiosInstance.get('/faqs', { params });
};

// Auth
export const loginUser = async (credentials: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResponse> => {
  const payload = {
    email: credentials.email,
    password: credentials.password,
    remember_me: credentials.rememberMe,
  };

  const response = (await axiosInstance.post('/auth/login', payload)) as unknown as AuthResponse;
  if (response?.access_token) {
    localStorage.setItem('access_token', response.access_token);
  }
  return response;
};

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  agreedTerms?: boolean;
}): Promise<AuthResponse> => {
  const payload = {
    full_name: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone_number: userData.phone,
    role: userData.role || 'USER',
    password_confirmation: userData.password,
  };

  const response = (await axiosInstance.post('/auth/register', payload)) as unknown as AuthResponse;
  if (response?.access_token) {
    localStorage.setItem('access_token', response.access_token);
  }
  return response;
};

export const getCurrentUser = async (): Promise<User> =>
  axiosInstance.get('/auth/me');

export const logoutUserApi = async (): Promise<void> =>
  axiosInstance.post('/auth/logout');

export const forgotPassword = async (email: string): Promise<{ message: string }> =>
  axiosInstance.post('/auth/forgot-password', { email });

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> =>
  axiosInstance.post('/auth/reset-password', { token, password });

export const mockGoogleLogin = async (): Promise<AuthResponse> =>
  axiosInstance.get('/auth/google/mock');

// Favorites
export const getFavorites = async (): Promise<Property[]> =>
  axiosInstance.get('/me/favorites');

export const addFavorite = async (propertyId: number | string): Promise<FavoriteResponse> =>
  axiosInstance.post(`/properties/${propertyId}/favorites`);

export const removeFavorite = async (propertyId: number | string): Promise<FavoriteResponse> =>
  axiosInstance.delete(`/properties/${propertyId}/favorites`);

// Inquiries
export const sendInquiry = async (propertyId: number | string, data: InquiryRequest): Promise<InquiryResponse> =>
  axiosInstance.post(`/properties/${propertyId}/inquiries`, data);

// Seller
export const getSellerDashboard = async (): Promise<SellerDashboard> =>
  axiosInstance.get('/seller/dashboard');

export const getSellerProperties = async (filters?: { status?: string; page?: number; size?: number }): Promise<ListResponse<SellerProperty>> => {
  const params: Record<string, unknown> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.page) params.page = filters.page;
  if (filters?.size) params.size = filters.size;
  return axiosInstance.get('/seller/properties', { params });
};

export const createSellerProperty = async (data: Partial<SellerProperty>): Promise<SellerProperty> =>
  axiosInstance.post('/seller/properties', data);

export const updateSellerProperty = async (propertyId: number | string, data: Partial<SellerProperty>): Promise<SellerProperty> =>
  axiosInstance.put(`/seller/properties/${propertyId}`, data);

export const submitSellerProperty = async (propertyId: number | string): Promise<{ id: number; status: string }> =>
  axiosInstance.post(`/seller/properties/${propertyId}/submit`);

export const updateSellerPropertyStatus = async (propertyId: number | string, status: string): Promise<{ id: number; status: string }> =>
  axiosInstance.patch(`/seller/properties/${propertyId}/status`, { status });

export const deleteSellerProperty = async (propertyId: number | string): Promise<void> =>
  axiosInstance.delete(`/seller/properties/${propertyId}`);

export const uploadPropertyImage = async (propertyId: number | string, data: {
  image_url: string;
  is_cover?: boolean;
  sort_order?: number;
}): Promise<ImageUploadResponse> =>
  axiosInstance.post(`/seller/properties/${propertyId}/images`, data);

export const deletePropertyImage = async (propertyId: number | string, imageId: number | string): Promise<void> =>
  axiosInstance.delete(`/seller/properties/${propertyId}/images/${imageId}`);

export const reorderPropertyImages = async (propertyId: number | string, images: ImageOrderItem[]): Promise<Property['images']> =>
  axiosInstance.patch(`/seller/properties/${propertyId}/images/order`, { images });

export const submitSellerRequestApi = async (formData: SellerRequestData): Promise<{ message: string; data: unknown }> => {
  const payload = {
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phone,
    position: formData.position,
    business_name: formData.companyName || '',
    reason: formData.reason,
    agree_terms: formData.agreedTerms,
  };

  return axiosInstance.post('/seller-requests', payload);
};

export const getMySellerRequest = async (): Promise<AdminSellerRequest | null> =>
  axiosInstance.get('/me/seller-request');

// Admin
export const getAdminSellerRequests = async (status?: string): Promise<AdminSellerRequest[]> => {
  const params: Record<string, unknown> = {};
  if (status) params.status = status;
  return axiosInstance.get('/admin/seller-requests', { params });
};

export const reviewSellerRequest = async (requestId: number | string, data: { status: string; admin_note?: string }): Promise<AdminSellerRequest> =>
  axiosInstance.patch(`/admin/seller-requests/${requestId}`, data);

export const getAdminProperties = async (status?: string): Promise<Property[]> => {
  const params: Record<string, unknown> = {};
  if (status) params.status = status;
  return axiosInstance.get('/admin/properties', { params });
};

export const reviewAdminProperty = async (propertyId: number | string, data: { status: string; admin_note?: string }): Promise<Property> =>
  axiosInstance.patch(`/admin/properties/${propertyId}/review`, data);

export const getAdminUsers = async (): Promise<AdminUser[]> =>
  axiosInstance.get('/admin/users');

export const updateAdminUserStatus = async (userId: number | string, status: string): Promise<AdminUser> =>
  axiosInstance.patch(`/admin/users/${userId}/status`, { status });
