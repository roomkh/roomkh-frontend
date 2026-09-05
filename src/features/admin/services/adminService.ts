import type {
  AdminDashboardStats,
  AdminOwnerStats,
  AdminPropertyStats,
  AdminSellerRequest,
  AdminUser,
  AdminUserStats,
  Owner,
  Property,
} from '../../../types';
import {
  getAdminSellerRequests,
  reviewSellerRequest,
  getAdminProperties,
  reviewAdminProperty,
  getAdminUsers,
  updateAdminUserStatus,
  getAdminDashboardStats,
  getAdminUsersStats,
  getAdminOwnersStats,
  getAdminPropertiesStats,
  getAdminOwners,
  getAdminPropertyById,
  exportAdminProperties,
  deleteAdminProperty,
} from '../../../service/api';

export const fetchAdminSellerRequests = async (status?: string): Promise<AdminSellerRequest[]> => {
  return getAdminSellerRequests(status);
};

export const reviewSellerRequestStatus = async (requestId: number | string, data: { status: string; admin_note?: string }): Promise<AdminSellerRequest> => {
  return reviewSellerRequest(requestId, data);
};

export const fetchAdminProperties = async (status?: string): Promise<Property[]> => {
  return getAdminProperties({ status });
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

export const fetchDashboardStats = async (): Promise<AdminDashboardStats> => {
  return getAdminDashboardStats();
};

export const fetchUsersStats = async (): Promise<AdminUserStats> => {
  return getAdminUsersStats();
};

export const fetchOwnersStats = async (): Promise<AdminOwnerStats> => {
  return getAdminOwnersStats();
};

export const fetchPropertiesStats = async (): Promise<AdminPropertyStats> => {
  return getAdminPropertiesStats();
};

export const fetchAdminOwners = async (params?: { page?: number; size?: number; search?: string; status?: string; plan?: string }): Promise<Owner[]> => {
  return getAdminOwners(params);
};

export const fetchAdminPropertiesList = async (params?: { page?: number; size?: number; status?: string; type?: string; city?: string; search?: string }): Promise<Property[]> => {
  return getAdminProperties(params);
};

export const fetchAdminPropertyDetail = async (propertyId: number | string): Promise<Property> => {
  return getAdminPropertyById(propertyId);
};

export const downloadPropertiesExport = async (params?: { status?: string }): Promise<Blob> => {
  return exportAdminProperties(params);
};

export const deleteProperty = async (propertyId: number | string): Promise<void> => {
  return deleteAdminProperty(propertyId);
};
