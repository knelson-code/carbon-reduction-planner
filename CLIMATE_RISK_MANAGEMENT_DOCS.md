# Climate Risk Management App - Complete Documentation

## ⚠️ CRITICAL: TWO COMPLETELY SEPARATE APPLICATIONS ⚠️

**THIS IS NOT ONE APP WITH TWO SECTIONS. THESE ARE TWO SEPARATE APPLICATIONS THAT HAPPEN TO SHARE THE SAME CODEBASE AND INFRASTRUCTURE.**

### Understanding the Separation

We are building **TWO DISTINCT, ISOLATED APPLICATIONS**:

#### 1. 🚀 CLIMATE RISK MANAGEMENT APP (URGENT - CLIENT DELIVERY)
- **URL**: `https://risk-software.newdayclimate.com/climate-risk-management`
- **Status**: ACTIVE CLIENT PROJECT - Must be delivered NOW
- **Isolation**: **COMPLETELY SELF-CONTAINED** - Users must NEVER leave this subdomain
- **Purpose**: Professional climate risk analysis, scenario planning, decision support
- **Base Path**: `/app/climate-risk-management/*`
- **Sidebar**: Uses `ClimateRiskManagementSidebar.tsx` 
- **Navigation**: Only links within `/climate-risk-management/*` paths
- **Features**: 4 major modules with 17 subpages - ALL content focused on climate risk

#### 2. 📊 MAIN "MAGNUM OPUS" APP (LONG-TERM PROJECT - INCOMPLETE)
- **URL**: `https://risk-software.newdayclimate.com/dashboard` (and `/store`, `/organizations`, etc.)
- **Status**: INCOMPLETE - Long-term development project
- **Access**: Should be COMPLETELY INACCESSIBLE from Climate Risk Management App
- **Purpose**: CO₂ emission tracking, reduction planning, gamification with points/store
- **Base Path**: `/app/dashboard/*` (plus `/store/*`, `/organizations/*`, etc.)
- **Sidebar**: Uses standard `Sidebar.tsx` component
- **Features**: Organizations, Activities, Points system, Store for rewards

---

## 🚫 CRITICAL ISOLATION REQUIREMENTS

### Why Complete Separation is Essential

1. **Client needs Climate Risk App NOW** - It must be production-ready
2. **Magnum Opus is INCOMPLETE** - Not ready for client access
3. **Users must never accidentally navigate** from Climate Risk App → Magnum Opus
4. **Different user experiences** - Professional tool vs. gamified tracker
5. **May eventually merge** - But that's far future, not now

### Isolation Checklist

**Climate Risk Management App MUST:**
- ✅ Only show links to pages within `/climate-risk-management/*`
- ✅ Have NO links to `/dashboard`, `/store`, `/organizations`, etc.
- ✅ Hide all gamification elements (points, store)
- ✅ Use only `ClimateRiskManagementSidebar.tsx` for navigation
- ✅ Have its own legal pages (privacy, terms, support) within subdomain
- ✅ Redirect to login with callback URL within `/climate-risk-management/*`
- ✅ Header "Dashboard" link goes to `/climate-risk-management` (NOT `/dashboard`)

**Magnum Opus App (when complete) WILL:**
- Have its own separate navigation structure
- May eventually incorporate climate risk functionality
- But for now, exists in parallel, not connected

---

## Climate Risk Management Structure

### Main Dashboard Page
**File**: `/app/climate-risk-management/page.tsx`

**Features**:
- 4 module cards in a grid layout
- Each card shows title and bullet-point description of subpages
- "Methodology" accordion section at bottom
- Hover effects with color transitions
- Fully authenticated (redirects to login if not signed in)

### Four Main Modules

#### 1. Analyze Risks (8 subpages)
**Path**: `/climate-risk-management/analyze-risks/*`

