// Portfolio Owner Identity
export const PORTFOLIO_OWNER_PROFILE_ID = 'bcd91fdc-d398-42f5-87b3-f7699fd50eae';
export const PORTFOLIO_OWNER_EMAIL = 'juliustetteh@gmail.com';

export const API_ENDPOINTS = {
  PROFILES: '/profiles',
  EXPERIENCES: '/experiences',
  EDUCATION: '/education',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  CERTIFICATIONS: '/certifications',
} as const;

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  EXPERIENCE: '/experience',
  EDUCATION: '/education',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  CERTIFICATIONS: '/certifications',
  PROJECT_DETAIL: '/projects/:id',
  NOT_FOUND: '/404',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
