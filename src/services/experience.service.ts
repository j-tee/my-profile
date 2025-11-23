import apiClient from './api';
import type {
  Experience,
  CreateExperienceDTO,
  UpdateExperienceDTO,
  PaginatedResponse,
  QueryParams,
  EmploymentType,
  LocationType,
} from '../types';

const EXPERIENCE_BASE_PATH = '/experiences';
const EXPERIENCE_LIST_URL = `${EXPERIENCE_BASE_PATH}/`;
const experienceDetailUrl = (id: string) => `${EXPERIENCE_BASE_PATH}/${id}/`;
const EXPERIENCE_REORDER_URL = `${EXPERIENCE_BASE_PATH}/reorder/`;

const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'part_time', 'contract', 'freelance', 'internship'];
const LOCATION_TYPES: LocationType[] = ['on_site', 'remote', 'hybrid'];

const normalizeEmploymentType = (value?: string): EmploymentType | undefined => {
  if (!value) return undefined;
  const normalized = value.toLowerCase() as EmploymentType;
  return EMPLOYMENT_TYPES.includes(normalized) ? normalized : undefined;
};

const normalizeLocationType = (value?: string): LocationType | undefined => {
  if (!value) return undefined;
  const normalized = value.toLowerCase() as LocationType;
  return LOCATION_TYPES.includes(normalized) ? normalized : undefined;
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value as string[];
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return [value];
  }
  return [];
};

const toBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    return ['true', '1', 'yes'].includes(value.toLowerCase());
  }
  return false;
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const mapExperienceResponse = (payload: Record<string, unknown>): Experience => {
  const employmentType = normalizeEmploymentType(payload.employment_type ?? payload.employmentType);
  const locationType = normalizeLocationType(payload.location_type ?? payload.locationType);
  const startDate = (payload.start_date ?? payload.startDate ?? '') as string;
  const endDate = (payload.end_date ?? payload.endDate ?? null) as string | null;

  return {
    id: String(payload.id ?? ''),
    profile: (payload.profile as string) ?? undefined,
    profileId: (payload.profile_id as string) ?? payload.profile ?? payload.user ?? undefined,
    title: payload.title ?? payload.position ?? undefined,
    position: payload.position ?? payload.title ?? '',
    company: payload.company ?? '',
    employment_type: employmentType,
    employmentType,
    location: payload.location ?? '',
    location_type: locationType,
    locationType,
    start_date: startDate,
    startDate,
    end_date: endDate,
    endDate: endDate ?? undefined,
    current: toBoolean(payload.current ?? payload.is_current),
    description: payload.description ?? '',
    key_responsibilities: toArray(payload.key_responsibilities ?? payload.responsibilities),
    responsibilities: toArray(payload.responsibilities ?? payload.key_responsibilities),
    achievements: toArray(payload.achievements),
    technologies: toArray(payload.technologies),
    order: toNumber(payload.order ?? payload.display_order, 0),
    created_at: payload.created_at ?? payload.createdAt ?? undefined,
    createdAt: payload.created_at ?? payload.createdAt ?? undefined,
    updated_at: payload.updated_at ?? payload.updatedAt ?? undefined,
    updatedAt: payload.updated_at ?? payload.updatedAt ?? undefined,
  };
};

const mapPaginatedExperiences = (payload: Record<string, unknown>): PaginatedResponse<Experience> => {
  const results = Array.isArray(payload.results)
    ? payload.results.map(mapExperienceResponse)
    : [];

  const pageSizeCandidate =
    payload.pageSize ?? payload.page_size ?? (results.length > 0 ? results.length : 1);

  return {
    results,
    count: payload.count ?? results.length,
    next: payload.next ?? undefined,
    previous: payload.previous ?? undefined,
    page: payload.page ?? payload.current ?? 1,
    pageSize: pageSizeCandidate,
    totalPages:
      payload.totalPages ??
      payload.total_pages ??
      (payload.count && pageSizeCandidate
        ? Math.max(1, Math.ceil(payload.count / pageSizeCandidate))
        : 1),
  };
};

