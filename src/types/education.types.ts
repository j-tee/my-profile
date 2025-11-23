export interface Education {
  id: string;
  import type { Certification } from './certification.types';
  profile?: string;
  profileId?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  fieldOfStudy?: string;
  location?: string;
  description?: string;
  start_date: string;
  startDate?: string;
  end_date?: string | null;
  endDate?: string;
  current: boolean;
  gpa?: string;
  grade?: string;
  activities?: string[];
  achievements?: string[];
  relevant_courses?: string[];
  order?: number;
  certificate_count?: number;
  certificates?: EducationCertificate[];
  created_at?: string;
    certificate_count?: number;
    certifications?: Certification[];
  updatedAt?: string;
}

export interface CreateEducationDTO {
  institution: string;
  degree: string;
  field_of_study: string;
  fieldOfStudy?: string;
  start_date: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  current: boolean;
  location?: string;
  gpa?: string;
  grade?: string;
  description?: string;
  activities?: string[];
  achievements?: string[];
  relevant_courses?: string[];
  order?: number;
}

export type UpdateEducationDTO = Partial<CreateEducationDTO>;

export type EducationWithCertifications = Education & { certifications?: Certification[] };
