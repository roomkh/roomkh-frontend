import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://roomkh-mock-api.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT access_token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor to unwrap response wrappers: { success: true, data: {} }
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      response.data.success !== undefined &&
      response.data.data !== undefined
    ) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default axiosInstance;
