import apiClient from './api';
import type { 
  Certification, 
  CreateCertificationDTO, 
  UpdateCertificationDTO, 
  PaginatedResponse,
  QueryParams 
} from '../types';

const CERTIFICATION_ENDPOINT = '/certifications';

export const certificationService = {
  /**
   * Get all certifications (no user filter)
   */
  getAllCertifications: async (params?: QueryParams): Promise<PaginatedResponse<Certification>> => {
    const response = await apiClient.get<PaginatedResponse<Certification>>(
      CERTIFICATION_ENDPOINT,
      { params }
    );
    return response.data;
  },

  /**
   * Get all certifications for a user
   */
  getCertifications: async (
    userId: string, 
    params?: QueryParams
  ): Promise<PaginatedResponse<Certification>> => {
    const response = await apiClient.get<PaginatedResponse<Certification>>(
      CERTIFICATION_ENDPOINT,
      { params: { ...params, user_id: userId } }
    );
    return response.data;
  },

  /**
   * Get active certifications (not expired)
   */
  getActiveCertifications: async (userId: string): Promise<Certification[]> => {
    const response = await apiClient.get<Certification[]>(
      `${CERTIFICATION_ENDPOINT}/active`,
      { params: { user_id: userId } }
    );
    return response.data;
  },

  /**
   * Get certification by ID
   */
  getCertificationById: async (id: string): Promise<Certification> => {
    const response = await apiClient.get<Certification>(
      `${CERTIFICATION_ENDPOINT}/${id}`
    );
    return response.data;
  },

  /**
   * Create new certification
   */
  createCertification: async (data: CreateCertificationDTO): Promise<Certification> => {
    const response = await apiClient.post<Certification>(
      CERTIFICATION_ENDPOINT,
      data
    );
    return response.data;
  },

  /**
   * Update certification
   */
  updateCertification: async (
    id: string,
    data: UpdateCertificationDTO
  ): Promise<Certification> => {
    const response = await apiClient.patch<Certification>(
      `${CERTIFICATION_ENDPOINT}/${id}`,
      data
    );
    return response.data;
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
    const response = await apiClient.post<{ valid: boolean }>(
      `${CERTIFICATION_ENDPOINT}/${id}/verify`,
      { credential_id: credentialId }
    );
    return response.data.valid;
  },

  /**
   * Reorder certifications
   */
  reorderCertifications: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(`${CERTIFICATION_ENDPOINT}/reorder`, { orders });
  },
};
