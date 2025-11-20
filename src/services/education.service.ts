import apiClient from './api';
import type { 
  Education, 
  CreateEducationDTO, 
  UpdateEducationDTO, 
  ApiResponse,
  PaginatedResponse,
  QueryParams 
} from '../types';

const EDUCATION_ENDPOINT = '/education';

export const educationService = {
  /**
   * Get all education records for a profile
   */
  getEducation: async (profileId: string, params?: QueryParams): Promise<PaginatedResponse<Education>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Education>>>(
      EDUCATION_ENDPOINT,
      { params: { ...params, profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get education by ID
   */
  getEducationById: async (id: string): Promise<Education> => {
    const response = await apiClient.get<ApiResponse<Education>>(`${EDUCATION_ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Create new education record
   */
  createEducation: async (data: CreateEducationDTO): Promise<Education> => {
    const response = await apiClient.post<ApiResponse<Education>>(EDUCATION_ENDPOINT, data);
    return response.data.data;
  },

  /**
   * Update education record
   */
  updateEducation: async (id: string, data: UpdateEducationDTO): Promise<Education> => {
    const response = await apiClient.patch<ApiResponse<Education>>(
      `${EDUCATION_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete education record
   */
  deleteEducation: async (id: string): Promise<void> => {
    await apiClient.delete(`${EDUCATION_ENDPOINT}/${id}`);
  },

  /**
   * Reorder education records
   */
  reorderEducation: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(`${EDUCATION_ENDPOINT}/reorder`, { orders });
  },
};
