import type { SocialLink } from './auth.types';

export interface Profile {
  // Identity & Basic Information
  id: string;
  first_name: string;              // Backend primary field
  last_name: string;               // Backend primary field
  firstName?: string;              // Frontend alias
  lastName?: string;               // Frontend alias
  full_name?: string;              // Backend computed property
  email: string;

  // Professional Information (REQUIRED for completion)
  headline: string;                // Max 255 chars, required for completion
  summary: string;                 // Min 50 chars required for completion

  // Contact Information
  phone?: string | null;           // Optional, max 20 chars

  // Location Information (REQUIRED for completion)
  city: string;                    // Required for completion, default ''
  state: string;                   // Required for completion, default ''
  country: string;                 // Required for completion, default ''
  location?: {                     // Frontend convenience wrapper
    city: string;
    state: string;
    country: string;
  };

  // Images
  profile_picture?: string | null; // Backend field - upload path
  cover_image?: string | null;     // Backend field - upload path
  profilePictureUrl?: string;      // Frontend computed URL
  coverImageUrl?: string;          // Frontend computed URL
  profile_picture_url?: string | null;  // Backend URL field
  cover_image_url?: string | null;      // Backend URL field

  // Social Links (separate model, included in response)
  social_links?: SocialLink[];     // Backend relationship
  socialLinks?: SocialLink[];      // Frontend alias

  // Timestamps
  created_at?: string;             // Backend field
  updated_at?: string;             // Backend field
  createdAt?: string;              // Frontend alias
  updatedAt?: string;              // Frontend alias
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
