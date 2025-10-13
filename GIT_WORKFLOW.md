# Simple Git Workflow Guide

## 🎯 For Beginners - The Basics You Need

This guide explains the simple workflow for making changes and deploying them to production.

---

## 📁 Project Structure Overview

```
carbon-reduction-planner/
├── app/                    # All your pages and routes
│   ├── page.tsx           # Main homepage
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Dashboard (after login)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Header.tsx         # Top navigation bar
│   └── Footer.tsx         # Bottom footer
├── lib/                   # Backend logic
│   └── auth.ts           # Authentication
├── prisma/               # Database
│   └── schema.prisma     # Database structure
└── Documentation files:
    ├── DEPLOYMENT_GUIDE.md    # How to deploy
    ├── VERCEL_SETUP.md        # Vercel setup
    ├── STYLE_GUIDELINES.md    # Design rules
    └── GIT_WORKFLOW.md        # This file!
```

---

## 🔄 The Simple 3-Step Workflow

Every time you make changes, follow these 3 steps:

### Step 1: Make Your Changes
- Edit files in VS Code
- Save your changes (Ctrl+S / Cmd+S)

### Step 2: Use VS Code Source Control
1. **Look at the left sidebar** of VS Code
2. **Click the Source Control icon** (looks like a branching tree, will have a number badge)
3. **You'll see all your changed files listed**
4. **Type a commit message** describing what you changed
   - Example: "Update button colors"
   - Example: "Fix spacing on homepage"
5. **Click the checkmark (✓)** button to commit
6. **Click "Sync Changes"** button (or the cloud/arrow icon) to push

### Step 3: Wait for Deployment
- Vercel automatically deploys when you push to GitHub
- Check https://vercel.com/dashboard to see deployment progress
- Usually takes 1-2 minutes
- Your changes appear at https://risk-software.newdayclimate.com

---

## 🔧 Alternative: Using Command Line

If you prefer the terminal (or if VS Code UI isn't working):

### Method 1: Git Bash (Usually Works Best)

Open Git Bash terminal in VS Code and run:

```bash
# 1. Check what files changed
git status

# 2. Add all changes
git add -A

# 3. Commit with a message
git commit -m "Your message here"

# 4. Push to GitHub
git push
```

### Method 2: Regular Terminal

```bash
# Navigate to project folder
cd "carbon-reduction-planner"

# Check status
bash -c "cd 'carbon-reduction-planner' && git status"

# Add changes
bash -c "cd 'carbon-reduction-planner' && git add -A"

# Commit
bash -c "cd 'carbon-reduction-planner' && git commit -m 'Your message here'"

# Push
bash -c "cd 'carbon-reduction-planner' && git push"
```

---

## 📊 How Everything Connects

```
Your Computer (VS Code)
    ↓ (git push)
GitHub Repository
    ↓ (automatic trigger)
Vercel Build & Deploy
    ↓
Production Website (https://risk-software.newdayclimate.com)
    ↓ (reads from)
Neon Database (PostgreSQL)
```

### What Happens When You Push:

1. **You push to GitHub** → Your code is saved in GitHub repository
2. **Vercel detects the push** → Automatically starts building your app
3. **Vercel builds the app** → Compiles TypeScript, bundles files
4. **Vercel deploys** → Makes it live at your domain
5. **Done!** → Changes are live in 1-2 minutes

---

## 🚨 Common Issues & Solutions

### Issue: "fatal: not a git repository"

**Cause:** Command line can't find the git folder

**Solution:** Use VS Code Source Control UI instead of command line

### Issue: "Changes not showing on GitHub"

**Cause:** You committed locally but didn't push

**Solution:** Run `git push` or click "Sync Changes" in VS Code

### Issue: "Changes not showing on production site"

**Cause:** Deployment might still be in progress or failed

**Solution:**
1. Check Vercel dashboard for deployment status
2. Wait 2-3 minutes for deployment to complete
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: VS Code shows changes but won't let you commit

**Cause:** You might need to configure git identity

**Solution:** Run these commands once:
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

---

## 📝 Good Commit Message Examples

**Good:**
- ✅ "Update primary color to navy blue #163E64"
- ✅ "Fix header spacing on mobile"
- ✅ "Add password recovery instructions"

**Bad:**
- ❌ "Changes"
- ❌ "Fix stuff"
- ❌ "asdfasdf"

**Why it matters:** Good messages help you understand what changed when looking at history.

---

## 🎓 Essential Git Commands to Know

```bash
# See what files you changed
git status

# See your recent commits
git log --oneline -5

# See what branch you're on
git branch

# Undo uncommitted changes to a file
git restore <filename>

# See all remote connections
git remote -v
```

---

## 🔐 Environment Variables

These are secret settings that live in Vercel (not in your code):

**Where they are:** Vercel Dashboard → Your Project → Settings → Environment Variables

**What they do:**
- `DATABASE_URL` → Connects to your database
- `NEXTAUTH_SECRET` → Encrypts user sessions
- `NEXTAUTH_URL` → Your website URL

**Important:** Never commit these to git! They're already in Vercel.

---

## 🆘 When Things Go Wrong

### If you broke something:

1. **Don't panic!** Git keeps history of everything
2. **Check recent commits:**
   ```bash
   git log --oneline -10
   ```
3. **Revert to previous version:**
   ```bash
   git revert HEAD
   git push
   ```
4. **Or create a new chat with Cline** and ask for help

### If VS Code won't commit:

1. Close VS Code
2. Open Git Bash (or Terminal)
3. Navigate to project:
   ```bash
   cd "carbon-reduction-planner"
   ```
4. Run commands manually:
   ```bash
   git add -A
   git commit -m "Your message"
   git push
   ```

---

## ✅ Daily Workflow Checklist

When making changes:

- [ ] Make changes in VS Code
- [ ] Save files (Ctrl+S)
- [ ] Test locally (npm run dev)
- [ ] Open Source Control panel
- [ ] Review changed files (make sure you meant to change them)
- [ ] Write commit message
- [ ] Click checkmark to commit
- [ ] Click "Sync Changes" to push
- [ ] Check Vercel dashboard for deployment
- [ ] Wait 2 minutes
- [ ] Check production site
- [ ] Celebrate! 🎉

---

## 📖 Where to Find More Info

- **GitHub Repository:** https://github.com/knelson-code/carbon-reduction-planner
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Production Site:** https://risk-software.newdayclimate.com
- **Database (Neon):** https://console.neon.tech

---

## 💡 Pro Tips

1. **Commit often** → Small commits are easier to understand and undo if needed
2. **Test locally first** → Run `npm run dev` before pushing
3. **Use descriptive messages** → Future you will thank present you
4. **Don't fear mistakes** → Git keeps history, you can always go back
5. **Check Vercel logs** → If deployment fails, logs tell you why

---

## 🎯 Remember

**The beauty of this setup:**
- You edit files in VS Code
- You click a few buttons or run a few commands
- Everything automatically deploys
- Changes are live in minutes
- No FTP, no servers to manage, no complexity

**You've got this!** 🚀

---

Last Updated: October 2025
