import axiosInstance from '../config/axios';

// GET /home
export const getHomeData = async () => {
  return await axiosInstance.get('/home');
};

// GET /properties (Supports page, size, property_type, purpose, location)
export const getProperties = async (filters = {}) => {
  const params = {
    page: filters.page || 1,
    size: filters.size || 12,
  };

  if (filters.propertyType) params.property_type = filters.propertyType;
  if (filters.purpose) params.purpose = filters.purpose;
  if (filters.location) params.location = filters.location;

  return await axiosInstance.get('/properties', { params });
};

// GET /properties/:id
export const getPropertyById = async (idOrSlug) => {
  return await axiosInstance.get(`/properties/${idOrSlug}`);
};

// GET /locations
export const getLocations = async () => {
  return await axiosInstance.get('/locations');
};

// POST /auth/login
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  if (response?.access_token) {
    localStorage.setItem('access_token', response.access_token);
  }
  return response;
};

// GET /auth/me
export const getCurrentUser = async () => {
  return await axiosInstance.get('/auth/me');
};

// GET /properties/:id/similar
export const getSimilarProperties = async (idOrSlug) => {
  return await axiosInstance.get(`/properties/${idOrSlug}/similar`);
};