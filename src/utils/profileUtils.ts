import apiClient from '../services/api';

let cachedUserId: string | null = null;

/**
 * Get the portfolio owner's user ID dynamically from the backend
 * This fetches the first super_admin user from the database
 */
export const getPortfolioOwnerId = async (): Promise<string> => {
  if (cachedUserId) {
    return cachedUserId;
  }

  try {
    // Fetch the portfolio owner from a public endpoint
    // The backend should return the first super_admin user
    const response = await apiClient.get('/users/portfolio-owner/');
    cachedUserId = response.data.id;
    if (!cachedUserId) {
      throw new Error('No user ID in response');
    }
    return cachedUserId;
  } catch (error) {
    console.error('Failed to fetch portfolio owner ID:', error);
    // If the endpoint doesn't exist, fall back to fetching all users and finding super_admin
    try {
      const usersResponse = await apiClient.get('/auth/users/');
      const superAdmin = usersResponse.data.results?.find((u: any) => u.role === 'super_admin');
      if (superAdmin?.id) {
        cachedUserId = superAdmin.id;
        return superAdmin.id;
      }
    } catch (fallbackError) {
      console.error('Failed to fetch users:', fallbackError);
    }
    throw new Error('Unable to determine portfolio owner ID');
  }
};

/**
 * Clear the cached user ID (useful for testing or after changes)
 */
export const clearCachedUserId = (): void => {
  cachedUserId = null;
};
