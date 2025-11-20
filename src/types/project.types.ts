// Backend response interfaces (matching Django serializers)
export interface ProjectImage {
  id: string;
  image: string;              // File path
  image_url: string;          // Full URL (read-only)
  caption: string | null;
  order: number;
  uploaded_at: string;        // ISO 8601 datetime
}

export interface ProjectListItem {
  id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  technologies_count: number;
  start_date: string;         // YYYY-MM-DD
  end_date: string | null;
  current: boolean;
  featured: boolean;
  thumbnail: string | null;   // First image URL
  project_url: string | null;
  github_url: string | null;
  duration: string;           // e.g. "5 months"
  created_at: string;         // ISO 8601 datetime
}

export interface ProjectDetail {
  id: string;
  profile: string;            // Profile UUID
  profile_name: string;       // Read-only
  title: string;
  description: string;        // Short description
  long_description: string | null;
  technologies: string[];
  technologies_count: number; // Read-only
  role: string;
  team_size: number | null;
  start_date: string;         // YYYY-MM-DD
  end_date: string | null;
  current: boolean;
  project_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  video: string | null;       // File path
  video_url: string | null;   // Full URL (read-only)
  highlights: string[];
  challenges: string | null;
  outcomes: string | null;
  featured: boolean;
  order: number;
  images: ProjectImage[];     // Related images
  duration: string;           // Read-only, e.g. "5 months"
  created_at: string;
  updated_at: string;
}

// For list view (use ProjectListItem)
export type Project = ProjectListItem;

// Request interfaces for creating/updating projects
export interface ProjectCreateRequest {
  profile: string;            // Profile UUID (required)
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];     // JSON array
  role: string;
  team_size?: number;
  start_date: string;         // YYYY-MM-DD
  end_date?: string;          // null if current=true
  current: boolean;
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  highlights?: string[];      // JSON array
  challenges?: string;
  outcomes?: string;
  featured?: boolean;
  order?: number;
}

export interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {}

// Media upload interfaces (for frontend form)
export interface ProjectMedia {
  id: string;
  type: 'image' | 'video';
  file?: File;
  url: string;
  preview?: string;
  caption: string;
  order?: number;
  thumbnail?: string;         // For video preview
}

// Pagination response from backend
export interface PaginatedProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectListItem[];
}

// Query parameters for filtering
export interface ProjectFilters {
  page?: number;
  page_size?: number;
  profile?: string;           // Filter by profile UUID
  featured_only?: boolean;
  current_only?: boolean;
  search?: string;
  ordering?: 'start_date' | '-start_date' | 'created_at' | '-created_at' | 'order' | 'title';
}

// Legacy interfaces (keep for backward compatibility)
export interface ProjectRequest {
  title: string;
  description: string;
  technologies: string[];
  status: 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_featured: boolean;
}

export interface ProjectRequestWithMedia extends ProjectRequest {
  media: ProjectMedia[];
  video_url?: string;
}

export interface CreateProjectDTO extends ProjectCreateRequest {}
export type UpdateProjectDTO = ProjectUpdateRequest;
