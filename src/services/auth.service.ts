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

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', data);
    return response.data;
  },

  // Logout user
  logout: (): void => {
    tokenManager.clearTokens();
  },

  // Get current user profile (auth profile)
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },

  // Get portfolio owner by user ID (public endpoint)
  // This fetches the user who owns the portfolio site
  // Since there's no dedicated public portfolio endpoint yet,
  // we'll fetch directly using the user ID once available
  getPortfolioOwnerById: async (userId: string): Promise<User> => {
    // TODO: Backend needs to provide a public endpoint like:
    // GET /api/users/{user_id}/public/ (no auth required)
    // For now, this will fail without proper backend endpoint
    const response = await apiClient.get<User>(`/users/${userId}/public/`);
    return response.data;
  },

  // Update user profile (now includes portfolio fields)
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

  // Email Verification
  verifyEmail: async (token: string): Promise<{ message: string; user: User }> => {
    const response = await apiClient.post<{ message: string; user: User }>(
      '/auth/verify-email/',
      { token }
    );
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/resend-verification/',
      { email }
    );
    return response.data;
  },

  // Password Reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password/reset/',
      { email }
    );
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password/reset/confirm/',
      {
        token,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      }
    );
    return response.data;
  },
};
