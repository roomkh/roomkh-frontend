import axiosInstance from '../../../config/axios';

const TOKEN_KEYS = ['access_token', 'accessToken', 'token', 'jwt'];

const getTokenFromResponse = (response) => {
  for (const key of TOKEN_KEYS) {
    if (response?.[key]) return response[key];
  }

  if (response?.tokens?.access_token) return response.tokens.access_token;
  if (response?.tokens?.accessToken) return response.tokens.accessToken;

  return null;
};

const persistAuth = (response) => {
  const accessToken = getTokenFromResponse(response);
  const refreshToken = response?.refresh_token || response?.refreshToken || response?.tokens?.refresh_token;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

// POST /api/v1/auth/login
export const loginUser = async (credentials) => {
  const payload = {
    email: credentials.email,
    password: credentials.password,
    remember_me: credentials.rememberMe,
  };

  const response = await axiosInstance.post('/auth/login', payload);
  persistAuth(response);
  return response;
};

// POST /api/v1/auth/register
export const registerUser = async (userData) => {
  const payload = {
    full_name: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone_number: userData.phone,
    role: userData.role || 'USER', // 'USER', 'SELLER', 'AGENT'
  };

  const response = await axiosInstance.post('/auth/register', payload);
  persistAuth(response);
  return response;
};

// GET /api/v1/auth/me
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
};
