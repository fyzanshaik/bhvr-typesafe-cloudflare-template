/**
 * Shared types
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
