import apiClient from './api';
import type {
  Skill,
  CreateSkillDTO,
  UpdateSkillDTO,
  PaginatedResponse,
  QueryParams,
  SkillCategory,
  ProficiencyLevel,
} from '../types';

const SKILL_BASE_PATH = '/skills';
const SKILL_LIST_URL = `${SKILL_BASE_PATH}/`;
const skillDetailUrl = (id: string) => `${SKILL_BASE_PATH}/${id}/`;
const SKILL_BY_CATEGORY_URL = `${SKILL_BASE_PATH}/by-category/`;
const SKILL_BATCH_URL = `${SKILL_BASE_PATH}/batch/`;
const skillEndorseUrl = (id: string) => `${SKILL_BASE_PATH}/${id}/endorse/`;

const CATEGORY_WHITELIST: SkillCategory[] = [
  'frontend',
  'backend',
  'database',
  'devops',
  'cloud',
  'mobile',
  'testing',
  'tools',
  'soft_skills',
  'other',
];

const PROFICIENCY_WHITELIST: ProficiencyLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

const normalizeCategory = (value?: string): SkillCategory => {
  if (!value) return 'other';
  const normalized = value.toLowerCase().replace(/\s+/g, '_') as SkillCategory;
  return CATEGORY_WHITELIST.includes(normalized) ? normalized : 'other';
};

const normalizeProficiency = (value?: string): ProficiencyLevel => {
  if (!value) return 'intermediate';
  const normalized = value.toLowerCase() as ProficiencyLevel;
  return PROFICIENCY_WHITELIST.includes(normalized) ? normalized : 'intermediate';
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const getFirstNumber = (payload: Record<string, unknown>, keys: string[], fallback = 0) => {
  for (const key of keys) {
    const value = payload[key];
    if (value !== undefined && value !== null && value !== '') {
      return toNumber(value, fallback);
    }
  }
  return fallback;
};

const mapSkillResponse = (payload: Record<string, unknown>): Skill => ({
  id: String(payload.id ?? ''),
  profileId: String(
    payload.profileId ?? payload.profile_id ?? payload.profile ?? payload.user ?? ''
  ),
  name: (payload.name as string) ?? '',
  category: normalizeCategory(payload.category as string),
  proficiencyLevel: normalizeProficiency(
    (payload.proficiencyLevel ?? payload.proficiency_level ?? payload.proficiency) as string
  ),
  yearsOfExperience: getFirstNumber(payload, [
    'yearsOfExperience',
    'years_of_experience',
    'yearsExperience',
    'experienceYears',
    'experience_years',
    'years',
    'experience',
  ]),
  endorsements: toNumber(payload.endorsements ?? payload.endorsements_count, 0),
  order: getFirstNumber(payload, ['order', 'display_order', 'priority'], 0),
  createdAt: (payload.createdAt as string) ?? (payload.created_at as string) ?? '',
  updatedAt: (payload.updatedAt as string) ?? (payload.updated_at as string) ?? '',
});

const serializeSkillPayload = (payload: CreateSkillDTO | UpdateSkillDTO) => {
  const body: Record<string, unknown> = {};

  if ('name' in payload && payload.name !== undefined) {
    body.name = payload.name;
  }

  if ('category' in payload && payload.category !== undefined) {
    body.category = payload.category;
  }

  if ('proficiencyLevel' in payload && payload.proficiencyLevel !== undefined) {
    body.proficiency_level = payload.proficiencyLevel;
  }

  if ('yearsOfExperience' in payload && payload.yearsOfExperience !== undefined) {
    body.years_of_experience = payload.yearsOfExperience;
  }

  return body;
};

const mapPaginatedSkillResponse = (
  payload: Record<string, unknown>
): PaginatedResponse<Skill> => {
  const results = Array.isArray(payload.results)
    ? payload.results.map(mapSkillResponse)
    : [];

  const pageSizeCandidate =
    (payload.pageSize as number) ?? (payload.page_size as number) ?? (results.length > 0 ? results.length : 1);

  const count = (payload.count as number) ?? results.length;

  return {
    results,
    count,
    next: (payload.next as string) ?? undefined,
    previous: (payload.previous as string) ?? undefined,
    page: (payload.page as number) ?? (payload.current as number) ?? 1,
    pageSize: pageSizeCandidate,
    totalPages:
      (payload.totalPages as number) ??
      (payload.total_pages as number) ??
      (count && pageSizeCandidate
        ? Math.max(1, Math.ceil(count / pageSizeCandidate))
        : 1),
  };
};

const serializeQueryParams = (params?: QueryParams) => {
  if (!params) return undefined;
  const { pageSize, ...rest } = params;
  if (pageSize === undefined) {
    return rest;
  }
  return { ...rest, page_size: pageSize };
};

export const skillService = {
  /**
   * Get all skills (no user filter)
   */
  getAllSkills: async (params?: QueryParams): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get(SKILL_LIST_URL, {
      params: serializeQueryParams(params),
    });
    return mapPaginatedSkillResponse(response.data);
  },

  /**
   * Get all skills for a user
   */
  getSkills: async (userId: string, params?: QueryParams): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get(SKILL_LIST_URL, {
      params: { ...serializeQueryParams(params), user: userId },
    });
    return mapPaginatedSkillResponse(response.data);
  },

  /**
   * Get skills by category
   */
  getSkillsByCategory: async (
    userId: string, 
    category: SkillCategory
  ): Promise<Skill[]> => {
    const response = await apiClient.get(SKILL_BY_CATEGORY_URL, {
      params: { user: userId, category },
    });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapSkillResponse);
  },

  /**
   * Get skill by ID
   */
  getSkillById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get(skillDetailUrl(id));
    return mapSkillResponse(response.data ?? {});
  },

  /**
   * Create new skill
   */
  createSkill: async (data: CreateSkillDTO): Promise<Skill> => {
    const response = await apiClient.post(SKILL_LIST_URL, serializeSkillPayload(data));
    return mapSkillResponse(response.data ?? {});
  },

  /**
   * Update skill
   */
  updateSkill: async (id: string, data: UpdateSkillDTO): Promise<Skill> => {
    const response = await apiClient.patch(
      skillDetailUrl(id),
      serializeSkillPayload(data)
    );
    return mapSkillResponse(response.data ?? {});
  },


  /**
   * Delete skill
   */
  deleteSkill: async (id: string): Promise<void> => {
    await apiClient.delete(skillDetailUrl(id));
  },

  /**
   * Batch create skills
   */
  batchCreateSkills: async (skills: CreateSkillDTO[]): Promise<Skill[]> => {
    const response = await apiClient.post(SKILL_BATCH_URL, { skills });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapSkillResponse);
  },

  /**
   * Endorse skill
   */
  endorseSkill: async (id: string): Promise<Skill> => {
    const response = await apiClient.post(skillEndorseUrl(id));
    return mapSkillResponse(response.data ?? {});
  },
};
