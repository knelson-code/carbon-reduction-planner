# Vercel Production Setup Guide

## 🔴 Current Issue: Registration Error

**Problem:** The app is showing "An error occurred during registration" in production because:
- The database is configured for SQLite (file-based database)
- Vercel's serverless functions have **read-only** file systems
- SQLite cannot write to the database in production

**Solution:** Use PostgreSQL instead (already updated in `prisma/schema.prisma`)

---

## 📊 Setting Up PostgreSQL Database

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **Go to your Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `carbon-reduction-planner`

2. **Add Postgres Storage:**
   - Click on the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a region (same as your deployment for best performance)
   - Click "Create"

3. **Connect to Project:**
   - Vercel will automatically add these environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL` ← **Use this one**
     - `POSTGRES_URL_NON_POOLING`
     - Others...
   
4. **Update Environment Variables:**
   - Go to Settings → Environment Variables
   - Add/Update: `DATABASE_URL` = `$POSTGRES_PRISMA_URL`
   - This tells your app to use the Vercel Postgres database

### Option 2: Neon (Free Tier Available)

1. **Create Account:** https://neon.tech
2. **Create New Project:**
   - Name: "carbon-reduction-planner"
   - Region: Choose closest to your users
3. **Get Connection String:**
   - Copy the connection string (starts with `postgresql://`)
4. **Add to Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `DATABASE_URL` = `<your-neon-connection-string>`

### Option 3: Supabase (Free Tier Available)

1. **Create Account:** https://supabase.com
2. **Create New Project:**
   - Name: "carbon-reduction-planner"
   - Generate a secure database password
3. **Get Connection String:**
   - Go to Settings → Database
   - Copy the "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password
4. **Add to Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `DATABASE_URL` = `<your-supabase-connection-string>`

---

## 🔐 Required Environment Variables on Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

```env
# Database (from one of the options above)
DATABASE_URL=<your-postgresql-connection-string>

# NextAuth.js
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://carbon-reduction-planner-pz5v.vercel.app
```

### Generating NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## 🗄️ Running Database Migrations

After setting up the database, you need to create the tables:

### Method 1: Automatic (via Vercel Deploy)

1. Add this script to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

2. Commit and push to trigger a new deployment:
```bash
git add .
git commit -m "Add PostgreSQL and migration scripts"
git push
```

### Method 2: Manual (from Local Machine)

1. Set the production DATABASE_URL locally:
```bash
# Windows CMD
set DATABASE_URL=your-production-database-url
npx prisma migrate deploy

# Windows PowerShell
$env:DATABASE_URL="your-production-database-url"
npx prisma migrate deploy

# Mac/Linux
export DATABASE_URL=your-production-database-url
npx prisma migrate deploy
```

2. This will run all migrations on your production database

---

## ✅ Verification Steps

After setup:

1. **Check Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify `DATABASE_URL` and `NEXTAUTH_SECRET` are set

2. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit

3. **Test Registration:**
   - Go to: https://carbon-reduction-planner-pz5v.vercel.app/register
   - Try creating a new account
   - Should work without errors!

4. **Check Logs:**
   - If it still fails, check Vercel Logs:
   - Deployment → View Function Logs
   - Look for error messages

---

## 🔄 Local Development with PostgreSQL

If you want to use PostgreSQL locally too:

### Option 1: Keep SQLite for Local

Create `.env.local` with SQLite:
```env
DATABASE_URL="file:./dev.db"
```

Your production `.env` (not committed) will use PostgreSQL.

### Option 2: Use PostgreSQL Locally

1. **Install PostgreSQL:**
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

2. **Create Local Database:**
```bash
psql -U postgres
CREATE DATABASE carbon_planner_dev;
\q
```

3. **Update `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/carbon_planner_dev"
```

4. **Run Migrations:**
```bash
npx prisma migrate dev
```

---

## 📝 Summary

**What was changed:**
- ✅ Updated `prisma/schema.prisma` from SQLite → PostgreSQL

**What you need to do:**
1. ✅ Set up a PostgreSQL database (Vercel Postgres, Neon, or Supabase)
2. ✅ Add `DATABASE_URL` to Vercel environment variables
3. ✅ Add `NEXTAUTH_SECRET` to Vercel environment variables
4. ✅ Run migrations (either via deploy or manually)
5. ✅ Redeploy the app
6. ✅ Test registration in production

**Expected outcome:**
- Registration should work in production
- Users can create accounts
- Data persists in PostgreSQL database

---

## 🆘 Troubleshooting

### "An error occurred during registration" still appears

1. Check Vercel Function Logs for specific error
2. Verify `DATABASE_URL` is set correctly
3. Ensure migrations ran successfully
4. Try redeploying after setting environment variables

### "Prisma Client Not Found" error

Add to `package.json`:
```json
"postinstall": "prisma generate"
```

### Connection timeout errors

- Check database is accessible from Vercel's region
- Verify connection string includes `?sslmode=require` if needed
- Ensure database allows connections from Vercel IPs

---

Need help? Check:
- Vercel Docs: https://vercel.com/docs/storage/vercel-postgres
- Prisma Docs: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
