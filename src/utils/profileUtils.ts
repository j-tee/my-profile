import { PORTFOLIO_OWNER_USER_ID } from '../constants';

let cachedUserId: string | null = null;

/**
 * Get the portfolio owner's user ID
 * For personal portfolio sites, this is a constant
 */
export const getPortfolioOwnerId = async (): Promise<string> => {
  if (cachedUserId) {
    return cachedUserId;
  }

  // For personal portfolio sites, we use a constant user ID
  // No need to fetch from API since there's only one portfolio owner
  cachedUserId = PORTFOLIO_OWNER_USER_ID;
  return PORTFOLIO_OWNER_USER_ID;
};

/**
 * Clear the cached user ID (useful for testing or after changes)
 */
export const clearCachedUserId = (): void => {
  cachedUserId = null;
};
