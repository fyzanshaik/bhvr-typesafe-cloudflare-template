/**
 * Shared types for the application
 */

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * User with posts count (example of derived type)
 */
export interface UserWithStats {
  id: number;
  name: string;
  email: string;
  createdAt: Date | number;
  postsCount: number;
}

