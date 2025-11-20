// Message type for contact/proposal system
export type MessageType = 'general' | 'proposal' | 'job' | 'collaboration' | 'feedback' | 'other';
export type MessageStatus = 'new' | 'read' | 'in_progress' | 'responded' | 'archived';

// Contact Message Interface
export interface ContactMessage {
  id: string;
  sender: unknown;
  sender_name: string;
  message_type: MessageType;
  subject: string;
  message: string;
  project_budget: string | null;
  project_timeline: string | null;
  attachments: string[];
  status: MessageStatus;
  priority: boolean;
  admin_notes: string | null;
  responded_by: unknown | null;
  replied_by_name: string | null;
  responded_at: string | null;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

// Portfolio Entity Interfaces
export interface Profile {
  id: string;
  user: string;
  bio: string;
  title: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profile_image: string | null;
  resume: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  profile: string;
  company: string;
  position: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  technologies: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile: string;
  institution: string;
  degree: string;
  field_of_study: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  grade: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  profile: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  profile: string;
  title: string;
  description: string;
  detailed_description: string;
  technologies: string[];
  project_url: string;
  github_url: string;
  demo_url: string;
  image: string | null;
  start_date: string;
  end_date: string | null;
  is_featured: boolean;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  profile: string;
  name: string;
  issuing_organization: string;
  credential_id: string;
  credential_url: string;
  issue_date: string;
  expiry_date: string | null;
  does_not_expire: boolean;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// Request types for creating/updating
export interface CreateProjectRequest {
  title: string;
  description: string;
  detailed_description?: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  image?: File | null;
  start_date: string;
  end_date?: string | null;
  is_featured?: boolean;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
}

export interface CreateExperienceRequest {
  company: string;
  position: string;
  location: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  technologies: string[];
}

export interface CreateEducationRequest {
  institution: string;
  degree: string;
  field_of_study: string;
  location: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  grade?: string;
}

export interface CreateSkillRequest {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
}

export interface CreateCertificationRequest {
  name: string;
  issuing_organization: string;
  credential_id?: string;
  credential_url?: string;
  issue_date: string;
  expiry_date?: string | null;
  does_not_expire: boolean;
  description?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
