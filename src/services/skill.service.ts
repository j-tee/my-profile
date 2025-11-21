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
   * Get all skills (no user filter)
   */
  getAllSkills: async (params?: QueryParams): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<Skill>>(
      SKILL_ENDPOINT,
      { params }
    );
    return response.data;
  },

  /**
   * Get all skills for a user
   */
  getSkills: async (userId: string, params?: QueryParams): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<Skill>>(
      SKILL_ENDPOINT,
      { params: { ...params, user_id: userId } }
    );
    return response.data;
  },

  /**
   * Get skills by category
   */
  getSkillsByCategory: async (
    userId: string, 
    category: SkillCategory
  ): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>(
      `${SKILL_ENDPOINT}/by-category`,
      { params: { user_id: userId, category } }
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
