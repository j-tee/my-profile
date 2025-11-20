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

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum LocationType {
  ON_SITE = 'on_site',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

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
