import { apiClient } from './apiClient';
import type { 
  ProjectListItem,
  ProjectDetail,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  PaginatedProjectsResponse,
  ProjectFilters,
  ProjectImage,
} from '../types';

const PROJECT_ENDPOINT = '/projects';

export const projectService = {
  /**
   * List all projects with optional filters
   * GET /api/projects/
   */
  getProjects: async (filters?: ProjectFilters): Promise<PaginatedProjectsResponse> => {
    const response = await apiClient.get<PaginatedProjectsResponse>(
      `${PROJECT_ENDPOINT}/`,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get featured projects only
   * GET /api/projects/featured/
   */
  getFeaturedProjects: async (): Promise<ProjectDetail[]> => {
    const response = await apiClient.get<ProjectDetail[]>(
      `${PROJECT_ENDPOINT}/featured/`
    );
    return response.data;
  },

  /**
   * Get projects by profile
   * GET /api/projects/by_profile/{profile_id}/
   */
  getProjectsByProfile: async (profileId: string, filters?: ProjectFilters): Promise<PaginatedProjectsResponse> => {
    const response = await apiClient.get<PaginatedProjectsResponse>(
      `${PROJECT_ENDPOINT}/by_profile/${profileId}/`,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get project details by ID
   * GET /api/projects/{id}/
   */
  getProjectById: async (id: string): Promise<ProjectDetail> => {
    const response = await apiClient.get<ProjectDetail>(`${PROJECT_ENDPOINT}/${id}/`);
    return response.data;
  },

  /**
   * Create new project with media
   * POST /api/projects/
   * Supports multipart/form-data for images and video
   */
  createProject: async (
    data: ProjectCreateRequest, 
    images?: File[], 
    video?: File
  ): Promise<ProjectDetail> => {
    const formData = new FormData();
    
    // Add project data (convert arrays to JSON strings)
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Add images
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    // Add video
    if (video) {
      formData.append('video', video);
    }
    
    const response = await apiClient.post<ProjectDetail>(
      `${PROJECT_ENDPOINT}/`,
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
   * Update project
   * PATCH /api/projects/{id}/
   */
  updateProject: async (
    id: string, 
    data: ProjectUpdateRequest,
    video?: File
  ): Promise<ProjectDetail> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    if (video) {
      formData.append('video', video);
    }
    
    const response = await apiClient.patch<ProjectDetail>(
      `${PROJECT_ENDPOINT}/${id}/`,
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
   * Delete project
   * DELETE /api/projects/{id}/
   */
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`${PROJECT_ENDPOINT}/${id}/`);
  },

  /**
   * Upload additional images to project
   * POST /api/projects/{id}/upload_images/
   */
  uploadProjectImages: async (
    id: string, 
    images: File[], 
    captions?: string[]
  ): Promise<ProjectImage[]> => {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      formData.append('images', image);
      if (captions && captions[index]) {
        formData.append(`caption_${index}`, captions[index]);
      }
    });
    
    const response = await apiClient.post<ProjectImage[]>(
      `${PROJECT_ENDPOINT}/${id}/upload_images/`,
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
   * Delete specific image from project
   * DELETE /api/projects/{id}/delete_image/{image_id}/
   */
  deleteProjectImage: async (projectId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`${PROJECT_ENDPOINT}/${projectId}/delete_image/${imageId}/`);
  },

  /**
   * Reorder project images
   * POST /api/projects/{id}/reorder_images/
   */
  reorderProjectImages: async (projectId: string, imageOrder: string[]): Promise<ProjectDetail> => {
    const response = await apiClient.post<ProjectDetail>(
      `${PROJECT_ENDPOINT}/${projectId}/reorder_images/`,
      { image_order: imageOrder }
    );
    return response.data;
  },
};
