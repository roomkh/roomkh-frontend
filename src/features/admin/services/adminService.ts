import type { AdminSellerRequest, AdminUser, Property } from '../../../types';
import {
  getAdminSellerRequests,
  reviewSellerRequest,
  getAdminProperties,
  reviewAdminProperty,
  getAdminUsers,
  updateAdminUserStatus,
} from '../../../service/api';

export const fetchAdminSellerRequests = async (status?: string): Promise<AdminSellerRequest[]> => {
  return getAdminSellerRequests(status);
};

export const reviewSellerRequestStatus = async (requestId: number | string, data: { status: string; admin_note?: string }): Promise<AdminSellerRequest> => {
  return reviewSellerRequest(requestId, data);
};

export const fetchAdminProperties = async (status?: string): Promise<Property[]> => {
  return getAdminProperties(status);
};

export const reviewAdminPropertyStatus = async (propertyId: number | string, data: { status: string; admin_note?: string }): Promise<Property> => {
  return reviewAdminProperty(propertyId, data);
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  return getAdminUsers();
};

export const updateUserStatus = async (userId: number | string, status: string): Promise<AdminUser> => {
  return updateAdminUserStatus(userId, status);
};
