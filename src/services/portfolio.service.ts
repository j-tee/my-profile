import apiClient from './api';
import type {
  Project,
  Experience,
  Education,
  Skill,
  Certification,
  CreateProjectRequest,
  CreateExperienceRequest,
  CreateEducationRequest,
  CreateSkillRequest,
  CreateCertificationRequest,
  PaginatedResponse,
} from '../types/portfolio.types';

// Projects Service
export const projectsService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects/', { params });
    return response.data;
  },

  get: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}/`);
    return response.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProjectRequest>): Promise<Project> => {
    const response = await apiClient.patch<Project>(`/projects/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}/`);
  },
};

// Experiences Service
export const experiencesService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get<PaginatedResponse<Experience>>('/experiences/', { params });
    return response.data;
  },

  get: async (id: string): Promise<Experience> => {
    const response = await apiClient.get<Experience>(`/experiences/${id}/`);
    return response.data;
  },

  create: async (data: CreateExperienceRequest): Promise<Experience> => {
    const response = await apiClient.post<Experience>('/experiences/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateExperienceRequest>): Promise<Experience> => {
    const response = await apiClient.patch<Experience>(`/experiences/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/experiences/${id}/`);
  },
};

// Education Service
export const educationService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Education>> => {
    const response = await apiClient.get<PaginatedResponse<Education>>('/education/', { params });
    return response.data;
  },

  get: async (id: string): Promise<Education> => {
    const response = await apiClient.get<Education>(`/education/${id}/`);
    return response.data;
  },

  create: async (data: CreateEducationRequest): Promise<Education> => {
    const response = await apiClient.post<Education>('/education/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEducationRequest>): Promise<Education> => {
    const response = await apiClient.patch<Education>(`/education/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/education/${id}/`);
  },
};

// Skills Service
export const skillsService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<Skill>>('/skills/', { params });
    return response.data;
  },

  get: async (id: string): Promise<Skill> => {
    const response = await apiClient.get<Skill>(`/skills/${id}/`);
    return response.data;
  },

  create: async (data: CreateSkillRequest): Promise<Skill> => {
    const response = await apiClient.post<Skill>('/skills/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSkillRequest>): Promise<Skill> => {
    const response = await apiClient.patch<Skill>(`/skills/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/skills/${id}/`);
  },
};

// Certifications Service
export const certificationsService = {
  list: async (params?: Record<string, string>): Promise<PaginatedResponse<Certification>> => {
    const response = await apiClient.get<PaginatedResponse<Certification>>('/certifications/', { params });
    return response.data;
  },

  get: async (id: string): Promise<Certification> => {
    const response = await apiClient.get<Certification>(`/certifications/${id}/`);
    return response.data;
  },

  create: async (data: CreateCertificationRequest): Promise<Certification> => {
    const response = await apiClient.post<Certification>('/certifications/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCertificationRequest>): Promise<Certification> => {
    const response = await apiClient.patch<Certification>(`/certifications/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/certifications/${id}/`);
  },
};
