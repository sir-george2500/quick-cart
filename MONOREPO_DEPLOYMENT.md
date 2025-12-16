# Quick-Cart Monorepo - Vercel Deployment

## ✅ Deploying Backend from Monorepo

Your backend can stay in the monorepo! No need to separate it.

### Monorepo Structure

```
Quick-Cart/                    # Root (monorepo)
├── vercel.json               # Vercel config at root
├── quick-cart-backend/       # Backend project
│   ├── package.json
│   ├── app.ts
│   ├── dist/                 # Build output
│   └── ...
└── quick-cart-customer/      # Mobile app (not deployed to Vercel)
    └── ...
```

### How It Works

The `vercel.json` at the **root** specifies:

- **buildCommand**: Navigates to `quick-cart-backend` and runs build
- **outputDirectory**: Points to `quick-cart-backend/dist`
- **Routes**: All routes use `quick-cart-backend/dist/app.js`

### Deployment Steps

**From the monorepo root:**

```bash
# 1. Navigate to monorepo root
cd /home/delta-x/Quick-Cart

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

Vercel will:

1. Detect `vercel.json` at root
2. Run `cd quick-cart-backend && npm run build`
3. Use `quick-cart-backend/dist` as output
4. Deploy only the backend

### Alternative: Vercel CLI with Cwd

You can also deploy directly from backend folder:

```bash
cd quick-cart-backend
vercel --prod --cwd ..
```

This tells Vercel the root is one level up (the monorepo root).

### Environment Variables

Set these in Vercel dashboard (same as before):

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- etc.

### .gitignore

Make sure your root `.gitignore` excludes:

```
node_modules
dist
.env
.vercel
```

### Benefits of Monorepo Deployment

✅ Keep backend and frontend together
✅ Share types/constants between projects
✅ Single repository to manage
✅ Vercel handles the build context automatically

### Vercel Dashboard Settings

When linking the project:

1. **Root Directory**: Leave as `.` (monorepo root)
2. **Build Command**: Auto-detected from `vercel.json`
3. **Output Directory**: Auto-detected from `vercel.json`

Your backend will deploy successfully from the monorepo! 🚀

## Alternative: Deploy Backend Only

If you want to deploy ONLY the backend folder:

1. Go to Vercel dashboard
2. Import project
3. Set **Root Directory** to `quick-cart-backend`
4. Keep the original `vercel.json` in the backend folder

This approach treats the backend as if it's a standalone project.
