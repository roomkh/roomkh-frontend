import type { SellerRequestData, SellerProperty, ListResponse } from '../../../types';
import {
  submitSellerRequestApi,
  getSellerProperties,
  getSellerDashboard as getSellerDashboardApi,
  createSellerProperty,
  updateSellerProperty,
  submitSellerProperty,
  updateSellerPropertyStatus,
  deleteSellerProperty,
  uploadPropertyImage,
  deletePropertyImage,
  reorderPropertyImages,
  getMySellerRequest,
} from '../../../service/api';

export const submitSellerRequest = async (formData: SellerRequestData) => {
  return submitSellerRequestApi(formData);
};

export const getSellerPropertiesList = async (filters?: { status?: string; page?: number; size?: number }): Promise<ListResponse<SellerProperty>> => {
  return getSellerProperties(filters);
};

export const getSellerDashboard = async () => {
  return getSellerDashboardApi();
};

export const getSellerDashboardData = async () => {
  return getSellerDashboardApi();
};

export const createProperty = async (data: Partial<SellerProperty>) => {
  return createSellerProperty(data);
};

export const updateProperty = async (propertyId: number | string, data: Partial<SellerProperty>) => {
  return updateSellerProperty(propertyId, data);
};

export const submitPropertyForReview = async (propertyId: number | string) => {
  return submitSellerProperty(propertyId);
};

export const changePropertyStatus = async (propertyId: number | string, status: string) => {
  return updateSellerPropertyStatus(propertyId, status);
};

export const removeProperty = async (propertyId: number | string) => {
  return deleteSellerProperty(propertyId);
};

export const addPropertyImage = async (propertyId: number | string, data: { image_url: string; is_cover?: boolean; sort_order?: number }) => {
  return uploadPropertyImage(propertyId, data);
};

export const removePropertyImage = async (propertyId: number | string, imageId: number | string) => {
  return deletePropertyImage(propertyId, imageId);
};

export const orderPropertyImages = async (propertyId: number | string, images: { id: number; sort_order?: number; is_cover?: boolean }[]) => {
  return reorderPropertyImages(propertyId, images);
};

export const checkSellerRequestStatus = async () => {
  return getMySellerRequest();
};

// Backward-compatible aliases
export { getSellerProperties };
