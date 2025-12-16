# ⚠️ Critical: Set These in Vercel Dashboard

Go to: https://vercel.com/sir-george2500s-projects/quick-cart/settings/environment-variables

## Required Environment Variables:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://username:password@host:5432/database?sslmode=require

# Authentication (REQUIRED)
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Server Config
NODE_ENV=production
PORT=3000

# CORS (Optional - set to * for testing)
CLIENT_URL=*
ADMIN_URL=*
ALLOWED_ORIGINS=*
```

## How to Add Variables:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Click "Add New"** for each variable
3. **Select all environments**: Production, Preview, Development
4. **Click "Save"**
5. **Redeploy** your project

## Check Function Logs:

1. Go to Vercel Dashboard
2. Click on latest deployment
3. Click "Functions" tab
4. View logs to see actual error

## Common Crash Causes:

❌ Missing `DATABASE_URL`
❌ Missing `JWT_SECRET`  
❌ Database connection failed
❌ Prisma Client not initialized

## Quick Fix:

```bash
# Set all variables in Vercel dashboard, then:
vercel env pull .env.production
```

After setting variables, **redeploy** or push a new commit!
