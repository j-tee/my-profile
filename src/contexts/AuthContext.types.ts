import type { User, LoginRequest, RegisterRequest, PortfolioProfileSummary } from '../types/auth.types';
import type { Profile } from '../types/profile.types';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  profileSummary: PortfolioProfileSummary | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  updateProfile: (profile: Profile) => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isProfileComplete: boolean;
}
