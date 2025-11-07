import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export * from './schema';
export { schema };

/**
 * Creates a Drizzle ORM instance for D1 database
 * @param db - D1Database instance from Cloudflare Workers
 */
export function createDb(db: D1Database) {
  return drizzle(db, { schema });
}

export type DbInstance = ReturnType<typeof createDb>;

