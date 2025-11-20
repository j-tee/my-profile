import { apiClient } from './apiClient';
import type { 
  Profile, 
  CreateProfileDTO, 
  UpdateProfileDTO, 
  ApiResponse 
} from '../types';

const PROFILE_ENDPOINT = '/profiles';

export const profileService = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<ApiResponse<Profile>>(`${PROFILE_ENDPOINT}/me`);
    return response.data.data;
  },

  /**
   * Get profile by ID
   */
  getProfileById: async (id: string): Promise<Profile> => {
    const response = await apiClient.get<ApiResponse<Profile>>(`${PROFILE_ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Create a new profile
   */
  createProfile: async (data: CreateProfileDTO): Promise<Profile> => {
    const response = await apiClient.post<ApiResponse<Profile>>(PROFILE_ENDPOINT, data);
    return response.data.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (id: string, data: UpdateProfileDTO): Promise<Profile> => {
    const response = await apiClient.patch<ApiResponse<Profile>>(`${PROFILE_ENDPOINT}/${id}`, data);
    return response.data.data;
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    const response = await apiClient.post<ApiResponse<Profile>>(
      `${PROFILE_ENDPOINT}/${id}/upload-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Upload cover image
   */
  uploadCoverImage: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('cover_image', file);
    
    const response = await apiClient.post<ApiResponse<Profile>>(
      `${PROFILE_ENDPOINT}/${id}/upload-cover`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete profile
   */
  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`${PROFILE_ENDPOINT}/${id}`);
  },
};
