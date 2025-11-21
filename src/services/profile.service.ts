import apiClient from './api';
import type { 
  Profile, 
  CreateProfileDTO, 
  UpdateProfileDTO
} from '../types';

const PROFILE_ENDPOINT = '/profiles';

export const profileService = {
  /**
   * Get current user's profile
   */
  getProfile: async (id?: string): Promise<Profile> => {
    const endpoint = id ? `${PROFILE_ENDPOINT}/${id}/` : `${PROFILE_ENDPOINT}/me/`;
    const response = await apiClient.get<{ profile: Profile; is_complete: boolean; needs_update: boolean }>(endpoint);
    // Backend returns { profile, is_complete, needs_update }
    return response.data.profile || response.data;
  },

  /**
   * Get profile by ID
   */
  getProfileById: async (id: string): Promise<Profile> => {
    const response = await apiClient.get<Profile>(`${PROFILE_ENDPOINT}/${id}/`);
    return response.data;
  },

  /**
   * Create a new profile
   */
  createProfile: async (data: CreateProfileDTO): Promise<Profile> => {
    const response = await apiClient.post<Profile>(PROFILE_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update profile (uses /profiles/me/ endpoint for current user)
   */
  updateProfile: async (_id: string, data: UpdateProfileDTO): Promise<Profile> => {
    // Use /profiles/me/ endpoint for updating current user's profile
    const endpoint = `${PROFILE_ENDPOINT}/me/`;
    const response = await apiClient.patch<{ profile: Profile; is_complete: boolean; needs_update: boolean }>(endpoint, data);
    // Backend returns { profile, is_complete, needs_update }
    return response.data.profile || response.data;
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    const response = await apiClient.post<Profile>(
      `${PROFILE_ENDPOINT}/${id}/upload-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Upload cover image
   */
  uploadCoverImage: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('cover_image', file);
    
    const response = await apiClient.post<Profile>(
      `${PROFILE_ENDPOINT}/${id}/upload-cover`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete profile
   */
  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`${PROFILE_ENDPOINT}/${id}`);
  },
};
