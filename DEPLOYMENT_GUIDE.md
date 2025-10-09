# Deployment Guide - Username-Only Authentication Update

## 📋 Overview

This guide covers deploying the updated CO₂ Reduction Planner with username-only authentication to production on Vercel.

---

## ✅ What Was Changed

### 1. **Database Schema**
- Removed email field from User model
- Added username field (unique)
- Removed Account, Session, and VerificationToken models (no longer needed for simple username/password)

### 2. **Authentication System**
- Login now uses username instead of email
- Registration now uses username instead of email
- Passwords still securely hashed with bcrypt

### 3. **User Interface**
- Registration page: Username field with privacy note
- Login page: Username field
- Warning messages about password recovery

### 4. **Security**
- Added security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- HTTPS enforced
- Password hashing maintained

### 5. **Legal Pages**
- Created /privacy - Privacy Policy
- Created /terms - Terms of Service
- Created /support - Support & Password Recovery
- Added footer with links

---

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes

```bash
cd carbon-reduction-planner
git add .
git commit -m "Implement username-only authentication with legal pages"
git push origin main
```

### Step 2: Vercel Will Auto-Deploy

Vercel automatically deploys when you push to the main branch. The deployment includes:
- Running `prisma db push` to update the Neon database schema
- Building the Next.js application
- Deploying to https://risk-software.newdayclimate.com

### Step 3: Monitor Deployment

1. Go to https://vercel.com/dashboard
2. Find your project: `carbon-reduction-planner`
3. Click on the latest deployment
4. Check the build logs for any errors

### Step 4: Verify Database Migration

The deployment will automatically run:
```bash
prisma db push --accept-data-loss
```

**⚠️ IMPORTANT:** This will drop the email column and add the username column. **All existing users will be deleted** because we can't migrate email to username automatically.

### Step 5: Test Production

After deployment succeeds, test these flows:

1. **Registration:** https://risk-software.newdayclimate.com/register
   - Create account with username only
   - Verify you can register successfully

2. **Login:** https://risk-software.newdayclimate.com/login
   - Login with username and password
   - Verify you reach the dashboard

3. **Legal Pages:**
   - Visit /privacy
   - Visit /terms
   - Visit /support
   - Check footer links work

---

## ⚠️ Known Issues After Deployment

### Existing Users Will Be Lost

Since we're changing from email to username, the database migration will:
- Drop the `email` column
- Add the `username` column
- **All existing user accounts will be deleted**

This is acceptable since:
- The tool is not yet publicly launched
- Only test accounts exist
- Fresh start with privacy-first approach

### If You Need to Preserve Existing Users

If there are important existing accounts, you would need to:

1. **Before deploying**, export existing users:
```sql
SELECT id, email, password FROM User;
```

2. **After deploying**, manually recreate them:
```sql
-- For each user, convert their email to a username
UPDATE User SET username = 'user1' WHERE id = 'xxx';
```

However, for a fresh launch, it's cleaner to start fresh.

---

## 🔐 Security Checklist

After deployment, verify:

- [ ] **HTTPS works** - Green padlock in browser
- [ ] **Security headers active** - Check in browser dev tools > Network > Headers
- [ ] **Passwords are hashed** - Never stored in plain text
- [ ] **Legal pages accessible** - /privacy, /terms, /support
- [ ] **Footer links work** - All footer links clickable

### Enable Neon Database Backups

**CRITICAL: Do this after deployment**

1. Log into Neon: https://console.neon.tech
2. Select project: `neon-indigo-garden`
3. Go to Settings → Backups
4. **Enable automatic backups**
5. Configure backup retention (7-30 days recommended)

---

## 📝 Post-Deployment Tasks

### 1. Update Environment Variables (Already Set)

These should already be configured in Vercel, but verify:

```
DATABASE_URL=<Neon PostgreSQL connection string>
NEXTAUTH_SECRET=<Random secret>
NEXTAUTH_URL=https://risk-software.newdayclimate.com
```