**Subpages**:
1. Understanding climate risk (`/understanding`)
2. Labor productivity loss (`/labor-productivity`)
3. Delay in policy implementation (`/policy-delay`)
4. Extreme events (`/extreme-events`)
5. Operational interruptions (`/operational-interruptions`)
6. Decline in resilience of our clients (`/client-resilience`)
7. Deterioration of our operational context (`/operational-context`)
8. Risks to employees (`/employee-risks`)

**Purpose**: Comprehensive risk identification and analysis across multiple dimensions of climate impact.

#### 2. Risks by Location (4 subpages)
**Path**: `/climate-risk-management/risks-by-location/*`

**Subpages**:
1. Spain (`/spain`)
2. India (`/india`)
3. Brazil (`/brazil`)
4. Global (`/global`)

**Purpose**: Geographic-specific risk assessment for key operational locations.

#### 3. Scenario Analysis (2 subpages)
**Path**: `/climate-risk-management/scenario-analysis/*`

**Subpages**:
1. Scenario Explorer (`/scenario-explorer`)
2. Storylines (`/storylines`)

**Purpose**: Future scenario planning and narrative-based risk exploration.

#### 4. Decision Making (3 subpages)
**Path**: `/climate-risk-management/decision-making/*`

**Subpages**:
1. Methodology (`/methodology`)
2. Prioritization (`/prioritization`)
3. Recommendations (`/recommendations`)

**Purpose**: Strategic decision support and action prioritization framework.

---

## Navigation Architecture

### ClimateRiskManagementSidebar Component
**File**: `/components/ClimateRiskManagementSidebar.tsx`

**Unique Features**:
- **Vertical collapsed state**: Only 24px wide when not hovered, showing vertical text labels
- **Expansion on hover**: Expands to 240px revealing full navigation
- **Auto-expanding submenus**: When hovering over a menu item with subItems, automatically opens that section
- **One-at-a-time expansion**: Only one submenu can be open at a time
- **Visual feedback**: Active page highlighted with blue background and left border
- **Smooth transitions**: 300ms duration for expand/collapse animations

**Menu Order** (matches dashboard card order):
1. Dashboard (home link)
2. Analyze Risks (8 subpages)
3. Risks by Location (4 subpages)
4. Scenario Analysis (2 subpages)
5. Decision Making (3 subpages)

---

## Header Customization

### Conditional Header Behavior
**File**: `/components/Header.tsx`

**When in Climate Risk Management** (`pathname.startsWith('/climate-risk-management')`):
- Shows "Dashboard" link instead of "Climate Risk Management"
- **Hides** Points display
- **Hides** Store link
- **Hides** Organizations dropdown
- Keeps: Logo, Username, Sign Out

**Reasoning**: Climate Risk Management is a professional analysis tool, not a gamified experience. Users don't need points/store access while doing risk assessment work.

---

## Footer Customization

### Conditional Footer Behavior
**File**: `/components/Footer.tsx`

**When in Climate Risk Management** (`pathname.startsWith('/climate-risk-management')`):
- **Title**: "Climate Risk Management Platform" (no subtext)
- **Links point to subdomain-specific pages**:
  - Privacy Policy → `/climate-risk-management/privacy`
  - Terms of Service → `/climate-risk-management/terms`
  - Support → `/climate-risk-management/support`

**When in Main Dashboard**:
- **Title**: "Climate Management Platform"
- **Subtext**: "Strategic tools for producing systemic social and economic change..."
- **Links point to root pages**: `/privacy`, `/terms`, `/support`

### Subdomain-Specific Legal Pages
We created separate legal pages within the climate-risk-management path to keep users within that subdomain:

**Created Pages**:
1. `/app/climate-risk-management/privacy/page.tsx`
2. `/app/climate-risk-management/terms/page.tsx`
3. `/app/climate-risk-management/support/page.tsx`

**Content**: Identical to main site versions, but accessed via subdomain paths to maintain user context.

---

## Page Template Structure

Every subpage in Climate Risk Management follows this template:

