/**
 * Cloudflare Workers environment bindings
 */
export interface Env {
	DB: D1Database;
	ENVIRONMENT?: string;
}

/**
 * Context variables for Hono app
 */
export interface HonoVariables {
	db: ReturnType<typeof import('@repo/db')['createDb']>;
}
