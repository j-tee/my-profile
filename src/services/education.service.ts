import apiClient from './api';
import type {
  Education,
  CreateEducationDTO,
  UpdateEducationDTO,
  PaginatedResponse,
  QueryParams,
} from '../types';

const EDUCATION_BASE_PATH = '/education';
const EDUCATION_LIST_URL = `${EDUCATION_BASE_PATH}/`;
const educationDetailUrl = (id: string) => `${EDUCATION_BASE_PATH}/${id}/`;
const EDUCATION_REORDER_URL = `${EDUCATION_BASE_PATH}/reorder/`;

const serializeQueryParams = (
  params?: (QueryParams & Record<string, unknown>) | undefined
): Record<string, unknown> | undefined => {
  if (!params) {
    return undefined;
  }

  const { pageSize, ...rest } = params;
  if (pageSize === undefined) {
    return rest;
  }

  return { ...rest, page_size: pageSize };
};

const buildPortfolioFilters = (identity?: string): Record<string, string> => {
  if (!identity) {
    return {};
  }

  return {
    profile: identity,
    profile_id: identity,
  };
};

export const educationService = {
  /**
   * Get all education records (no user filter)
   */
  getAllEducation: async (params?: QueryParams): Promise<PaginatedResponse<Education>> => {
    const response = await apiClient.get<PaginatedResponse<Education>>(EDUCATION_LIST_URL, {
      params: serializeQueryParams(params),
    });
    return response.data;
  },

  /**
   * Get education records for a specific portfolio/user identity
   */
  getEducation: async (
    profileOrUserId: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<Education>> => {
    const serializedParams = serializeQueryParams(params) ?? {};
    const response = await apiClient.get<PaginatedResponse<Education>>(EDUCATION_LIST_URL, {
      params: {
        ...serializedParams,
        ...buildPortfolioFilters(profileOrUserId),
      },
    });
    return response.data;
  },

  /**
   * Get education by ID
   */
  getEducationById: async (id: string): Promise<Education> => {
    const response = await apiClient.get<Education>(educationDetailUrl(id));
    return response.data;
  },

  /**
   * Create new education record
   */
  createEducation: async (data: CreateEducationDTO): Promise<Education> => {
    const response = await apiClient.post<Education>(EDUCATION_LIST_URL, data);
    return response.data;
  },

  /**
   * Update education record
   */
  updateEducation: async (id: string, data: UpdateEducationDTO): Promise<Education> => {
    const response = await apiClient.patch<Education>(
      educationDetailUrl(id),
      data
    );
    return response.data;
  },

  /**
   * Delete education record
   */
  deleteEducation: async (id: string): Promise<void> => {
    await apiClient.delete(educationDetailUrl(id));
  },

  /**
   * Reorder education records
   */
  reorderEducation: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(EDUCATION_REORDER_URL, { orders });
  },
};