```typescript
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ClimateRiskManagementSidebar from "@/components/ClimateRiskManagementSidebar"

export default function PageName() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/climate-risk-management/...")
    }
  }, [status, router])

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // Not authenticated
  if (!session) {
    return null
  }

  // Main content
  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <ClimateRiskManagementSidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1>Page Title</h1>
          <div className="bg-white p-6 rounded-lg">
            <p>Content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Key Elements**:
- Client-side component (`"use client"`)
- Session management with NextAuth
- Authentication redirect with callback URL
- Loading and unauthorized states
- ClimateRiskManagementSidebar integration
- Consistent layout structure
- Placeholder content for future development

---

## Styling & Design System

### Color Palette
- **Primary Dark**: `#0B1F32` (headings, text)
- **Secondary Dark**: `#163E64` (links, accents)
- **Orange Accent**: `#FF5B35` (underlines, highlights)
- **Light Gray**: `#d4dfe0` (borders)
- **Background**: `#f5f5f5` (cards), `#f9fafb` (page background)

### Module Card Colors
Each module has its own color scheme on the dashboard:
1. **Analyze Risks**: Amber (`#f59e0b` / `#fef3c7`)
2. **Risks by Location**: Blue (`#3b82f6` / `#dbeafe`)
3. **Scenario Analysis**: Green (`#10b981` / `#d1fae5`)
4. **Decision Making**: Purple (`#8b5cf6` / `#ede9fe`)

### Typography
- **Headings**: Bold, large (text-3xl for page titles)
- **Body**: Gray-700, leading-relaxed
- **Links**: Underlined with orange accent color

---

## Authentication & Security

### Shared Authentication System
Both modules use the same NextAuth configuration:
- **Session provider**: Wraps entire app
- **Database**: SQLite (Prisma)
- **User model**: Shared between both modules
- **Login page**: `/app/login/page.tsx` (shared)
- **Protected routes**: All pages require authentication

### Callback URLs
Each page includes its full path in the login redirect:
```typescript
router.push("/login?callbackUrl=/climate-risk-management/analyze-risks/understanding")
```

This ensures users return to exactly where they were trying to access after login.

---

## URL Structure & Routing

### Subdomain Configuration
**Vercel Setup**:
1. Main domain: `carbon-reduction-planner.vercel.app`
2. Subdomain: `risk-software.newdayclimate.com`
3. Both point to same deployment
4. Routing handled by Next.js based on path (`/climate-risk-management/*`)

### Path Hierarchy
```
/climate-risk-management/                          # Dashboard
├── analyze-risks/                                 # Module 1
│   ├── understanding/
│   ├── labor-productivity/
│   ├── policy-delay/
│   ├── extreme-events/
│   ├── operational-interruptions/
│   ├── client-resilience/
│   ├── operational-context/
│   └── employee-risks/
├── risks-by-location/                             # Module 2
│   ├── spain/
│   ├── india/
│   ├── brazil/
│   └── global/
├── scenario-analysis/                             # Module 3
│   ├── scenario-explorer/
│   └── storylines/
├── decision-making/                               # Module 4
│   ├── methodology/
│   ├── prioritization/
│   └── recommendations/
├── privacy/                                       # Legal pages
├── terms/
└── support/
```

---

## Development Workflow

### Git Commits Made Today
1. Initial climate-risk-management dashboard and structure
2. Created ClimateRiskManagementSidebar with unique collapsible behavior
3. Updated Header to conditionally hide points/store in risk subdomain
4. Renamed sections and updated module names
5. Created all 8 Analyze Risks subpages
6. Created all 4 Risks by Location subpages (Spain, India, Brazil, Global)
7. Updated box descriptions to list actual subpages
8. Renamed Prioritization → Decision Making with new subpages
9. Created Scenario Analysis subpages (Scenario Explorer, Storylines)
10. Swapped order of Scenario Analysis and Decision Making modules
11. Added conditional footer with subdomain-specific legal pages

