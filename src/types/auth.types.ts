// User role types
export type UserRole = 'super_admin' | 'editor' | 'viewer';

// Social Link
export interface SocialLink {
  id: string;
  user?: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'portfolio' | 'other';
  url: string;
  display_name?: string;
  order?: number;
}

// User interface (now includes portfolio fields)
export interface User {
  // Identity & Auth
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  mfa_enabled: boolean;
  
  // Portfolio Fields (integrated from Profile model)
  headline?: string;
  summary?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: string | null;
  profile_picture_url?: string | null;
  cover_image?: string | null;
  cover_image_url?: string | null;
  social_links?: SocialLink[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Auth tokens
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
  mfa_token?: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Auth response - NO profile field (visitors don't get portfolio profiles)
export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// MFA response
export interface MFARequiredResponse {
  mfa_required: boolean;
  message: string;
}

// Change password request
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

// Update profile request (now includes portfolio fields)
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  headline?: string;
  summary?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: string;
  cover_image?: string;
}

// MFA Setup response
export interface MFASetupResponse {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  message: string;
}

// MFA Verify request
export interface MFAVerifyRequest {
  token: string;
}

// MFA Disable request
export interface MFADisableRequest {
  password: string;
}

// Email Verification
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// Password Reset
export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// API Error (use the one from api.types.ts instead)
// export interface ApiError {
//   detail?: string;
//   [key: string]: string[] | string | undefined;
// }
