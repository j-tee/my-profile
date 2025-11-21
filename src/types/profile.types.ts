export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name: string;  // Backend compatibility
  last_name: string;   // Backend compatibility
  full_name?: string;  // Backend computed field
  headline: string;
  summary: string;
  bio?: string;        // Backend field
  email: string;
  phone?: string | null;
  city: string;
  state: string;
  country: string;
  location?: {         // Frontend convenience
    city: string;
    state: string;
    country: string;
  };
  profile_picture?: string | null;
  profilePictureUrl?: string;
  profile_picture_url?: string | null;  // Backend compatibility
  cover_image?: string | null;
  coverImageUrl?: string;
  cover_image_url?: string | null;      // Backend compatibility
  github_url?: string;           // Backend social links
  linkedin_url?: string;         // Backend social links
  twitter_url?: string;          // Backend social links
  website_url?: string;          // Backend social links
  socialLinks?: SocialLink[];
  social_links?: SocialLink[];   // Backend compatibility
  created_at?: string;           // Backend field
  updated_at?: string;           // Backend field
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'portfolio' | 'other';
  url: string;
  displayName?: string;
}

export interface CreateProfileDTO {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  email: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePictureUrl?: string;
  coverImageUrl?: string;
  profile_picture?: string;
  cover_image?: string;
}
