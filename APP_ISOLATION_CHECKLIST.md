# ⚠️ APP ISOLATION CHECKLIST ⚠️

## CRITICAL: Two Completely Separate Applications

This codebase contains **TWO SEPARATE APPLICATIONS** that must remain **COMPLETELY ISOLATED** from each other:

---

## 🚀 APPLICATION 1: Climate Risk Management App (CLIENT-READY)

**URL:** `https://risk-software.newdayclimate.com/climate-risk-management`

**Status:** PRODUCTION - Client delivery in progress  
**Priority:** URGENT - Must be delivered NOW  
**Path Pattern:** `/climate-risk-management/*`

### Purpose
Professional climate risk analysis, scenario planning, decision support for organizations dealing with climate change impacts.

### Key Characteristics
- ✅ Fully self-contained navigation
- ✅ Professional tool (no gamification)
- ✅ 4 major modules with 17 subpages
- ✅ All content focused on climate risk management
- ✅ Own legal pages (privacy, terms, support)

---

## 📊 APPLICATION 2: Magnum Opus App (INCOMPLETE)

**URL:** `https://risk-software.newdayclimate.com/dashboard` (and `/store`, `/organizations`, etc.)

**Status:** INCOMPLETE - Long-term development project  
**Priority:** Future project - NOT ready for client access  
**Path Pattern:** `/dashboard/*`, `/store/*`, `/organizations/*`

### Purpose
CO₂ emission tracking, reduction planning, gamification with points/store system.

### Key Characteristics
- ❌ NOT production-ready
- ❌ Should be INACCESSIBLE from Climate Risk app
- 🎮 Gamified experience (points, store, rewards)
- 🏢 Organization management features
- 🔮 May eventually incorporate climate risk functionality

---

## 🚫 WHY COMPLETE ISOLATION IS CRITICAL

1. **Client Urgency**: Climate Risk app needed NOW for client delivery
2. **Incomplete State**: Magnum Opus not ready for client viewing
3. **User Experience**: Different audiences require different tools
4. **Professional Reputation**: Client must not see incomplete features
5. **Future Flexibility**: Apps may merge later, but not now

---

## ✅ ISOLATION REQUIREMENTS CHECKLIST

### Navigation & Links

- [x] **ALL** Climate Risk Management links start with `/climate-risk-management/*`
- [x] **NO** links from Climate Risk app to `/dashboard`, `/store`, or `/organizations`
- [x] Header "Dashboard" link in Climate Risk context goes to `/climate-risk-management` (NOT `/dashboard`)
- [x] Footer links in Climate Risk app point to `/climate-risk-management/privacy`, `/terms`, `/support`
- [x] ClimateRiskManagementSidebar only contains `/climate-risk-management/*` links
- [x] No references to "CO₂ management" or "magnum opus" features in Climate Risk content

### Header Component (`/components/Header.tsx`)

When `pathname.startsWith('/climate-risk-management')` OR `callbackUrl` contains `/climate-risk-management`:

- [x] ✅ Shows "Dashboard" link → `/climate-risk-management`
- [x] ❌ Hides "Store" link
- [x] ❌ Hides "Points" display
- [x] ❌ Hides "Organizations" dropdown
- [x] ✅ Shows Logo, Username, Sign Out only
- [x] ✅ Logo link goes to `/climate-risk-management` for unauthenticated users in subdomain
- [x] ✅ Sign Out includes callbackUrl to keep users in subdomain context
- [x] ✅ Login/Get Started buttons hidden on landing page only

### Footer Component (`/components/Footer.tsx`)

When `pathname.startsWith('/climate-risk-management')` OR `callbackUrl` contains `/climate-risk-management`:

- [x] Shows title: "Climate Risk Management Platform"
- [x] NO subtext displayed
- [x] Privacy link → `/climate-risk-management/privacy`
- [x] Terms link → `/climate-risk-management/terms`
- [x] Support link → `/climate-risk-management/support`

### Authentication Redirects

- [x] All Climate Risk pages redirect to `/login?callbackUrl=/climate-risk-management/...`
- [x] Callback URLs keep users within `/climate-risk-management/*` path
- [x] NO redirect loops between apps
- [x] Register page respects callbackUrl and redirects correctly
- [x] Login page includes callbackUrl in Sign up link
- [x] Sign out includes callbackUrl when in subdomain

### Content & Messaging

- [x] No mention of "points" or "store" in Climate Risk app
- [x] No mention of "dashboard" (magnum opus) features
- [x] All accordion/help text refers only to Climate Risk modules
- [x] No gamification elements visible in Climate Risk app
- [x] Professional, business-focused language only

---

## 🛠️ FILES REQUIRING ISOLATION AWARENESS

