export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  activities?: string[];
  achievements?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationDTO {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  activities?: string[];
  achievements?: string[];
}

export type UpdateEducationDTO = Partial<CreateEducationDTO>;