### Testing Checklist
- ✅ All pages require authentication
- ✅ Sidebar expands/collapses smoothly
- ✅ Active page highlighting works
- ✅ Submenu auto-expansion on hover works
- ✅ Header shows correct links for each section
- ✅ Footer title and links adapt based on path
- ✅ All 17 subpages created and accessible
- ✅ Legal pages accessible within subdomain
- ✅ Callback URLs work after login

---

## Key Differences from Main Dashboard

| Feature | Main Dashboard | Climate Risk Management |
|---------|----------------|-------------------------|
| **URL** | /dashboard | /climate-risk-management |
| **Purpose** | CO₂ tracking & reduction | Risk analysis & planning |
| **Sidebar** | Sidebar.tsx | ClimateRiskManagementSidebar.tsx |
| **Points System** | ✅ Visible | ❌ Hidden |
| **Store** | ✅ Visible | ❌ Hidden |
| **Organizations** | ✅ Dropdown in header | ❌ Hidden |
| **Footer Title** | "Climate Management Platform" | "Climate Risk Management Platform" |
| **Footer Subtext** | Long description | No subtext |
| **Legal Pages** | /privacy, /terms, /support | /climate-risk-management/privacy, etc. |
| **Navigation Style** | Standard sidebar | Collapsible vertical sidebar |
| **Module Structure** | Flat pages | 4 modules with subpages |

---

## Future Development Notes

### Content Placeholder Strategy
All subpages currently show "Content coming soon..." in a white card. This is intentional - the structure is complete, ready for content to be added module by module.

### Recommended Next Steps
1. **Content Population**: Add specific content to each of the 17 subpages
2. **Data Integration**: Connect to climate data APIs or databases
3. **Interactive Tools**: Add calculators, scenario builders, risk matrices
4. **Reporting**: PDF export, email reports, data visualizations
5. **Collaboration**: Multi-user access, shared workspaces per organization
6. **AI Integration**: Risk prediction models, recommendation engines

### Extensibility
The modular structure makes it easy to:
- Add new modules to the dashboard grid
- Add new subpages to existing modules
- Create nested hierarchies (e.g., subpage → sub-subpage)
- Duplicate the pattern for additional subdomains

---

## Technical Stack

### Framework & Libraries
- **Next.js 14**: App router, server components
- **React 18**: Client-side interactivity
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **NextAuth.js**: Authentication
- **Prisma**: Database ORM
- **SQLite**: Development database

### Component Architecture
- **Shared Components**: Header, Footer (with conditional logic)
- **Module-Specific Components**: ClimateRiskManagementSidebar
- **Page Templates**: Consistent structure across all subpages
- **Authentication HOC**: Built into each page component

---

## Deployment Configuration

