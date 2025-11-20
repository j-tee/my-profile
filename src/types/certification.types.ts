export interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationDTO {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
}

export type UpdateCertificationDTO = Partial<CreateCertificationDTO>;
