import { hc } from 'hono/client';
import type { AppType } from '../../../backend/src/index';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Type-safe Hono RPC client
 * Provides full end-to-end type safety between frontend and backend
 */
export const apiClient = hc<AppType>(API_URL);

