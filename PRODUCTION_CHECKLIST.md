# 🚀 Production Deployment Checklist

Quick reference for deploying to Cloudflare.

## ✅ Pre-Deployment Checklist

- [ ] Code is committed to git
- [ ] All tests pass locally (`bun dev` works)
- [ ] Environment variables documented
- [ ] Database schema is finalized

## 📋 Deployment Steps

### 1️⃣ Deploy Backend (Cloudflare Workers)

```bash
cd apps/backend

# Login (first time only)
bunx wrangler login

# Create production D1 database (first time only)
bunx wrangler d1 create cloudflare-d1-db
# ⚠️ Copy the database_id from output!

# Update wrangler.toml with real database_id
# Replace: database_id = "local-db"
# With:    database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Run migrations on production database
bun run db:migrate:prod

# Deploy backend
bun run deploy
```

**Save this URL:** `https://cloudflare-fullstack-backend.YOUR-SUBDOMAIN.workers.dev`

### 2️⃣ Deploy Frontend (Cloudflare Pages)

#### Option A: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Configure Pages**
   - Go to https://dash.cloudflare.com/
   - **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - Select repository
   - **Build settings:**
     - Build command: `cd apps/frontend && bun install && bun run build`
     - Build output: `apps/frontend/dist`
     - Root directory: `/`
   
3. **Set Environment Variable**
   - **Settings** → **Environment variables**
   - Add: `VITE_API_URL` = `https://your-worker-url.workers.dev`
   - **Production** tab
   - Click **Save**

4. **Trigger Deployment**
   - Go to **Deployments** → **Create deployment**
   - Or push to git (auto-deploys)

#### Option B: Direct Upload

```bash
cd apps/frontend

# Set environment variable
echo "VITE_API_URL=https://your-worker-url.workers.dev" > .env.production

# Build
bun run build

# Deploy
bunx wrangler pages deploy dist --project-name=cloudflare-fullstack-frontend
```

### 3️⃣ Verify Deployment

- [ ] Visit your Pages URL: `https://your-project.pages.dev`
- [ ] Click "Call API" buttons
- [ ] Check browser console for errors
- [ ] Test creating a user
- [ ] No TanStack Router badge visible

## 🐛 Common Issues & Fixes

### Issue: CORS Error

**Symptom:** API works in browser, but frontend gets CORS error

**Fix:** Already fixed! The backend now accepts:
- ✅ All `.pages.dev` domains
- ✅ All `localhost` ports (development)
- ✅ Custom domains (uncomment and add yours)

If you still see CORS errors:
1. Check browser console for the exact origin
2. Add it to `apps/backend/src/index.ts` in the CORS config

### Issue: TanStack Router Badge Shows

**Symptom:** Dev tools badge visible in production

**Fix:** Already fixed! Now only shows when `import.meta.env.DEV === true`

Rebuild and redeploy:
```bash
cd apps/frontend
bun run build
bunx wrangler pages deploy dist --project-name=cloudflare-fullstack-frontend
```

### Issue: API Returns 404

**Symptom:** All API calls return 404

**Possible causes:**
1. Wrong `VITE_API_URL` (check environment variable)
2. Backend not deployed
3. API route mismatch

**Fix:**
```bash
# Check backend is deployed
curl https://your-worker-url.workers.dev/

# Should return: {"message":"Cloudflare Fullstack API","status":"healthy",...}
```

### Issue: Database Empty in Production

**Symptom:** Users list is empty even after creating users

**Possible causes:**
1. Wrong database binding
2. Migrations not applied
3. Seed data not added

**Fix:**
```bash
cd apps/backend

# Check migrations applied
bunx wrangler d1 migrations list cloudflare-d1-db --remote

# Manually check database
bunx wrangler d1 execute cloudflare-d1-db --remote --command "SELECT * FROM users"

# Add seed data if needed
bunx wrangler d1 execute cloudflare-d1-db --remote --command "INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com')"
```

## 🔄 Updating After Changes

### Backend Changes (API, Database Schema)

```bash
cd apps/backend

# If database schema changed
bun run db:generate
bun run db:migrate:prod

# Deploy
bun run deploy
```

### Frontend Changes (UI, Components)

If using Git integration:
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Auto-deploys! ✨
```

If using direct upload:
```bash
cd apps/frontend
bun run build
bunx wrangler pages deploy dist --project-name=cloudflare-fullstack-frontend
```

## 📊 Monitoring

### View Logs

**Backend (Workers):**
```bash
cd apps/backend
bunx wrangler tail
```

**Frontend (Pages):**
- Dashboard → Pages → Your Project → Deployments → View logs

### Check Database

```bash
cd apps/backend

# List all data
bunx wrangler d1 execute cloudflare-d1-db --remote --command "SELECT * FROM users"

# Check table structure
bunx wrangler d1 execute cloudflare-d1-db --remote --command ".schema"
```

## 🎯 Quick Commands Reference

```bash
# Backend
cd apps/backend
bun run deploy              # Deploy backend
bun run db:migrate:prod     # Run migrations on production
bunx wrangler tail          # View logs

# Frontend
cd apps/frontend
bun run build               # Build for production
bunx wrangler pages deploy dist --project-name=NAME  # Deploy

# Database
cd apps/backend
bunx wrangler d1 execute cloudflare-d1-db --remote --command "SQL"
bunx wrangler d1 migrations list cloudflare-d1-db --remote
```

## 🔐 Security Checklist

- [ ] `database_id` in wrangler.toml is the production ID (not "local-db")
- [ ] Sensitive data not committed to git
- [ ] CORS only allows your domains (optional, currently allows all)
- [ ] Environment variables set in Pages dashboard
- [ ] API rate limiting configured (if needed)

## 💰 Cost Monitoring

Cloudflare Free Tier Limits:
- **Workers:** 100,000 requests/day
- **Pages:** Unlimited requests, 500 builds/month  
- **D1:** 5M reads/day, 100K writes/day

Check usage: https://dash.cloudflare.com/ → Account Home → See usage

## ✨ Success!

Your app is now live! 🎉

- **Frontend:** `https://your-project.pages.dev`
- **Backend:** `https://your-worker.workers.dev`

Share it with the world! 🌍

