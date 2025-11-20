import { apiClient } from './apiClient';
import type {
  UserDetail,
  UpdateUserRequest,
  CreateUserRequest,
  UserStats,
  PaginatedUsers,
} from '../types/user.types';

export const userService = {
  // Get all users (admin only)
  list: async (params?: { page?: number; search?: string; role?: string; is_active?: boolean }): Promise<PaginatedUsers> => {
    const response = await apiClient.get<PaginatedUsers>('/users/', { params });
    return response.data;
  },

  // Get user statistics (admin only)
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/users/stats/');
    return response.data;
  },

  // Get user by ID (admin only)
  get: async (id: string): Promise<UserDetail> => {
    const response = await apiClient.get<UserDetail>(`/users/${id}/`);
    return response.data;
  },

  // Create new user (super_admin only)
  create: async (data: CreateUserRequest): Promise<UserDetail> => {
    const response = await apiClient.post<UserDetail>('/users/', data);
    return response.data;
  },

  // Update user (super_admin only)
  update: async (id: string, data: UpdateUserRequest): Promise<UserDetail> => {
    const response = await apiClient.patch<UserDetail>(`/users/${id}/`, data);
    return response.data;
  },

  // Delete user (super_admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}/`);
  },

  // Deactivate user (super_admin only)
  deactivate: async (id: string): Promise<UserDetail> => {
    const response = await apiClient.post<UserDetail>(`/users/${id}/deactivate/`);
    return response.data;
  },

  // Activate user (super_admin only)
  activate: async (id: string): Promise<UserDetail> => {
    const response = await apiClient.post<UserDetail>(`/users/${id}/activate/`);
    return response.data;
  },

  // Reset user password (super_admin only)
  resetPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/users/${id}/reset-password/`, {
      new_password: newPassword,
    });
    return response.data;
  },

  // Verify user email (super_admin only)
  verifyEmail: async (id: string): Promise<UserDetail> => {
    const response = await apiClient.post<UserDetail>(`/users/${id}/verify-email/`);
    return response.data;
  },
};
