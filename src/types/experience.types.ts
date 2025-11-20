export interface Experience {
  id: string;
  profile?: string;
  profileId?: string;
  title?: string;
  position?: string;
  company: string;
  employmentType?: EmploymentType;
  employment_type?: EmploymentType;
  location?: string;
  locationType?: LocationType;
  location_type?: LocationType;
  start_date: string;
  startDate?: string;
  end_date?: string | null;
  endDate?: string;
  current: boolean;
  description?: string;
  key_responsibilities?: string[];
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  order?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';

export type LocationType = 'on_site' | 'remote' | 'hybrid';

export interface CreateExperienceDTO {
  title?: string;
  position?: string;
  company: string;
  employmentType?: EmploymentType;
  employment_type?: EmploymentType;
  location?: string;
  locationType?: LocationType;
  location_type?: LocationType;
  start_date: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  current: boolean;
  description?: string;
  key_responsibilities?: string[];
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
}

export type UpdateExperienceDTO = Partial<CreateExperienceDTO>;