### Core Components (Conditional Logic)
1. **`/components/Header.tsx`** ⚠️ CRITICAL
   - Contains warnings about two-app isolation
   - Uses `pathname.startsWith('/climate-risk-management')` checks
   - Conditionally shows/hides navigation elements

2. **`/components/Footer.tsx`** ⚠️ CRITICAL
   - Conditionally shows different legal page links
   - Different titles based on context

3. **`/components/ClimateRiskManagementSidebar.tsx`** ⚠️ CRITICAL
   - ONLY for Climate Risk app
   - ALL links must start with `/climate-risk-management/*`
   - Contains warnings about isolation

### Climate Risk Pages (Must Stay Isolated)
4. **`/app/climate-risk-management/page.tsx`**
   - Main dashboard for Climate Risk app
   - All module card links stay within `/climate-risk-management/*`
   - Accordion content references correct paths

5. **All 17 subpages** under `/app/climate-risk-management/*`
   - Must only link to other Climate Risk pages
   - Authentication redirects include full path

6. **Legal pages** (Isolated versions)
   - `/app/climate-risk-management/privacy/page.tsx`
   - `/app/climate-risk-management/terms/page.tsx`
   - `/app/climate-risk-management/support/page.tsx`

---

## 🔍 TESTING CHECKLIST

### Before Every Deployment

- [ ] Browse entire Climate Risk app - never see links to magnum opus
- [ ] Check header - no points/store visible in Climate Risk app
- [ ] Check footer - links go to Climate Risk legal pages
- [ ] Test all sidebar links - stay within `/climate-risk-management/*`
- [ ] Test accordion links on main page - all valid paths
- [ ] Login/logout from Climate Risk app - returns to Climate Risk
- [ ] No console errors about missing pages
- [ ] No references to incomplete features

### Manual Navigation Tests

1. **Start at**: `/climate-risk-management`
2. **Click through**: All 4 modules and their subpages
3. **Verify**: Never land on `/dashboard`, `/store`, or `/organizations`
4. **Check**: All links work (no 404s)
5. **Confirm**: Can access legal pages from footer
6. **Test**: Sign out returns to login, then back to Climate Risk context

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ DON'T DO THIS:
```typescript
// Wrong - links to magnum opus app
href="/dashboard"
href="/store"
href="/organizations"
href="/privacy" // (from Climate Risk context)

// Wrong - mentions magnum opus features
"before rushing into the CO₂ management section"
"Use your points to buy..."
"Check out the Store"
```

### ✅ DO THIS INSTEAD:
```typescript
// Correct - stays within Climate Risk app
href="/climate-risk-management"
href="/climate-risk-management/analyze-risks"
href="/climate-risk-management/privacy"

// Correct - Climate Risk focused messaging
"explore the climate risk modules"
"analyze location-specific risks"
"develop decision-making frameworks"
```

---

## 📝 DEVELOPER NOTES

### When Adding New Features to Climate Risk App:

1. **Always use full paths**: `/climate-risk-management/...`
2. **Check for cross-references**: Search for any links to `/dashboard`, `/store`, etc.
3. **Test navigation**: Ensure users can't accidentally leave the app
4. **Review content**: No mentions of magnum opus features
5. **Update this checklist**: Add new pages/features to testing list

### When Working on Magnum Opus App:

1. **Keep separate**: No cross-pollination of features
2. **Different context**: Remember it's a different user experience
3. **Future merge**: Design with eventual integration in mind, but keep isolated now

---

## 📚 RELATED DOCUMENTATION

- **`CLIMATE_RISK_MANAGEMENT_DOCS.md`** - Detailed technical documentation
- **`README.md`** - General project overview
- **Component files** - Warning comments at top of shared components

---

## 🎯 QUICK VERIFICATION SCRIPT

```bash
# Search for potential cross-contamination in Climate Risk app
cd carbon-reduction-planner/app/climate-risk-management

# Find any links to magnum opus paths (should return 0 results)
grep -r 'href="/dashboard' .
grep -r 'href="/store' .
grep -r 'href="/organizations' .

# Find links to root legal pages (should use /climate-risk-management/* instead)
grep -r 'href="/privacy"' .
grep -r 'href="/terms"' .
grep -r 'href="/support"' .
```

---

## ✨ SUCCESS CRITERIA

The isolation is successful when:

✅ A user can navigate the entire Climate Risk app without seeing any magnum opus features  
✅ No broken links or 404 errors in Climate Risk app  
✅ Header/footer adapt correctly based on context  
✅ Login/logout cycle keeps users in correct app context  
✅ Client can use Climate Risk app without knowing magnum opus exists  
✅ Developer reviewing code can clearly see the separation  

---

**Last Updated:** January 1, 2026  
**Status:** Active isolation in place  
**Next Review:** Before each deployment to production
