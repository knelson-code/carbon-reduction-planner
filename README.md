# Carbon Reduction Planner - Climate Risk Management Tool

Enterprise-grade climate risk management and scenario analysis platform for strategic decision-making.

## 🚀 Quick Links

- **Production Site**: https://risk-software.newdayclimate.com
- **Vercel Dashboard**: https://vercel.com/keithnelson-newdayinterns-projects/carbon-reduction-planner/deployments
- **GitHub Repository**: https://github.com/knelson-code/carbon-reduction-planner

## 📚 Documentation

### Core Documentation
- **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - How to commit, push, and deploy changes
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment process and troubleshooting
- **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** - Vercel configuration and environment variables
- **[STYLE_GUIDELINES.md](./STYLE_GUIDELINES.md)** - Design system and styling rules

### Session Notes
- **[SESSION_NOTES_2026-01-05.md](./SESSION_NOTES_2026-01-05.md)** - Latest session: Attempted deterioration slider (reverted)

## 🎯 Current Status (January 5, 2026)

**Production Version**: Commit `9454bc4` (Stable ✅)

**Features Working**:
- ✅ Scenario Explorer with 8 policy sliders
- ✅ EBITDA projections (2024-2035)
- ✅ Excel export functionality
- ✅ Interactive graphs and tables
- ✅ Policy assumptions popups

**In Development**:
- 🔄 "Deterioration of our Operating Environment" slider (pending TypeScript fixes)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15.5.9
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.17.0
- **Authentication**: NextAuth.js
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

### Project Structure
```
carbon-reduction-planner/
├── app/                          # Next.js app directory
│   ├── climate-risk-management/  # Risk management section (MAIN FOCUS)
│   │   ├── scenario-analysis/    # Scenario Explorer page
│   │   ├── analyze-risks/        # Risk analysis pages
│   │   ├── decision-making/      # Decision support tools
│   │   └── risks-by-location/    # Location-specific risks
│   ├── dashboard/                # Main dashboard (IN DEVELOPMENT)
│   ├── login/                    # Authentication
│   └── api/                      # API routes
├── components/                   # Reusable React components
├── lib/                          # Utilities and configuration
├── prisma/                       # Database schema and migrations
└── public/                       # Static assets
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- VS Code (recommended)

### Installation
```bash
# Clone repository
git clone https://github.com/knelson-code/carbon-reduction-planner.git
cd carbon-reduction-planner

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

### Testing Before Deployment
```bash
# ALWAYS run this before pushing to production
npm run build

# Should see: ✓ Compiled successfully
# If errors, fix them before pushing!
```

## 📊 Key Features

### Scenario Explorer
Interactive policy and climate scenario modeling with:
- **8 Policy Sliders**: Combustion engine phase-out, LEZ, EV promotion, etc.
- **EBITDA Projections**: 10 service lines over 10-year period (2024-2035)
- **Impact Analysis**: Real-time CAGR adjustments based on policy settings
- **Excel Export**: Detailed calculation breakdown with formulas
- **Visual Analytics**: Stacked area charts and comprehensive tables

### Risk Analysis
- Physical climate risks
- Transition risks (policy and technology)
- Location-specific risk assessments
- Scenario storylines

### Decision Support
- Risk prioritization methodology
- Strategic recommendations
- Implementation guidance

## 🚨 Important Notes

### For Developers

1. **Always Test Locally First**
   ```bash
   npm run build  # Must succeed before pushing
   ```

2. **TypeScript is Strict**
   - Next.js 15 enforces TypeScript checking
   - Cannot skip type errors in production builds
   - Add proper interfaces for complex types

3. **Production Stability Priority**
   - Revert immediately after 2-3 failed deployments
   - Use `git reset --hard <commit>` to revert
   - Fix issues offline, test locally, deploy once

4. **Git Workflow**
   - Use PowerShell for git commands (bash not available)
   - Commit messages should be descriptive
   - Main branch deploys automatically to production

### For Future Sessions

**Before Starting Any Work:**
1. Read the latest session notes (SESSION_NOTES_*.md)
2. Check current production status in Vercel dashboard
3. Verify what features are working vs. in development

**When Adding Features:**
1. Create TypeScript interfaces for complex types
2. Test build locally with `npm run build`
3. Only push when build succeeds
4. Monitor Vercel deployment

## 🌐 Deployment

### Automatic Deployment
Every push to `main` branch triggers automatic deployment to Vercel:

```bash
git add -A
git commit -m "Your descriptive message"
git push
```

Vercel will:
1. Clone the repository
2. Install dependencies
3. Run Prisma migrations
4. Build Next.js app (with TypeScript checking)
5. Deploy to production

### Manual Deployment Trigger
If Vercel doesn't auto-deploy:
```bash
# Empty commit to trigger rebuild
git commit --allow-empty -m "Trigger deployment"
git push
```

## 📈 Service Lines

The application tracks 10 service lines across 3 categories:

**Urban (4 lines)**:
- On-Street (ON)
- Off-Street (OFF)
- Congestion Charging & LEZ (LEZ)
- Other Urban (OTH)

**Interurban (3 lines)**:
- Road User Charging/Tolling (TOL)
- Intelligent Traffic Systems (Systems)
- Mowiz Truck (M-TRK)

**Safety & Operations (3 lines)**:
- Road Safety (SAFE)
- SaaS Data-Centric Solutions (DATA)
- Mowiz App (M-APP)

## 🔐 Environment Variables

Required in Vercel:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Production URL

## 📞 Support

For issues or questions:
1. Check session notes for recent context
2. Review relevant documentation files
3. Check Vercel deployment logs for build errors
4. Review TypeScript error messages carefully

## 🎨 Design System

- **Primary Color**: Navy Blue (#163E64)
- **Secondary**: Steel Blue (#4682B4)
- **Accent**: Orange (#FF5B35)
- **Font**: System fonts (Geist)
- **Spacing**: Tailwind CSS utilities

See [STYLE_GUIDELINES.md](./STYLE_GUIDELINES.md) for complete design system.

## 📝 License

Proprietary - New Day International Consulting

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0  
**Status**: Production (Stable)
