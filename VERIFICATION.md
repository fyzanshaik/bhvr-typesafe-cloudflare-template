# ✅ Setup Verification Checklist

Use this checklist to verify your setup is complete and working correctly.

## 📋 Pre-flight Checks

### 1. Dependencies Installed

```bash
# From root directory
bun install
```

**Expected**: ✅ All packages installed without errors

### 2. TypeScript Compilation

```bash
# From root
bun run type-check
```

**Expected**: ✅ No TypeScript errors

### 3. Database Setup

```bash
cd apps/backend
bunx wrangler d1 list
```

**Expected**: ✅ `cloudflare-d1-db` appears in list (or shows empty for local)

### 4. Migrations Generated

```bash
ls apps/backend/migrations/
```

**Expected**: ✅ At least one `.sql` file exists

## 🚀 Runtime Checks

### 1. Backend Server Starts

```bash
cd apps/backend
bun dev
```

**Expected**:
- ✅ Server starts on port 8787
- ✅ No error messages
- ✅ Message shows "Ready on http://127.0.0.1:8787"

**Test**: Visit http://localhost:8787
```json
{
  "message": "Cloudflare Fullstack API",
  "status": "healthy",
  "timestamp": "..."
}
```

### 2. Frontend Server Starts

```bash
cd apps/frontend
bun dev
```

**Expected**:
- ✅ Server starts on port 5173
- ✅ No error messages
- ✅ Vite banner shows

**Test**: Visit http://localhost:5173
- ✅ Home page loads
- ✅ No console errors
- ✅ Navigation works

### 3. API Connection Test

**On Home Page** (http://localhost:5173):

**Expected**:
- ✅ "API Connection Test" card shows
- ✅ Green checkmark appears
- ✅ Message: "Backend connection successful!"
- ✅ JSON response shows greeting

### 4. Database Connection Test

**On Users Page** (http://localhost:5173/users):

**Expected**:
- ✅ Page loads without errors
- ✅ "Add New User" form is visible
- ✅ "Users List" shows (may be empty initially)

**Create a User**:
1. Fill in name: "Test User"
2. Fill in email: "test@example.com"
3. Click "Create User"

**Expected**:
- ✅ Success message appears
- ✅ User appears in table
- ✅ User has ID, name, and email

## 🔧 Detailed Component Checks

### Backend API Endpoints

```bash
# Health check
curl http://localhost:8787/

# Hello endpoint
curl http://localhost:8787/api/hello

# Get users
curl http://localhost:8787/api/users

# Create user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","email":"api@test.com"}'
```

**Expected**: ✅ All endpoints return JSON responses without errors

### Frontend Routes

Visit each route manually:
- http://localhost:5173/ ✅
- http://localhost:5173/users ✅

**Expected**: ✅ All routes load without errors

### Type Safety Check

In `apps/frontend/src/lib/api.ts`, add this temporarily:

```typescript
// Should show TypeScript error
const test = apiClient.nonexistent.$get(); // ❌ Error expected!
```

**Expected**: ✅ TypeScript shows error for non-existent endpoint

## 🎨 UI Component Checks

### Shadcn Components Loaded

Check browser DevTools console for:
- ❌ No "module not found" errors
- ✅ Tailwind classes applied correctly
- ✅ Theme variables working

### Navigation

Click through:
1. "Home" link ✅
2. "Users" link ✅
3. "View Demo Users" button ✅

**Expected**: ✅ Navigation works smoothly, no page reloads

## 🗄️ Database Checks

### Query Database Directly

```bash
cd apps/backend
bunx wrangler d1 execute cloudflare-d1-db --local --command "SELECT * FROM users"
```

**Expected**: ✅ Returns user data (or empty if no users created)

### Verify Schema

```bash
bunx wrangler d1 execute cloudflare-d1-db --local --command ".schema"
```

**Expected**: ✅ Shows `users` and `posts` tables

## 🔍 Developer Tools Checks

### Browser Console

Open DevTools (F12) and check Console tab:
- ✅ No red errors
- ℹ️ Some info logs are OK
- ⚠️ Warnings are acceptable

### Network Tab

1. Go to http://localhost:5173/users
2. Open Network tab
3. Look for API requests

**Expected**:
- ✅ Request to `/api/users` succeeds
- ✅ Status code: 200
- ✅ Response contains JSON array

## 📦 Build Checks

### Backend Build

```bash
cd apps/backend
bun run build
```

**Expected**: ✅ No build errors

### Frontend Build

```bash
cd apps/frontend
bun run build
```

**Expected**:
- ✅ No build errors
- ✅ `dist/` directory created
- ✅ Contains `index.html`, `assets/` folder

### Preview Production Build

```bash
cd apps/frontend
bun run preview
```

**Expected**: ✅ App works same as dev mode

## 🎯 Feature Tests

### Complete User Flow

1. ✅ Open http://localhost:5173
2. ✅ See welcome message
3. ✅ Click "View Demo Users"
4. ✅ Add user via form
5. ✅ See user in table
6. ✅ Refresh page
7. ✅ User still appears

### Type Safety Flow

1. ✅ Open `apps/backend/src/routes/api.ts`
2. ✅ Change response type
3. ✅ Save file
4. ✅ Check frontend for TypeScript errors
5. ✅ Revert change

## 🚨 Common Issues

### Port Already in Use

**Symptom**: `EADDRINUSE: address already in use`

**Fix**:
```bash
# Kill process on port 8787
lsof -ti:8787 | xargs kill -9

# Or change port in wrangler.toml
```

### Module Not Found

**Symptom**: `Cannot find module '@repo/db'`

**Fix**:
```bash
# From root
bun install
```

### Database Errors

**Symptom**: `no such table: users`

**Fix**:
```bash
cd apps/backend
bun run db:migrate
```

### CORS Errors

**Symptom**: `blocked by CORS policy`

**Fix**: Ensure both servers are running and check `apps/backend/src/index.ts` CORS config

### Type Errors

**Symptom**: TypeScript errors in IDE

**Fix**:
```bash
# From root
bun install
bun run type-check
# Restart TypeScript server in IDE
```

## ✨ Success Criteria

All checks should be ✅ for a successful setup:

- [ ] Dependencies installed
- [ ] TypeScript compiles without errors
- [ ] Backend server starts and responds
- [ ] Frontend server starts and loads
- [ ] API connection successful
- [ ] Database queries work
- [ ] User creation works
- [ ] Navigation works
- [ ] Type safety demonstrated
- [ ] Production builds succeed

## 🎉 Next Steps

Once all checks pass:

1. ✅ Commit your code
2. ✅ Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
3. ✅ Start building your features!
4. ✅ Explore [COMMANDS.md](./COMMANDS.md) for all available commands

---

**Still having issues?** Check:
- [README.md](./README.md) - Main documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project structure

