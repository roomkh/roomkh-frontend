import axiosInstance from '../../../config/axios';
import type { User } from '../../../types';

export const updateUserProfile = async (payload: {
  full_name: string;
  phone: string;
}): Promise<User> => {
  const response = (await axiosInstance.patch('/auth/me', payload)) as unknown as User;
  return response;
};
