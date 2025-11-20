export interface Skill {
  id: string;
  profileId: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
  endorsements?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'mobile' | 'testing' | 'tools' | 'soft_skills' | 'other';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CreateSkillDTO {
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
}

export type UpdateSkillDTO = Partial<CreateSkillDTO>;
