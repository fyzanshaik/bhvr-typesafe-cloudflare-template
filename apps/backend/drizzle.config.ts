import { defineConfig } from 'drizzle-kit';

// D1 Configuration (current)
export default defineConfig({
	schema: '../../packages/db/src/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	driver: 'd1-http',
});

// PostgreSQL Configuration (uncomment when using PostgreSQL)
// export default defineConfig({
// 	schema: '../../packages/db/src/schema.ts',
// 	out: './migrations',
// 	dialect: 'postgresql',
// 	dbCredentials: {
// 		url: process.env.DATABASE_URL!,
// 	},
// });
