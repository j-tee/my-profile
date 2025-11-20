export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  search?: string;
  ordering?: string;
}

export interface QueryParams extends PaginationParams, FilterParams {}
