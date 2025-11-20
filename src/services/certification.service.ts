import { apiClient } from './apiClient';
import type { 
  Certification, 
  CreateCertificationDTO, 
  UpdateCertificationDTO, 
  ApiResponse,
  PaginatedResponse,
  QueryParams 
} from '../types';

const CERTIFICATION_ENDPOINT = '/certifications';

export const certificationService = {
  /**
   * Get all certifications for a profile
   */
  getCertifications: async (
    profileId: string, 
    params?: QueryParams
  ): Promise<PaginatedResponse<Certification>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Certification>>>(
      CERTIFICATION_ENDPOINT,
      { params: { ...params, profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get active certifications (not expired)
   */
  getActiveCertifications: async (profileId: string): Promise<Certification[]> => {
    const response = await apiClient.get<ApiResponse<Certification[]>>(
      `${CERTIFICATION_ENDPOINT}/active`,
      { params: { profile_id: profileId } }
    );
    return response.data.data;
  },

  /**
   * Get certification by ID
   */
  getCertificationById: async (id: string): Promise<Certification> => {
    const response = await apiClient.get<ApiResponse<Certification>>(
      `${CERTIFICATION_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  /**
   * Create new certification
   */
  createCertification: async (data: CreateCertificationDTO): Promise<Certification> => {
    const response = await apiClient.post<ApiResponse<Certification>>(
      CERTIFICATION_ENDPOINT,
      data
    );
    return response.data.data;
  },

  /**
   * Update certification
   */
  updateCertification: async (
    id: string,
    data: UpdateCertificationDTO
  ): Promise<Certification> => {
    const response = await apiClient.patch<ApiResponse<Certification>>(
      `${CERTIFICATION_ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete certification
   */
  deleteCertification: async (id: string): Promise<void> => {
    await apiClient.delete(`${CERTIFICATION_ENDPOINT}/${id}`);
  },

  /**
   * Verify certification
   */
  verifyCertification: async (id: string, credentialId: string): Promise<boolean> => {
    const response = await apiClient.post<ApiResponse<{ valid: boolean }>>(
      `${CERTIFICATION_ENDPOINT}/${id}/verify`,
      { credential_id: credentialId }
    );
    return response.data.data.valid;
  },

  /**
   * Reorder certifications
   */
  reorderCertifications: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(`${CERTIFICATION_ENDPOINT}/reorder`, { orders });
  },
};
