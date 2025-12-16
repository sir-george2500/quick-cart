# Vercel Deployment Guide for Quick-Cart Backend

## Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres or external like Neon, Supabase)
- Environment variables

## Setup Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Set Environment Variables in Vercel

Go to your project settings on Vercel and add these environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT
JWT_SECRET=your-very-secure-random-string-here
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3000

# CORS (your mobile app domain or * for development)
ALLOWED_ORIGINS=*

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Build Configuration

The `vercel.json` is configured to:

- Build TypeScript to `dist/` folder
- Route all `/api/v1/*` requests to the Express server
- Use Node.js runtime
- Set production environment

### 4. Deploy

**From the backend directory:**

```bash
cd quick-cart-backend

# Login to Vercel
vercel login

# Deploy (production)
vercel --prod

# Or deploy for preview
vercel
```

### 5. Database Migration

After deployment, run migrations on your production database:

```bash
# Connect to your production database
# Run migrations using Prisma
npx prisma migrate deploy

# Or manually run SQL migrations
```

### 6. Update Mobile App API URL

Update your mobile app's API URL to point to your Vercel deployment:

**File**: `quick-cart-customer/constants/Config.ts`

```typescript
export const API_URL = __DEV__
  ? "http://localhost:3000/api/v1"
  : "https://your-project.vercel.app/api/v1";
```

## Vercel Project Structure

```
quick-cart-backend/
├── vercel.json           # Vercel config
├── package.json          # Dependencies & build scripts
├── tsconfig.json         # TypeScript config
├── src/                  # Source files
│   ├── server.ts         # Entry point
│   ├── routes/           # API routes
│   └── ...
└── dist/                 # Built files (auto-generated)
    └── server.js         # Compiled entry
```

## Important Notes

### Build Command

Vercel will automatically run:

```bash
npm run build
```

Make sure your `package.json` has:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Serverless Functions

Vercel treats each request as a serverless function. Your Express app will be invoked on each request.

### Cold Starts

First request after inactivity may be slower due to cold starts. Consider using Vercel's Edge Functions or keep-alive strategies if needed.

### File System

Vercel's serverless functions have read-only file system. Avoid writing files to disk.

### Database Connection Pooling

Use connection pooling with Prisma:

```typescript
// In your Prisma setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

## Monitoring

Access logs and metrics:

- Visit your Vercel dashboard
- Go to your project → Deployments
- Click on deployment → Logs

## Troubleshooting

### Build Fails

- Check TypeScript compilation: `npm run build`
- Verify all dependencies are in `dependencies`, not `devDependencies`

### 500 Errors

- Check environment variables are set
- Verify database connection string
- Review function logs in Vercel dashboard

### CORS Errors

- Update `ALLOWED_ORIGINS` environment variable
- Check CORS middleware configuration

## Database Providers

### Recommended Options:

1. **Vercel Postgres** - Integrated with Vercel
2. **Neon** - Serverless PostgreSQL
3. **Supabase** - PostgreSQL with additional features
4. **Railway** - Simple deployment

## Example Deployment

```bash
# 1. Navigate to backend
cd quick-cart-backend

# 2. Login to Vercel
vercel login

# 3. Link project (first time)
vercel link

# 4. Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... add all other env vars

# 5. Deploy to production
vercel --prod
```

Your API will be available at: `https://your-project.vercel.app/api/v1`

## Test Deployment

```bash
# Test health endpoint
curl https://your-project.vercel.app/api/v1/health

# Test auth
curl -X POST https://your-project.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

🚀 Your backend is now live on Vercel!
