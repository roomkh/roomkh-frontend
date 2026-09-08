import axiosInstance from '../../../config/axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../../../types';

const TOKEN_KEYS = ['access_token', 'accessToken', 'token', 'jwt'];

const getTokenFromResponse = (response: AuthResponse): string | null => {
  for (const key of TOKEN_KEYS) {
    const value = response[key as keyof AuthResponse];
    if (typeof value === 'string') return value;
  }

  if (response?.tokens?.access_token) return response.tokens.access_token;
  if (response?.tokens?.accessToken) return response.tokens.accessToken;

  return null;
};

const persistAuth = (response: AuthResponse): void => {
  const accessToken = getTokenFromResponse(response);
  const refreshToken =
    response?.refresh_token ||
    response?.refreshToken ||
    response?.tokens?.refresh_token;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const payload = {
    email: credentials.email,
    password: credentials.password,
    rememberMe: credentials.rememberMe,
  };

  const response = (await axiosInstance.post('/auth/login', payload)) as unknown as AuthResponse;
  persistAuth(response);
  return response;
};

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const payload = {
    full_name: userData.fullName,
    email: userData.email,
    password: userData.password,
    password_confirmation: userData.password,
  };

  const response = (await axiosInstance.post('/auth/register', payload)) as unknown as AuthResponse;
  persistAuth(response);
  return response;
};

export const googleLogin = async (credential: string): Promise<AuthResponse> => {
  const response = (await axiosInstance.post('/auth/google', { credential })) as unknown as AuthResponse;
  persistAuth(response);
  return response;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = (await axiosInstance.get('/auth/me')) as unknown as User;
  return response;
};

export const logoutUser = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
};
