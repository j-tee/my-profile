import apiClient from './api';
import type {
  Certification,
  CreateCertificationDTO,
  UpdateCertificationDTO,
  PaginatedResponse,
  QueryParams,
} from '../types';

const CERTIFICATION_BASE_PATH = '/certifications';
const CERTIFICATION_LIST_URL = `${CERTIFICATION_BASE_PATH}/`;
const certificationDetailUrl = (id: string) => `${CERTIFICATION_BASE_PATH}/${id}/`;
const CERTIFICATION_REORDER_URL = `${CERTIFICATION_BASE_PATH}/reorder/`;
const certificationVerifyUrl = (id: string) => `${CERTIFICATION_BASE_PATH}/${id}/verify/`;

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

const toSkillsArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
};

const mapCertificationResponse = (payload: Record<string, unknown>): Certification => {
  const issueDate = (payload.issue_date as string) ?? (payload.issueDate as string) ?? '';
  const expirationDate =
    (payload.expiration_date as string | null) ?? (payload.expirationDate as string | null) ?? null;
  const credentialId = (payload.credential_id as string) ?? (payload.credentialId as string) ?? undefined;
  const credentialUrl = (payload.credential_url as string) ?? (payload.credentialUrl as string) ?? undefined;
  const isActive = (payload.is_active as boolean) ?? (payload.isActive as boolean) ?? undefined;

  return {
    id: String(payload.id ?? ''),
    education: (payload.education as string) ?? (payload.education_id as string) ?? undefined,
    education_display: (payload.education_display as string) ?? (payload.educationDisplay as string) ?? undefined,
    educationDisplay: (payload.education_display as string) ?? (payload.educationDisplay as string) ?? undefined,
    name: (payload.name as string) ?? (payload.title as string) ?? '',
    issuer: (payload.issuer as string) ?? '',
    issuer_display: (payload.issuer_display as string) ?? (payload.issuerDisplay as string) ?? undefined,
    issuerDisplay: (payload.issuer_display as string) ?? (payload.issuerDisplay as string) ?? undefined,
    issue_date: issueDate,
    issueDate,
    expiration_date: expirationDate,
    expirationDate,
    credential_id: credentialId,
    credentialId,
    credential_url: credentialUrl,
    credentialUrl,
    description: (payload.description as string) ?? undefined,
    skills: toSkillsArray(payload.skills),
    order: typeof payload.order === 'number' ? payload.order : undefined,
    is_active: isActive,
    isActive,
    created_at: (payload.created_at as string) ?? (payload.createdAt as string) ?? undefined,
    createdAt: (payload.created_at as string) ?? (payload.createdAt as string) ?? undefined,
    updated_at: (payload.updated_at as string) ?? (payload.updatedAt as string) ?? undefined,
    updatedAt: (payload.updated_at as string) ?? (payload.updatedAt as string) ?? undefined,
  };
};

const mapPaginatedCertifications = (
  payload: Record<string, unknown>
): PaginatedResponse<Certification> => {
  const results = Array.isArray(payload.results)
    ? payload.results.map(mapCertificationResponse)
    : [];

  const inferredPageSize =
    (payload.pageSize as number) ?? (payload.page_size as number) ?? (results.length > 0 ? results.length : 1);

  const count = (payload.count as number) ?? results.length;

  return {
    results,
    count,
    next: (payload.next as string) ?? undefined,
    previous: (payload.previous as string) ?? undefined,
    page: (payload.page as number) ?? (payload.current as number) ?? 1,
    pageSize: inferredPageSize,
    totalPages:
      (payload.totalPages as number) ??
      (payload.total_pages as number) ??
      (count && inferredPageSize
        ? Math.max(1, Math.ceil(count / inferredPageSize))
        : 1),
  };
};