### Vercel Settings
```json
{
  "domains": [
    "carbon-reduction-planner.vercel.app",
    "risk-software.newdayclimate.com"
  ],
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

### Environment Variables
Same across both modules:
- `DATABASE_URL`: SQLite connection
- `NEXTAUTH_SECRET`: Session encryption
- `NEXTAUTH_URL`: Auth callback base URL

---

## Summary

**What We Built**: A complete Climate Risk Management software module with 17 subpages organized into 4 major modules, with its own unique navigation system, conditional header/footer, and subdomain-specific legal pages.

**How It Works**: Uses path-based routing (`/climate-risk-management/*`) to trigger conditional behavior in shared components (Header, Footer) while maintaining completely separate navigation (ClimateRiskManagementSidebar) and page structure.

**Integration**: Seamlessly integrated into existing codebase, sharing authentication, styling, and deployment infrastructure while maintaining distinct user experiences.

**Status**: Structure complete, ready for content population and feature development.

---

## Session Update: January 1, 2026 - Complete Subdomain Isolation

### Critical Fixes: 100% Subdomain Link Isolation

Today we completed comprehensive work to ensure **PERFECT ISOLATION** of the Climate Risk Management subdomain. Previously, several edge cases caused users to accidentally leave the subdomain. All issues are now resolved.

### Issues Fixed

#### 1. Header Logo & Title Link (Unauthenticated Users)
**Problem**: When unauthenticated users clicked the logo or "Climate Management Platform" text, it redirected to "/" instead of staying in subdomain.

**Solution**: Updated Header.tsx logo link logic:
```typescript
href={isClimateRiskManagement ? "/climate-risk-management" : (session ? "/climate-risk-management" : "/")}
```

#### 2. Registration Redirect Flow
**Problem**: After registering from `/register?callbackUrl=/climate-risk-management`, users were redirected to `/dashboard` instead of staying in subdomain.

**Solution**: 
- Modified `/app/register/page.tsx` to read `callbackUrl` from URL parameters
- Redirects user to correct subdomain after successful registration
- Defaults to `/dashboard` for Magnum Opus users

#### 3. Register Page Links
**Problem**: Privacy Policy, Terms of Service, and "Sign in" links on register page all took users outside subdomain.

**Solution**: Added subdomain detection and updated all links:
```typescript
const isClimateRiskManagement = callbackUrl.startsWith('/climate-risk-management')

// Privacy link
href={isClimateRiskManagement ? "/climate-risk-management/privacy" : "/privacy"}

// Terms link  
href={isClimateRiskManagement ? "/climate-risk-management/terms" : "/terms"}

// Sign in link
href={isClimateRiskManagement ? `/login?callbackUrl=${callbackUrl}` : "/login"}
```

#### 4. Login Page "Sign up" Link
**Problem**: Sign up link on login page didn't pass callbackUrl parameter, breaking subdomain context.

**Solution**: Updated to include callbackUrl:
```typescript
href={callbackUrl !== '/climate-risk-management' ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register?callbackUrl=/climate-risk-management"}
```

#### 5. Header & Footer on Login/Register Pages
**Problem**: When users visited `/login?callbackUrl=/climate-risk-management` or `/register?callbackUrl=/climate-risk-management`, the Header and Footer didn't recognize subdomain context (pathname was `/login` or `/register`), so links went outside subdomain.

**Solution**: Modified both Header.tsx and Footer.tsx to detect callbackUrl parameter:
```typescript
const [callbackUrl, setCallbackUrl] = useState<string | null>(null)
useEffect(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    setCallbackUrl(params.get('callbackUrl'))
  }
}, [pathname])

const isClimateRiskManagement = pathname.startsWith("/climate-risk-management") || 
  (callbackUrl?.startsWith("/climate-risk-management") ?? false)
```

#### 6. Sign Out Flow
**Problem**: When users signed out from subdomain, they were redirected to `/login` without callbackUrl, losing subdomain context.

**Solution**: Modified sign out handler to check subdomain and include callbackUrl:
```typescript
if (isClimateRiskManagement) {
  router.push("/login?callbackUrl=/climate-risk-management")
} else {
  router.push("/login")
}
```

#### 7. Suspense Boundary Error (Build Fix)
**Problem**: Build failed with error: `useSearchParams() should be wrapped in a suspense boundary at page "/register"`

**Solution**: Refactored register page:
- Created `RegisterForm` component that uses `useSearchParams()`
- Wrapped it in `Suspense` boundary in main `RegisterPage` component
- Added loading fallback

### UX Improvements

#### 8. Landing Page Header Simplification
**Change**: Hid Login and Get Started buttons from header on `/climate-risk-management` landing page only (for unauthenticated users).

**Reasoning**: These buttons are already prominently displayed as large buttons in the center of the page. Having them in both places was redundant and cluttered the header.

**Implementation**:
```typescript
const isClimateRiskLandingPage = pathname === "/climate-risk-management"

// In both desktop and mobile navigation:
{!isHomePage && !isClimateRiskLandingPage && (
  // Login and Get Started buttons
)}
```

#### 9. Landing Page Module Boxes Simplified
**Change**: Removed all bullet point descriptions from module preview boxes on landing page.

**Before**: Boxes showed titles + long lists of subpages (e.g., "• Understanding climate risk • Labor productivity loss...")

**After**: Boxes show clean titles only: "Analyze Risks", "Risks by Location", "Scenario Analysis", "Decision Making"

**Reasoning**: Cleaner, more professional look. Details are available once users log in and access the authenticated dashboard.

### Complete User Journey - All Tested & Working

**Unauthenticated User Starting at Landing Page:**
1. Visits `https://risk-software.newdayclimate.com/climate-risk-management` ✅
2. Clicks logo → Stays on landing page ✅
3. Clicks "Get Started" → `/register?callbackUrl=/climate-risk-management` ✅
4. On register page, all links stay in subdomain:
   - Privacy Policy → `/climate-risk-management/privacy` ✅
   - Terms → `/climate-risk-management/terms` ✅
   - "Sign in" → `/login?callbackUrl=/climate-risk-management` ✅
5. Registers → Auto-login → Redirects to `/climate-risk-management` ✅

**Authenticated User:**
1. Using subdomain features ✅
2. Signs out → `/login?callbackUrl=/climate-risk-management` ✅
3. On login page, all header/footer links stay in subdomain ✅
4. Signs back in → Returns to `/climate-risk-management` ✅

### Files Modified in This Session

1. **components/Header.tsx**
   - Added callbackUrl detection for subdomain context
   - Fixed logo link for unauthenticated users
   - Fixed sign out to include callbackUrl
   - Hidden header buttons on landing page only

2. **components/Footer.tsx**
   - Added callbackUrl detection for subdomain context

3. **app/register/page.tsx**
   - Wrapped useSearchParams in Suspense boundary
   - Added subdomain detection based on callbackUrl
   - Updated all links (privacy, terms, sign in) to respect subdomain
   - Fixed redirect after registration to use callbackUrl

4. **app/login/page.tsx**
   - Added callbackUrl detection
   - Updated "Sign up" link to include callbackUrl parameter

5. **app/climate-risk-management/page.tsx**
   - Removed description text from landing page module boxes for cleaner design

### Git Commits (January 1, 2026)

1. `2eb67ca` - Fix: Header logo link and register redirect for subdomain isolation
2. `c218576` - Fix: Wrap useSearchParams in Suspense boundary to resolve build error
3. `a52dc11` - Fix: All register page links now respect climate risk subdomain context
4. `32baf17` - Fix: Login page Sign up link now includes callbackUrl parameter
5. `4b98fbd` - Fix: Header and Footer now detect callbackUrl to stay in subdomain context
6. `105ff8d` - Fix: Sign Out now includes callbackUrl to keep users in subdomain
7. `84e7258` - Hide Login/Get Started header buttons on climate risk landing page
8. `26c96a5` - Remove description text from landing page module boxes for cleaner design

### Testing Status

**All User Flows Verified:**
- ✅ Landing page → Registration → Login → Dashboard
- ✅ Landing page → Login → Dashboard → Sign out → Login
- ✅ All header links on login/register pages
- ✅ All footer links on login/register pages
- ✅ Privacy/Terms/Support pages accessible within subdomain
- ✅ Build deploys successfully to Vercel
- ✅ No broken links anywhere in subdomain

### Production Status

**The Climate Risk Management subdomain is now:**
- ✅ 100% isolated - zero links escape the subdomain
- ✅ Production-ready for client delivery
- ✅ Clean UX with no duplicate buttons or clutter
- ✅ All authentication flows working perfectly
- ✅ Successfully deployed to `https://risk-software.newdayclimate.com/climate-risk-management`

---

*Documentation created: December 31, 2025*
*Last updated: January 1, 2026*
