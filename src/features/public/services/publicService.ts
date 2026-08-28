import type { HomeData, Location, FAQ, HelpTopic, Property, PropertyFilters, ListResponse, InquiryRequest, FavoriteResponse } from '../../../types';
import {
  getHomeData,
  getProperties,
  getPropertyById,
  getLocations,
  getSimilarProperties,
  getHelpTopics,
  getFAQs,
  getFavorites,
  addFavorite,
  removeFavorite,
  sendInquiry,
} from '../../../service/api';

export const fetchHomeData = async (): Promise<HomeData> => {
  return getHomeData();
};

export const fetchProperties = async (filters: PropertyFilters = {}): Promise<ListResponse<Property>> => {
  return getProperties(filters);
};

export const fetchPropertyById = async (idOrSlug: string | number): Promise<{ property: Property }> => {
  return getPropertyById(idOrSlug);
};

export const fetchLocations = async (): Promise<Location[]> => {
  return getLocations();
};

export const fetchSimilarProperties = async (idOrSlug: string | number): Promise<Property[]> => {
  return getSimilarProperties(idOrSlug);
};

export const fetchHelpTopics = async (): Promise<HelpTopic[]> => {
  return getHelpTopics();
};

export const fetchFAQs = async (topicId?: number, search = ''): Promise<FAQ[]> => {
  return getFAQs(topicId, search);
};

export const fetchUserFavorites = async (): Promise<Property[]> => {
  return getFavorites();
};

export const favoriteProperty = async (propertyId: number | string): Promise<FavoriteResponse> => {
  return addFavorite(propertyId);
};

export const unfavoriteProperty = async (propertyId: number | string): Promise<FavoriteResponse> => {
  return removeFavorite(propertyId);
};

export const createInquiry = async (propertyId: number | string, data: InquiryRequest) => {
  return sendInquiry(propertyId, data);
};
