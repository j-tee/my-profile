import apiClient from './api';
import type { 
  Education, 
  CreateEducationDTO, 
  UpdateEducationDTO, 
  PaginatedResponse,
  QueryParams 
} from '../types';

const EDUCATION_ENDPOINT = '/education';

export const educationService = {
  /**
   * Get all education records for a user
   */
  getEducation: async (userId: string, params?: QueryParams): Promise<PaginatedResponse<Education>> => {
    const response = await apiClient.get<PaginatedResponse<Education>>(
      EDUCATION_ENDPOINT,
      { params: { ...params, user_id: userId } }
    );
    return response.data;
  },

  /**
   * Get education by ID
   */
  getEducationById: async (id: string): Promise<Education> => {
    const response = await apiClient.get<Education>(`${EDUCATION_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new education record
   */
  createEducation: async (data: CreateEducationDTO): Promise<Education> => {
    const response = await apiClient.post<Education>(EDUCATION_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update education record
   */
  updateEducation: async (id: string, data: UpdateEducationDTO): Promise<Education> => {
    const response = await apiClient.patch<Education>(
      `${EDUCATION_ENDPOINT}/${id}`,
      data
    );
    return response.data;
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
