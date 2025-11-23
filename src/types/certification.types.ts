export interface Certification {
  id: string;
  education?: string;
  education_display?: string;
  educationDisplay?: string;
  name: string;
  issuer: string;
  issuer_display?: string;
  issuerDisplay?: string;
  issue_date?: string;
  issueDate: string;
  expiration_date?: string | null;
  expirationDate?: string | null;
  credential_id?: string | null;
  credentialId?: string | null;
  credential_url?: string | null;
  credentialUrl?: string | null;
  description?: string;
  skills?: string[];
  order?: number;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface CreateCertificationDTO {
  education: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string;
  skills?: string[];
  order?: number;
  isActive?: boolean;
}

export type UpdateCertificationDTO = Partial<CreateCertificationDTO>;