const serializeQueryParams = (params?: QueryParams & Record<string, unknown>) => {
  if (!params) return undefined;
  const { pageSize, ...rest } = params;
  if (pageSize === undefined) return rest;
  return { ...rest, page_size: pageSize };
};

const serializeExperiencePayload = (payload: CreateExperienceDTO | UpdateExperienceDTO) => {
  const body: Record<string, unknown> = {};

  if ('title' in payload && payload.title !== undefined) {
    body.title = payload.title;
  }

  if ('position' in payload && payload.position !== undefined) {
    body.position = payload.position;
  }

  if ('company' in payload && payload.company !== undefined) {
    body.company = payload.company;
  }

  if ('employmentType' in payload && payload.employmentType !== undefined) {
    body.employment_type = payload.employmentType;
  } else if ('employment_type' in payload && payload.employment_type !== undefined) {
    body.employment_type = payload.employment_type;
  }

  if ('location' in payload && payload.location !== undefined) {
    body.location = payload.location;
  }

  if ('locationType' in payload && payload.locationType !== undefined) {
    body.location_type = payload.locationType;
  } else if ('location_type' in payload && payload.location_type !== undefined) {
    body.location_type = payload.location_type;
  }

  if ('start_date' in payload && payload.start_date !== undefined) {
    body.start_date = payload.start_date;
  } else if ('startDate' in payload && payload.startDate !== undefined) {
    body.start_date = payload.startDate;
  }

  if ('end_date' in payload && payload.end_date !== undefined) {
    body.end_date = payload.end_date;
  } else if ('endDate' in payload && payload.endDate !== undefined) {
    body.end_date = payload.endDate;
  }

  if ('current' in payload && payload.current !== undefined) {
    body.current = payload.current;
  }

  if ('description' in payload && payload.description !== undefined) {
    body.description = payload.description;
  }

  if ('key_responsibilities' in payload && payload.key_responsibilities !== undefined) {
    body.key_responsibilities = payload.key_responsibilities;
  } else if ('responsibilities' in payload && payload.responsibilities !== undefined) {
    body.key_responsibilities = payload.responsibilities;
  }

  if ('achievements' in payload && payload.achievements !== undefined) {
    body.achievements = payload.achievements;
  }

  if ('technologies' in payload && payload.technologies !== undefined) {
    body.technologies = payload.technologies;
  }

  if ('order' in payload && payload.order !== undefined) {
    body.order = payload.order;
  }

  return body;
};

export const experienceService = {
  /**
   * Get all experiences (no user filter)
   */
  getAllExperiences: async (params?: QueryParams): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get(EXPERIENCE_LIST_URL, {
      params: serializeQueryParams(params),
    });
    return mapPaginatedExperiences(response.data ?? {});
  },

  /**
   * Get all experiences for a portfolio/profile (public)
   */
  getExperiences: async (
    profileId: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get(EXPERIENCE_LIST_URL, {
      params: serializeQueryParams({ ...params, profile: profileId }),
    });
    return mapPaginatedExperiences(response.data ?? {});
  },

  /**
   * Get experience by ID
   */
  getExperienceById: async (id: string): Promise<Experience> => {
    const response = await apiClient.get(experienceDetailUrl(id));
    return mapExperienceResponse(response.data ?? {});
  },

  /**
   * Create new experience
   */
  createExperience: async (data: CreateExperienceDTO): Promise<Experience> => {
    const response = await apiClient.post(EXPERIENCE_LIST_URL, serializeExperiencePayload(data));
    return mapExperienceResponse(response.data ?? {});
  },

  /**
   * Update experience
   */
  updateExperience: async (id: string, data: UpdateExperienceDTO): Promise<Experience> => {
    const response = await apiClient.patch(
      experienceDetailUrl(id),
      serializeExperiencePayload(data)
    );
    return mapExperienceResponse(response.data ?? {});
  },

  /**
   * Delete experience
   */
  deleteExperience: async (id: string): Promise<void> => {
    await apiClient.delete(experienceDetailUrl(id));
  },

  /**
   * Reorder experiences
   */
  reorderExperiences: async (orders: { id: string; order: number }[]): Promise<void> => {
    await apiClient.post(EXPERIENCE_REORDER_URL, { orders });
  },
};
