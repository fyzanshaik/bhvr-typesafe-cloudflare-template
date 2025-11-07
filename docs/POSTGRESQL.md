# PostgreSQL Migration Guide

This guide will help you switch from Cloudflare D1 (SQLite) to PostgreSQL in ~30 minutes.

## Why PostgreSQL?

| Feature              | D1 (SQLite)                     | PostgreSQL                                         |
| -------------------- | ------------------------------- | -------------------------------------------------- |
| **Edge Performance** | Excellent (global CDN)          | Good (region-dependent)                            |
| **Feature Set**      | Basic SQLite                    | Full PostgreSQL (JSON, arrays, extensions)         |
| **Cost**             | Free: 5M reads, 100K writes/day | Provider-dependent (Neon/Supabase have free tiers) |
| **Query Complexity** | Limited                         | Advanced queries, full-text search, etc.           |
| **Scalability**      | Good for edge use cases         | Excellent for complex applications                 |

## Quick Start

### 1. Install PostgreSQL Driver (~1 min)

Choose based on your provider:

**Option A: Neon (Recommended for Cloudflare Workers)**

```bash
cd apps/backend
bun add @neondatabase/serverless
```

**Option B: Standard PostgreSQL**

```bash
cd apps/backend
bun add postgres
```

### 2. Update Database Schema (~5 mins)

**File: `packages/db/src/schema.ts`**

The code already has PostgreSQL examples commented out. Simply:

1. **Comment out** the D1/SQLite imports and table
2. **Uncomment** the PostgreSQL imports and table

```typescript
// Comment out SQLite version:
// import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
// export const users = sqliteTable('users', { ... });

// Uncomment PostgreSQL version:
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

**Key Differences:**

-  `integer` → `serial` (auto-increment)
-  `integer('created_at', { mode: 'timestamp' })` → `timestamp('created_at')`
-  `sql\`(unixepoch())\``→`defaultNow()`

### 3. Update Database Connection (~5 mins)

**File: `packages/db/src/index.ts`**

1. **Comment out** the D1 imports and function
2. **Uncomment** the PostgreSQL version (choose based on your provider)

**For Neon (Recommended):**

```typescript
// Comment out D1:
// import { drizzle } from 'drizzle-orm/d1';
// export function createDb(db: D1Database) { ... }

// Uncomment Neon:
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export function createDb(connectionString: string) {
	const sql = neon(connectionString);
	return drizzle(sql, { schema });
}
```

**For Standard PostgreSQL:**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDb(connectionString: string) {
	const client = postgres(connectionString);
	return drizzle(client, { schema });
}
```

### 4. Update Backend Types (~2 mins)

**File: `apps/backend/src/types.ts`**

```typescript
export interface Env {
	// Comment out D1:
	// DB: D1Database;

	// Uncomment PostgreSQL:
	DATABASE_URL: string;
	ENVIRONMENT?: string;
}
```

### 5. Update Backend Middleware (~2 mins)

**File: `apps/backend/src/index.ts`**

```typescript
// Comment out D1 version:
// app.use('*', async (c, next) => {
//   const db = createDb(c.env.DB);
//   c.set('db', db);
//   await next();
// });

// Uncomment PostgreSQL version:
app.use('*', async (c, next) => {
	const db = createDb(c.env.DATABASE_URL);
	c.set('db', db);
	await next();
});
```

### 6. Update Drizzle Config (~2 mins)

**File: `apps/backend/drizzle.config.ts`**

```typescript
// Comment out D1 config:
// export default defineConfig({
//   dialect: 'sqlite',
//   driver: 'd1-http',
//   ...
// });

