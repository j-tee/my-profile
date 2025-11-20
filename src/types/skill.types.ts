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

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  CLOUD = 'cloud',
  MOBILE = 'mobile',
  TESTING = 'testing',
  TOOLS = 'tools',
  SOFT_SKILLS = 'soft_skills',
  OTHER = 'other',
}

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface CreateSkillDTO {
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
}

export interface UpdateSkillDTO extends Partial<CreateSkillDTO> {}
