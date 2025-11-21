import apiClient, { tokenManager } from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ChangePasswordRequest,
  UpdateProfileRequest,
  MFASetupResponse,
  MFAVerifyRequest,
  MFADisableRequest,
} from '../types/auth.types';
import type { Profile } from '../types/profile.types';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    const authData = response.data;
    
    // Store profile data from registration response
    if (authData.profile) {
      localStorage.setItem('portfolio_profile', JSON.stringify(authData.profile));
    }
    
    return authData;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', data);
    const authData = response.data;
    
    // Store profile data from login response
    if (authData.profile) {
      localStorage.setItem('portfolio_profile', JSON.stringify(authData.profile));
    }
    
    return authData;
  },

  // Logout user
  logout: (): void => {
    tokenManager.clearTokens();
    localStorage.removeItem('portfolio_profile');
  },

  // Get current user profile (auth profile)
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/profile/', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/password/change/', data);
    return response.data;
  },

  // Setup MFA
  setupMFA: async (): Promise<MFASetupResponse> => {
    const response = await apiClient.post<MFASetupResponse>('/auth/mfa/setup/');
    return response.data;
  },

  // Verify and enable MFA
  verifyMFA: async (data: MFAVerifyRequest): Promise<{ message: string; mfa_enabled: boolean }> => {
    const response = await apiClient.post<{ message: string; mfa_enabled: boolean }>(
      '/auth/mfa/verify/',
      data
    );
    return response.data;
  },

  // Disable MFA
  disableMFA: async (data: MFADisableRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/mfa/disable/', data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  // Get current user's portfolio profile (full profile data)
  getMyPortfolioProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>('/auth/my-portfolio-profile/');
    return response.data;
  },
};