// Uncomment PostgreSQL config:
export default defineConfig({
	schema: '../../packages/db/src/schema.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

### 7. Update Wrangler Config (~3 mins)

**File: `apps/backend/wrangler.toml`**

Remove D1 bindings:

```toml
name = "bhvr-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "development"

# Production config
[env.production]
name = "bhvr-backend-prod"

[env.production.vars]
ENVIRONMENT = "production"

# Remove all [[d1_databases]] sections
```

**Create `.dev.vars` for local development:**

```bash
cd apps/backend
cat > .dev.vars << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
EOF
```

### 8. Set Production Secret (~2 mins)

```bash
cd apps/backend
wrangler secret put DATABASE_URL --env production
# Paste your PostgreSQL connection string when prompted
```

### 9. Regenerate Migrations (~5 mins)

```bash
cd apps/backend

# Delete old SQLite migrations
rm -rf migrations

# Generate new PostgreSQL migrations
bun run db:generate

# Review the generated SQL
cat migrations/0000_*.sql

# Apply to your PostgreSQL database
bun run db:migrate
```

### 10. Update Package Scripts (Optional)

**File: `apps/backend/package.json`**

The scripts stay the same, but you can simplify:

```json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:push": "drizzle-kit push",
		"db:studio": "drizzle-kit studio"
	}
}
```

## PostgreSQL Provider Setup

### Option 1: Neon (Recommended)

Best for Cloudflare Workers - serverless, low-latency, generous free tier.

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set as secret: `wrangler secret put DATABASE_URL --env production`

**Connection String Format:**

```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Option 2: Supabase

Includes PostgreSQL + Auth + Storage.

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction mode)
5. Set as secret: `wrangler secret put DATABASE_URL --env production`

### Option 3: Railway

Simple PostgreSQL hosting.

1. Sign up at [railway.app](https://railway.app)
2. Create new project → PostgreSQL
3. Copy the connection string from "Connect"
4. Set as secret: `wrangler secret put DATABASE_URL --env production`

## Local Development

### Option 1: Use Cloud Database

Simplest - just use your cloud PostgreSQL database locally:

```bash
# .dev.vars
DATABASE_URL=<your-cloud-database-url>
```

### Option 2: Run PostgreSQL Locally

**Using Docker:**

```bash
docker run -d \
  --name bhvr-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bhvr \
  -p 5432:5432 \
  postgres:16

# .dev.vars
DATABASE_URL=postgresql://postgres:password@localhost:5432/bhvr
```

## Testing the Migration

```bash
# 1. Start development server
cd /path/to/project
bun dev

# 2. Test API endpoints
curl http://localhost:8787/api/hello
curl http://localhost:8787/api/users

# 3. Create a user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# 4. Verify in database
cd apps/backend
bunx drizzle-kit studio
# Opens database browser at http://localhost:4983
```

## What Stays the Same ✅

**No changes needed for:**

-  ✅ All API routes (`apps/backend/src/routes/api.ts`)
-  ✅ All Zod schemas (`packages/shared`)
-  ✅ All frontend code
-  ✅ Query syntax (Drizzle handles the translation)

**Example - This code works identically:**

```typescript
// Works with both D1 and PostgreSQL!
api.get('/users', async (c) => {
	const db = c.get('db');
	const allUsers = await db.select().from(users).all();
	return c.json({ success: true, data: allUsers });
});
```

## Deployment

### Backend Deployment

```bash
cd apps/backend
bun run deploy
```

Your Worker will now use PostgreSQL! 🎉

### Frontend Deployment

No changes needed - the frontend doesn't know or care about the database type.

## Troubleshooting

### "DATABASE_URL is not defined"

Make sure you've set the secret:

```bash
wrangler secret put DATABASE_URL --env production
```

For local dev, ensure `.dev.vars` exists:

```bash
cat apps/backend/.dev.vars
# Should show: DATABASE_URL=postgresql://...
```

### "Failed to connect to database"

**Check connection string format:**

-  Should start with `postgresql://` (not `postgres://`)
-  Include `?sslmode=require` for cloud databases
-  Verify user/password/host/port/database are correct

**Test connection:**

```bash
psql "postgresql://user:pass@host:5432/dbname"
```

### "Relation does not exist"

Migrations weren't applied. Run:

```bash
cd apps/backend
bun run db:migrate
```

### "Too many connections"

Use connection pooling with Neon:

```typescript
import { neon } from '@neondatabase/serverless';

export function createDb(connectionString: string) {
	const sql = neon(connectionString, {
		fullResults: true,
		fetchOptions: {
			cache: 'no-store',
		},
	});
	return drizzle(sql, { schema });
}
```

## Rolling Back

If you need to switch back to D1:

1. Uncomment D1 code sections
2. Comment out PostgreSQL sections
3. Restore `wrangler.toml` D1 bindings
4. Regenerate migrations for SQLite
5. Deploy

## Performance Considerations

### D1 vs PostgreSQL on Workers

**D1 Advantages:**

-  ✅ Native Cloudflare integration
-  ✅ Global edge distribution
-  ✅ Zero cold start penalty
-  ✅ Built-in replication

**PostgreSQL Advantages:**

-  ✅ More powerful queries
-  ✅ Better for complex joins
-  ✅ Full PostgreSQL ecosystem
-  ✅ Better for analytics

**Recommendation:**

-  Use **D1** for simple CRUD at global scale
-  Use **PostgreSQL** for complex queries or existing PostgreSQL workflows

## Need Help?

-  [Drizzle PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql)
-  [Neon Docs](https://neon.tech/docs/introduction)
-  [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
-  [GitHub Issues](https://github.com/your-repo/issues)

## Summary Checklist

-  [ ] Install PostgreSQL driver (`@neondatabase/serverless` or `postgres`)
-  [ ] Update `packages/db/src/schema.ts` (uncomment PostgreSQL version)
-  [ ] Update `packages/db/src/index.ts` (uncomment PostgreSQL version)
-  [ ] Update `apps/backend/src/types.ts` (uncomment `DATABASE_URL`)
-  [ ] Update `apps/backend/src/index.ts` (uncomment PostgreSQL middleware)
-  [ ] Update `apps/backend/drizzle.config.ts` (uncomment PostgreSQL config)
-  [ ] Update `apps/backend/wrangler.toml` (remove D1 bindings)
-  [ ] Create `.dev.vars` with `DATABASE_URL`
-  [ ] Set production secret: `wrangler secret put DATABASE_URL`
-  [ ] Delete old migrations: `rm -rf apps/backend/migrations`
-  [ ] Generate new migrations: `bun run db:generate`
-  [ ] Apply migrations: `bun run db:migrate`
-  [ ] Test locally: `bun dev`
-  [ ] Deploy: `bun run deploy`

**Estimated time: 30-60 minutes** ⏱️

That's it! Your app is now running on PostgreSQL. 🎉
