import axios from 'axios';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
        timestamp: new Date().toISOString(),
      };

      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }

      console.error('[API Response Error]', apiError);
      return Promise.reject(apiError);
    } else if (error.request) {
      const apiError: ApiError = {
        message: 'No response from server. Please check your internet connection.',
        status: 0,
        timestamp: new Date().toISOString(),
      };
      console.error('[API Network Error]', apiError);
      return Promise.reject(apiError);
    } else {
      const apiError: ApiError = {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        timestamp: new Date().toISOString(),
      };
      console.error('[API Setup Error]', apiError);
      return Promise.reject(apiError);
    }
  }
);
