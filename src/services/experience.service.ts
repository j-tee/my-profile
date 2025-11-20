import apiClient from './api';
import type { 
  Experience, 
  CreateExperienceDTO, 
  UpdateExperienceDTO, 
  ApiResponse,
  PaginatedResponse,
  QueryParams 
} from '../types';

const EXPERIENCE_ENDPOINT = '/experiences';

export const experienceService = {
  /**
   * Get all experiences for a profile
   */
  getExperiences: async (profileId: string, params?: QueryParams): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Experience>>>(
      EXPERIENCE_ENDPOINT,
      { params: { ...params, profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get experience by ID
   */
  getExperienceById: async (id: string): Promise<Experience> => {
    const response = await apiClient.get<ApiResponse<Experience>>(`${EXPERIENCE_ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Create new experience
   */
  createExperience: async (data: CreateExperienceDTO): Promise<Experience> => {
    const response = await apiClient.post<ApiResponse<Experience>>(EXPERIENCE_ENDPOINT, data);
    return response.data.data;
  },

  /**
   * Update experience
   */
  updateExperience: async (id: string, data: UpdateExperienceDTO): Promise<Experience> => {
    const response = await apiClient.patch<ApiResponse<Experience>>(
      `${EXPERIENCE_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete experience
   */
  deleteExperience: async (id: string): Promise<void> => {
    await apiClient.delete(`${EXPERIENCE_ENDPOINT}/${id}`);
  },

  /**
   * Reorder experiences
   */
  reorderExperiences: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(`${EXPERIENCE_ENDPOINT}/reorder`, { orders });
  },
};
