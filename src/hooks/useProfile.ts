import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import type { Profile, UpdateProfileDTO } from '../types/profile.types';
import type { PortfolioProfileSummary } from '../types/auth.types';

interface UseProfileReturn {
  profile: Profile | null;
  profileSummary: PortfolioProfileSummary | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  isProfileComplete: () => boolean;
  getProfileCompleteness: () => {
    hasBasicInfo: boolean;
    hasHeadline: boolean;
    hasSummary: boolean;
    hasLocation: boolean;
    hasPhoto: boolean;
    hasContact: boolean;
    completeness: number;
    total: number;
    percentage: number;
    isComplete: boolean;
  };
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileSummary, setProfileSummary] = useState<PortfolioProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch full portfolio profile from API
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from API
      const data = await authService.getMyPortfolioProfile();
      setProfile(data);
      localStorage.setItem('full_profile', JSON.stringify(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<Profile> => {
    if (!profile) {
      throw new Error('No profile loaded');
    }

    try {
      setError(null);
      
      // Convert null to undefined for nullable fields
      const cleanedUpdates: UpdateProfileDTO = {
        ...updates,
        phone: updates.phone === null ? undefined : updates.phone,
        profile_picture: updates.profile_picture === null ? undefined : updates.profile_picture,
        cover_image: updates.cover_image === null ? undefined : updates.cover_image,
      };
      
      // Update via the profile service
      const updatedProfile = await profileService.updateProfile(profile.id, cleanedUpdates);
      
      setProfile(updatedProfile);
      localStorage.setItem('full_profile', JSON.stringify(updatedProfile));
      
      // Update summary if location changed
      if (updates.city || updates.state || updates.country) {
        const hasLocation = !!(updatedProfile.city && updatedProfile.state && updatedProfile.country);
        if (profileSummary) {
          const updatedSummary = {
            ...profileSummary,
            is_complete: hasLocation,
          };
          setProfileSummary(updatedSummary);
          localStorage.setItem('portfolio_profile', JSON.stringify(updatedSummary));
        }
      }
      
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    }
  }, [profile, profileSummary]);

  // Check if profile has minimum required information
  const isProfileComplete = useCallback((): boolean => {
    if (!profile) return false;
    return !!(profile.city && profile.state && profile.country);
  }, [profile]);

  // Get detailed profile completeness status
  const getProfileCompleteness = useCallback(() => {
    const checks = {
      hasBasicInfo: !!(profile?.first_name && profile?.last_name),
      hasHeadline: !!(profile?.headline && profile.headline !== `${profile.full_name}'s Portfolio`),
      hasSummary: !!(profile?.summary && !profile.summary.startsWith('Welcome to')),
      hasLocation: !!(profile?.city && profile?.state && profile?.country),
      hasPhoto: !!(profile?.profile_picture || profile?.profile_picture_url),
      hasContact: !!(profile?.phone || profile?.email),
    };

    const completeness = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const percentage = (completeness / total) * 100;

    return {
      ...checks,
      completeness,
      total,
      percentage,
      isComplete: checks.hasLocation, // Minimum requirement
    };
  }, [profile]);

  // Load profile on mount
  useEffect(() => {
    // Try to load from localStorage first
    const storedSummary = localStorage.getItem('portfolio_profile');
    if (storedSummary) {
      try {
        setProfileSummary(JSON.parse(storedSummary));
      } catch (e) {
        console.error('Failed to parse stored profile summary:', e);
      }
    }

    const storedProfile = localStorage.getItem('full_profile');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    } else {
      // Fetch from API if not in storage
      fetchProfile();
    }
  }, [fetchProfile]);

  return {
    profile,
    profileSummary,
    loading,
    error,
    fetchProfile,
    updateProfile,
    isProfileComplete,
    getProfileCompleteness,
  };
};
