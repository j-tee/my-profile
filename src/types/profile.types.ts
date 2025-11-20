export interface Profile {
  id: string;
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
  profilePictureUrl?: string;
  coverImageUrl?: string;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
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

export interface UpdateProfileDTO extends Partial<CreateProfileDTO> {
  profilePictureUrl?: string;
  coverImageUrl?: string;
}