### 2. Submit Domain for Firewall Categorization

To reduce corporate firewall blocking, submit your domain:

**Fortinet:**
- URL: https://www.fortiguard.com/faq/categorization
- Domain: risk-software.newdayclimate.com
- Category: Business, Web Collaboration

**Palo Alto:**
- URL: https://urlfiltering.paloaltonetworks.com/
- Category: Business & Economy

**Cisco Talos:**
- URL: https://www.talosintelligence.com/reputation_center
- Category: Business Tool

**Note:** This takes 2-4 weeks to take effect.

### 3. Test Email Support Process

Since password recovery is manual:

1. Send yourself a test email to: support@newdayclimate.com
2. Verify you receive it
3. Practice the password recovery flow:
   - User emails with username
   - You manually reset password in database
   - Send temporary password via email

---

## 🎯 User Communication

### For Existing Test Users

If anyone was testing the old version:

**Email Template:**
```
Subject: CO₂ Tool Update - Please Re-register

Hi,

We've updated the CO₂ Reduction Planner with improved privacy features. The tool now uses username-only authentication (no email required).

Your previous account was removed as part of this update. Please re-register:

https://risk-software.newdayclimate.com/register

New features:
- Username-only login (maximum privacy)
- Anonymous organization names
- Password recovery via support email

Best regards,
[Your Name]
NewDay Climate
```

---

## 🔄 Future Updates

### Adding Rate Limiting (Optional)

To prevent brute force attacks:

1. Sign up for Upstash Redis (free tier): https://upstash.com
2. Get your credentials:
   - UPSTASH_REDIS_REST_URL
   - UPSTASH_REDIS_REST_TOKEN
3. Add to Vercel environment variables
4. Implement rate limiting in login/register routes

See: `lib/rate-limit.ts` example in the project handoff document.

### Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (privacy-friendly: Plausible or Fathom)
- Uptime monitoring (UptimeRobot)

---

## 🆘 Troubleshooting

### "Invalid credentials" on Login

**Cause:** User model changed, old sessions invalid

**Solution:**
- Clear browser cookies
- Try registering a new account
- Verify database schema updated correctly

### Database Connection Errors

**Cause:** DATABASE_URL not set or incorrect

**Solution:**
1. Check Vercel environment variables
2. Verify Neon database is running
3. Test connection string in Prisma Studio

### Build Fails on Vercel

**Check:**
1. View build logs in Vercel dashboard
2. Common issue: `prisma db push` fails
3. Verify DATABASE_URL is set for production

### Legal Pages Not Showing

**Cause:** Routes not created or footer not included

**Solution:**
- Verify files exist: app/privacy/page.tsx, app/terms/page.tsx, app/support/page.tsx
- Check Footer component is in layout.tsx
- Clear Next.js cache: `npm run build` locally

---

## 📞 Support

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Check Neon database status
3. Test locally first: `npm run dev`
4. Review this guide for common issues

---

## ✅ Success Criteria

Deployment is successful when:

- ✅ Application loads at https://risk-software.newdayclimate.com
- ✅ Registration works with username-only
- ✅ Login works with username
- ✅ Dashboard loads after login
- ✅ Legal pages accessible (/privacy, /terms, /support)
- ✅ Footer shows correctly
- ✅ No console errors in browser
- ✅ Database backups enabled in Neon

---

## 🎉 Next Steps After Successful Deployment

1. **Create Squarespace access request form**
   - Form fields: Email, Company (optional), Why you need access
   - Form submission → Mailchimp

2. **Prepare launch announcement**
   - LinkedIn post
   - Email to existing contacts
   - Website update

3. **Test with real users**
   - Invite 5-10 beta testers
   - Gather feedback
   - Fix any issues

4. **Monitor for 1-2 weeks**
   - Check error logs
   - Monitor database performance
   - Respond to support emails

Good luck! 🚀
