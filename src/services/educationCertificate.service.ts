import apiClient from './api';
import type {
  EducationCertificate,
  CreateEducationCertificateDTO,
  UpdateEducationCertificateDTO,
  PaginatedResponse,
  QueryParams,
} from '../types';

const CERTIFICATE_BASE_PATH = '/education/certificates';
const CERTIFICATE_LIST_URL = `${CERTIFICATE_BASE_PATH}/`;
const certificateDetailUrl = (id: string) => `${CERTIFICATE_BASE_PATH}/${id}/`;

interface CertificateQueryParams extends QueryParams {
  education?: string;
  education__user?: string;
  search?: string;
  ordering?: string;
}

const serializeQueryParams = (params?: CertificateQueryParams) => {
  if (!params) {
    return undefined;
  }

  const { pageSize, ...rest } = params;
  if (pageSize === undefined) {
    return rest;
  }

  return { ...rest, page_size: pageSize };
};

export const educationCertificateService = {
  getCertificates: async (params?: CertificateQueryParams): Promise<PaginatedResponse<EducationCertificate>> => {
    const response = await apiClient.get<PaginatedResponse<EducationCertificate>>(CERTIFICATE_LIST_URL, {
      params: serializeQueryParams(params),
    });
    return response.data;
  },

  getCertificatesForEducation: async (
    educationId: string,
    params?: CertificateQueryParams
  ): Promise<PaginatedResponse<EducationCertificate>> => {
    const response = await apiClient.get<PaginatedResponse<EducationCertificate>>(CERTIFICATE_LIST_URL, {
      params: serializeQueryParams({ ...params, education: educationId }),
    });
    return response.data;
  },

  getCertificateById: async (id: string): Promise<EducationCertificate> => {
    const response = await apiClient.get<EducationCertificate>(certificateDetailUrl(id));
    return response.data;
  },

  createCertificate: async (data: CreateEducationCertificateDTO): Promise<EducationCertificate> => {
    const response = await apiClient.post<EducationCertificate>(CERTIFICATE_LIST_URL, data);
    return response.data;
  },

  updateCertificate: async (
    id: string,
    data: UpdateEducationCertificateDTO
  ): Promise<EducationCertificate> => {
    const response = await apiClient.patch<EducationCertificate>(certificateDetailUrl(id), data);
    return response.data;
  },

  deleteCertificate: async (id: string): Promise<void> => {
    await apiClient.delete(certificateDetailUrl(id));
  },
};
