# 🦫 bhvr - Cloudflare Fullstack Monorepo

A minimal, type-safe fullstack monorepo template for Cloudflare. Built with **Bun + Hono + Vite + React**.

## ✨ Features

-  ⚡ **End-to-end type safety** - Frontend to backend to database
-  🚀 **Edge-first** - Deploy on Cloudflare Workers & Pages
-  📦 **Turborepo** - Optimized monorepo builds
-  🗄️ **D1 Database** - SQLite at the edge with Drizzle ORM
-  🎨 **Modern UI** - React + Vite + Tailwind CSS + Shadcn UI
-  🔄 **Hono RPC** - Type-safe API calls with autocomplete
-  📱 **TanStack Stack** - Router + Query for seamless data flow

## 🏗️ Structure

```
├── apps/
│   ├── backend/          # Hono API (Cloudflare Workers)
│   └── frontend/         # React + Vite (Cloudflare Pages)
├── packages/
│   ├── db/              # Drizzle schema & types
│   └── shared/          # Zod schemas & shared types
└── package.json         # Turborepo workspace
```

## 🚀 Quick Start

### Prerequisites

-  [Bun](https://bun.sh) >= 1.0

### Local Development

```bash
# Install dependencies
bun install

# Setup database
cd apps/backend
bun run db:generate
bun run db:migrate

# Seed demo data
bunx wrangler d1 execute cloudflare-d1-db --local --command "INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com')"
bunx wrangler d1 execute cloudflare-d1-db --local --command "INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com')"

# Start dev servers (from root)
cd ../..
bun dev
```

Visit:

-  Frontend: http://localhost:5173
-  Backend: http://localhost:8787

## 📚 API Routes

-  `GET /` - Health check
-  `GET /api/hello` - Hello world
-  `GET /api/users` - Get all users
-  `POST /api/users` - Create a new user

### Example: Create User

```bash
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## 🗄️ Database

### Schema

**Users Table:**

-  `id` - Integer (Primary Key)
-  `name` - Text
-  `email` - Text (Unique)
-  `createdAt` - Timestamp
-  `updatedAt` - Timestamp

### Migrations

**⚠️ IMPORTANT: Never delete migrations that have been applied to production!**

```bash
# 1. Make changes to packages/db/src/schema.ts

# 2. Generate a NEW migration (don't delete old ones!)
cd apps/backend
bun run db:generate

# 3. Apply locally
bun run db:migrate

# 4. Test thoroughly

# 5. Apply to production
bun run db:migrate:prod
```

#### Fresh Start (Development Only)

If you need to start over with a clean database (⚠️ deletes all data):

```bash
# Local
cd apps/backend
rm -rf .wrangler/state/v3/d1  # Delete local DB
bun run db:migrate             # Reapply all migrations

# Production (only if safe to delete data)
# Create new D1 database and update wrangler.toml
bunx wrangler d1 create cloudflare-d1-db-new
# Then update database_id in wrangler.toml
```

## 🚢 Deployment

### Backend (Cloudflare Workers)

```bash
cd apps/backend

# Login (first time)
bunx wrangler login

# Create production D1 database (first time)
bunx wrangler d1 create cloudflare-d1-db
# Copy the database_id to wrangler.toml [env.production.d1_databases]

# Deploy
bun run deploy
```

### Frontend (Cloudflare Pages)

#### Option 1: Git Integration (Recommended)

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build settings:
   -  **Command:** `cd apps/frontend && bun install && bun run build`
   -  **Output:** `apps/frontend/dist`
4. Set environment variable:
   -  `VITE_API_URL` = `https://your-worker.workers.dev`

#### Option 2: Direct Upload

```bash
cd apps/frontend
bun run build
bunx wrangler pages deploy dist --project-name=your-project-name
```

## 🛠️ Development

### Commands

```bash
# Root
bun dev                   # Start all apps
bun build                 # Build all apps
bun run type-check        # Type check all packages

# Backend
cd apps/backend
bun dev                   # Start backend only
bun run deploy            # Deploy to production

# Frontend
cd apps/frontend
bun dev                   # Start frontend only
bun run build             # Build for production
```

### Adding Shadcn Components

```bash
cd apps/frontend
bunx --bun shadcn@latest add [component-name]
```

## 🔑 Environment Variables

### Local Development

No environment files needed! Wrangler handles D1 automatically.

### Production

**Backend:** Configure in `wrangler.toml`

```toml
[[env.production.d1_databases]]
database_id = "your-production-db-id"
```

**Frontend:** Set in Cloudflare Pages dashboard

```
VITE_API_URL=https://your-worker.workers.dev
```

## 🎯 How It Works

### Type-Safe API Calls

```typescript
// Frontend automatically knows backend types!
const response = await apiClient.api.users.$get();
const data = await response.json();
// data is fully typed ✨
```

### Database Queries

```typescript
// Backend has full type safety with Drizzle
const users = await db.select().from(users).all();
// users is User[] ✨
```

### Validation

```typescript
// Shared Zod schemas work on both frontend and backend
const userData = createUserSchema.parse(input);
// Validated at runtime ✨
```

## 📦 Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React 18, Vite, TanStack Router/Query |
| Backend    | Hono, Cloudflare Workers              |
| Database   | Cloudflare D1, Drizzle ORM            |
| Styling    | Tailwind CSS v4, Shadcn UI            |
| State      | Zustand                               |
| Validation | Zod                                   |
| Monorepo   | Turborepo, Bun                        |

## 🐛 Troubleshooting

### CORS Errors

Backend CORS is configured to accept:

-  All `localhost` ports (development)
-  All `.pages.dev` domains (Cloudflare Pages)

If you still get CORS errors, update `apps/backend/src/index.ts`:

```typescript
cors({
	origin: (origin) => {
		if (origin.includes('localhost')) return origin;
		if (origin.endsWith('.pages.dev')) return origin;
		if (origin === 'https://yourdomain.com') return origin; // Add custom domain
		return origin;
	},
	credentials: true,
});
```

### Migration Error: "table already exists"

**Cause:** You regenerated migrations (changed migration filenames) after already applying them to production.

**Local Fix:**
```bash
cd apps/backend
rm -rf .wrangler/state/v3/d1  # Delete local database
bun run db:migrate             # Apply fresh migration
```

**Production Fix (if you already have data):**

⚠️ **Don't regenerate migrations in production!** Instead:

1. Check what tables exist in production vs. your new schema
2. Manually align the migration tracking table
3. Create new migrations for any differences going forward

**Better Approach:** Don't delete old migrations! Create new ones to make changes:

```bash
# ✅ CORRECT: Create new migration to drop a table
cd apps/backend
# Edit schema.ts to remove the table
bun run db:generate  # Creates 0001_*.sql
bun run db:migrate   # Local
bun run db:migrate:prod  # Production - works smoothly!

# ❌ WRONG: Delete migrations folder and regenerate
rm -rf migrations  # Don't do this if already in production!
```

### Database Empty After Migration

Check migrations were applied:

```bash
cd apps/backend
bunx wrangler d1 migrations list cloudflare-d1-db --local
```

### Type Errors

Rebuild workspace:

```bash
bun install
bun run type-check
```

## 💰 Cloudflare Free Tier

-  Workers: 100,000 requests/day
-  Pages: Unlimited requests
-  D1: 5M reads/day, 100K writes/day

Perfect for side projects and MVPs!

## 📖 Migration Best Practices

### Golden Rules

1. **Never delete applied migrations** - Migrations are append-only
2. **Test locally first** - Always apply to local DB before production
3. **One-way street** - Migrations should only move forward
4. **Add rollback scripts** - For complex changes, have a backup plan

### Example Workflow

```bash
# ✅ Correct: Adding a new column
# 1. Edit schema
echo "age: integer('age')" >> packages/db/src/schema.ts

# 2. Generate NEW migration (0001_*.sql)
cd apps/backend && bun run db:generate

# 3. Review the generated SQL
cat migrations/0001_*.sql

# 4. Test locally
bun run db:migrate

# 5. Deploy to production
bun run db:migrate:prod
```

### Migration Files Are Sacred

- ✅ Keep all migration files in version control
- ✅ Migrations should be sequential (0000, 0001, 0002...)
- ❌ Never modify an applied migration
- ❌ Never delete migration files in production
- ❌ Never regenerate all migrations

## 📝 License

MIT

## 🤝 Contributing

Feel free to fork and customize for your needs!

---

Built with ❤️ using Cloudflare's edge platform
