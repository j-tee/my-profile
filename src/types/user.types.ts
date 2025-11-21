import type { UserRole, SocialLink } from './auth.types';

// User list item
export interface UserListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  created_at: string;
}

// User detail (now includes all portfolio fields)
export interface UserDetail {
  // Identity & Auth
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  mfa_enabled: boolean;
  
  // Portfolio/Profile Fields (integrated from Profile model)
  headline?: string;               // Professional headline
  summary?: string;                // Bio/About me
  city?: string;                   // Location
  state?: string;
  country?: string;
  profile_picture?: string | null; // Image paths
  profile_picture_url?: string | null;
  cover_image?: string | null;
  cover_image_url?: string | null;
  social_links?: SocialLink[];     // Social media links
  
  // Timestamps
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Update user request (admin)
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
  is_verified?: boolean;
  // Portfolio fields
  headline?: string;
  summary?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: string;
  cover_image?: string;
}

// Create user request (admin)
export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  is_active?: boolean;
  send_welcome_email?: boolean;
}

// User statistics
export interface UserStats {
  total_users: number;
  active_users: number;
  super_admins: number;
  editors: number;
  viewers: number;
  verified_users: number;
  mfa_enabled_users: number;
}

// Paginated user list
export interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserListItem[];
}
