import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}
