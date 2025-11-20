export interface Experience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';

export type LocationType = 'on_site' | 'remote' | 'hybrid';

export interface CreateExperienceDTO {
  title: string;
  company: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface UpdateExperienceDTO extends Partial<CreateExperienceDTO> {}
