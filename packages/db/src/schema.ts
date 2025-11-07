// ==========================================
// DATABASE SCHEMA - Cloudflare D1 (SQLite)
// ==========================================
// To use PostgreSQL instead, see: docs/POSTGRESQL.md
// Uncomment PostgreSQL imports and table definition below

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// PostgreSQL imports (uncomment to use PostgreSQL):
// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Users table - D1/SQLite version (current)
 */
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

/**
 * Users table - PostgreSQL version (commented out)
 * Uncomment this and comment out the SQLite version above to use PostgreSQL
 */
// export const users = pgTable('users', {
// 	id: serial('id').primaryKey(),
// 	name: text('name').notNull(),
// 	email: text('email').notNull().unique(),
// 	createdAt: timestamp('created_at').notNull().defaultNow(),
// 	updatedAt: timestamp('updated_at').notNull().defaultNow(),
// });

// Type exports (work with both D1 and PostgreSQL)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