const serializeCertificationPayload = (
  payload: CreateCertificationDTO | UpdateCertificationDTO
): Record<string, unknown> => {
  const body: Record<string, unknown> = {};

  if ('education' in payload && payload.education !== undefined) {
    body.education = payload.education;
  }

  if ('name' in payload && payload.name !== undefined) {
    body.name = payload.name;
  }

  if ('issuer' in payload && payload.issuer !== undefined) {
    body.issuer = payload.issuer;
  }

  if ('issueDate' in payload && payload.issueDate !== undefined) {
    body.issue_date = payload.issueDate;
  } else if ('issue_date' in payload && payload.issue_date !== undefined) {
    body.issue_date = payload.issue_date;
  }

  if ('expirationDate' in payload && payload.expirationDate !== undefined) {
    body.expiration_date = payload.expirationDate ?? null;
  } else if ('expiration_date' in payload && payload.expiration_date !== undefined) {
    body.expiration_date = payload.expiration_date ?? null;
  }

  if ('credentialId' in payload && payload.credentialId !== undefined) {
    body.credential_id = payload.credentialId;
  } else if ('credential_id' in payload && payload.credential_id !== undefined) {
    body.credential_id = payload.credential_id;
  }

  if ('credentialUrl' in payload && payload.credentialUrl !== undefined) {
    body.credential_url = payload.credentialUrl;
  } else if ('credential_url' in payload && payload.credential_url !== undefined) {
    body.credential_url = payload.credential_url;
  }

  if ('description' in payload && payload.description !== undefined) {
    body.description = payload.description;
  }

  if ('skills' in payload && payload.skills !== undefined) {
    body.skills = Array.isArray(payload.skills)
      ? payload.skills.filter((skill): skill is string => typeof skill === 'string')
      : [];
  }

  if ('order' in payload && payload.order !== undefined) {
    body.order = payload.order;
  }

  if ('isActive' in payload && payload.isActive !== undefined) {
    body.is_active = payload.isActive;
  } else if ('is_active' in payload && payload.is_active !== undefined) {
    body.is_active = payload.is_active;
  }

  return body;
};

const fetchCertifications = async (
  params?: QueryParams & Record<string, unknown>
): Promise<PaginatedResponse<Certification>> => {
  const response = await apiClient.get(CERTIFICATION_LIST_URL, {
    params: serializeQueryParams(params),
  });
  return mapPaginatedCertifications(response.data ?? {});
};

export const certificationService = {
  /**
   * Public listing with optional filters
   */
  getAllCertifications: fetchCertifications,

  /**
   * Flexible listing helper (supports education/profile filters)
   */
  getCertifications: fetchCertifications,

  /**
   * Retrieve certifications tied to a specific portfolio profile
   */
  getCertificationsForProfile: async (
    profileId: string,
    params?: QueryParams & Record<string, unknown>
  ): Promise<PaginatedResponse<Certification>> => {
    return fetchCertifications({ ...params, ...buildPortfolioFilters(profileId) });
  },

  /**
   * Retrieve single certification
   */
  getCertificationById: async (id: string): Promise<Certification> => {
    const response = await apiClient.get(certificationDetailUrl(id));
    return mapCertificationResponse(response.data ?? {});
  },

  /**
   * Create certification
   */
  createCertification: async (data: CreateCertificationDTO): Promise<Certification> => {
    const response = await apiClient.post(
      CERTIFICATION_LIST_URL,
      serializeCertificationPayload(data)
    );
    return mapCertificationResponse(response.data ?? {});
  },

  /**
   * Update certification
   */
  updateCertification: async (
    id: string,
    data: UpdateCertificationDTO
  ): Promise<Certification> => {
    const response = await apiClient.patch(
      certificationDetailUrl(id),
      serializeCertificationPayload(data)
    );
    return mapCertificationResponse(response.data ?? {});
  },

  /**
   * Delete certification
   */
  deleteCertification: async (id: string): Promise<void> => {
    await apiClient.delete(certificationDetailUrl(id));
  },

  /**
   * Verify credential validity
   */
  verifyCertification: async (id: string, credentialId: string): Promise<boolean> => {
    const response = await apiClient.post<{ valid: boolean }>(certificationVerifyUrl(id), {
      credential_id: credentialId,
    });
    return Boolean(response.data?.valid);
  },

  /**
   * Reorder certifications
   */
  reorderCertifications: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(CERTIFICATION_REORDER_URL, { orders });
  },
};
