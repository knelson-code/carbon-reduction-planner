# Climate Risk Management Module - Complete Documentation

## Overview
On December 31, 2025, we created a new, distinct software module within the existing carbon-reduction-planner codebase focused exclusively on Climate Risk Management. This module operates as a separate subdomain with its own navigation, structure, and user experience, while sharing the same codebase and authentication system as the main CO₂ Reduction Planner.

---

## Two Distinct Sections in One Codebase

### 1. Main Dashboard (Original CO₂ Reduction Planner)
- **URL**: `https://carbon-reduction-planner.vercel.app/dashboard`
- **Purpose**: CO₂ emission tracking, reduction planning, gamification with points/store
- **Features**: Organizations, Activities, Points system, Store for rewards
- **Sidebar**: Uses standard `Sidebar.tsx` component
- **Base Path**: `/app/dashboard/*`

### 2. Climate Risk Management (New Module - Built Today)
- **URL**: `https://risk-software.newdayclimate.com/climate-risk-management`
- **Subdomain**: `risk-software.newdayclimate.com` (configured in Vercel)
- **Purpose**: Climate risk analysis, location-based risk assessment, scenario planning, decision support
- **Features**: 4 major modules with 17 total subpages
- **Sidebar**: Uses dedicated `ClimateRiskManagementSidebar.tsx` component
- **Base Path**: `/app/climate-risk-management/*`

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

*Documentation created: December 31, 2025*
*Last updated: December 31, 2025*
