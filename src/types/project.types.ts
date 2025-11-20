export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  role: string;
  teamSize?: number;
  startDate: string;
  endDate?: string;
  current: boolean;
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  images: ProjectImage[];
  highlights: string[];
  challenges?: string;
  outcomes?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface CreateProjectDTO {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  role: string;
  teamSize?: number;
  startDate: string;
  endDate?: string;
  current: boolean;
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
  challenges?: string;
  outcomes?: string;
  featured: boolean;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {}
