import { apiClient } from './apiClient';
import type { 
  Project, 
  CreateProjectDTO, 
  UpdateProjectDTO, 
  ApiResponse,
  PaginatedResponse,
  QueryParams 
} from '../types';

const PROJECT_ENDPOINT = '/projects';

export const projectService = {
  /**
   * Get all projects for a profile
   */
  getProjects: async (profileId: string, params?: QueryParams): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>(
      PROJECT_ENDPOINT,
      { params: { ...params, profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get featured projects
   */
  getFeaturedProjects: async (profileId: string): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(
      `${PROJECT_ENDPOINT}/featured`,
      { params: { profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get project by ID
   */
  getProjectById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`${PROJECT_ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Create new project
   */
  createProject: async (data: CreateProjectDTO): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(PROJECT_ENDPOINT, data);
    return response.data.data;
  },

  /**
   * Update project
   */
  updateProject: async (id: string, data: UpdateProjectDTO): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `${PROJECT_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete project
   */
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`${PROJECT_ENDPOINT}/${id}`);
  },

  /**
   * Upload project images
   */
  uploadProjectImages: async (id: string, files: File[]): Promise<Project> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
    
    const response = await apiClient.post<ApiResponse<Project>>(
      `${PROJECT_ENDPOINT}/${id}/upload-images`,
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
   * Toggle featured status
   */
  toggleFeatured: async (id: string): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      `${PROJECT_ENDPOINT}/${id}/toggle-featured`
    );
    return response.data.data;
  },

  /**
   * Reorder projects
   */
  reorderProjects: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(`${PROJECT_ENDPOINT}/reorder`, { orders });
  },
};
