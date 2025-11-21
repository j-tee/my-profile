import apiClient from './api';
import type { 
  Profile, 
  CreateProfileDTO, 
  UpdateProfileDTO
} from '../types';

const PROFILE_ENDPOINT = '/profiles';

export const profileService = {
  /**
   * Get portfolio owner's public profile by ID
   * Public endpoint - no authentication required
   * See API docs: GET /api/profiles/{profile_id}/
   */
  getPortfolioOwnerProfile: async (profileId: string): Promise<Profile> => {
    try {
      const response = await apiClient.get<Profile>(`${PROFILE_ENDPOINT}/${profileId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio owner profile:', error);
      throw error;
    }
  },

  /**
   * List all public profiles
   * Public endpoint - no authentication required
   * See API docs: GET /api/profiles/
   */
  listProfiles: async (): Promise<{ count: number; results: Profile[] }> => {
    try {
      const response = await apiClient.get<{ count: number; results: Profile[] }>(`${PROFILE_ENDPOINT}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to list profiles:', error);
      // Return empty list on error
      return { count: 0, results: [] };
    }
  },

  /**
   * Get authenticated user's profile (requires auth)
   * See API docs: GET /api/auth/profile/
   */
  getMyProfile: async (): Promise<Profile> => {
    try {
      const response = await apiClient.get<Profile>('/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Return a minimal profile structure
      return {
        id: 'unknown',
        first_name: '',
        last_name: '',
        email: '',
        headline: 'Full Stack Developer',
        summary: 'Building exceptional digital experiences with cutting-edge technologies',
        city: '',
        state: '',
        country: '',
      };
    }
  },

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
