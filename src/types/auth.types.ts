// User role types
export type UserRole = 'super_admin' | 'editor' | 'viewer';

// User interface
export interface User {
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

// Auth response
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

// Update profile request
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
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

// API Error (use the one from api.types.ts instead)
// export interface ApiError {
//   detail?: string;
//   [key: string]: string[] | string | undefined;
// }
