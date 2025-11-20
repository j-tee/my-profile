import apiClient from './api';
import type {
  Skill,
  CreateSkillDTO,
  UpdateSkillDTO,
  PaginatedResponse,
  QueryParams,
  SkillCategory,
} from '../types';

const SKILL_ENDPOINT = '/skills';

export const skillService = {
  /**
   * Get all skills for a profile
   */
  getSkills: async (profileId: string, params?: QueryParams): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<Skill>>(
      SKILL_ENDPOINT,
      { params: { ...params, profile_id: profileId } }
    );
    return response.data;
  },

  /**
   * Get skills by category
   */
  getSkillsByCategory: async (
    profileId: string, 
    category: SkillCategory
  ): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>(
      `${SKILL_ENDPOINT}/by-category`,
      { params: { profile_id: profileId, category } }
    );
    return response.data;
  },

  /**
   * Get skill by ID
   */
  getSkillById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get<Skill>(`${SKILL_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new skill
   */
  createSkill: async (data: CreateSkillDTO): Promise<Skill> => {
    const response = await apiClient.post<Skill>(SKILL_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update skill
   */
  updateSkill: async (id: string, data: UpdateSkillDTO): Promise<Skill> => {
    const response = await apiClient.patch<Skill>(
      `${SKILL_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete skill
   */
  deleteSkill: async (id: string): Promise<void> => {
    await apiClient.delete(`${SKILL_ENDPOINT}/${id}`);
  },

  /**
   * Batch create skills
   */
  batchCreateSkills: async (skills: CreateSkillDTO[]): Promise<Skill[]> => {
    const response = await apiClient.post<Skill[]>(
      `${SKILL_ENDPOINT}/batch`,
      { skills }
    );
    return response.data;
  },

  /**
   * Endorse skill
   */
  endorseSkill: async (id: string): Promise<Skill> => {
    const response = await apiClient.post<Skill>(
      `${SKILL_ENDPOINT}/${id}/endorse`
    );
    return response.data;
  },
};
