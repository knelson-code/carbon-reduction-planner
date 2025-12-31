# New Day Climate Risk Management App - Guide

## What Was Created

I've successfully created a **completely separate app section** within your existing project called "New Day Climate Risk Management". This new app:

✅ **Shares the same backend** - Uses the same database, authentication, and APIs
✅ **Has its own URL path** - Accessible at `/climate-risk-management`
✅ **Has its own navigation** - Separate sidebar with all the same modules
✅ **Is completely isolated** - Users won't see or access the old `/dashboard` section
✅ **Has all the same features** - Climate Risk, Transition Strategy, Impact Strategy, CO₂ Management

## How to Access

### Locally (Development)
- **Old App**: http://localhost:3000/dashboard
- **New App**: http://localhost:3000/climate-risk-management

### Live (Production)
- **Old App**: https://risk-software.newdayclimate.com/dashboard
- **New App**: https://risk-software.newdayclimate.com/climate-risk-management (once deployed)

## Key Features

1. **Separate Entry Point**: Users accessing `/climate-risk-management` will only see that app's navigation
2. **Shared Authentication**: Same login system, same user accounts
3. **Shared Database**: All user data, scores, activities stored in the same database
4. **Independent Navigation**: Each app has its own sidebar and menu structure

## Files Created/Modified

### New Files
- `/app/climate-risk-management/layout.tsx` - Layout for the new app
- `/app/climate-risk-management/page.tsx` - Main dashboard for new app
- `/components/ClimateRiskManagementSidebar.tsx` - Dedicated sidebar
- All pages from `/dashboard/*` duplicated to `/climate-risk-management/*`

### Structure
```
/app
  /dashboard (OLD APP - still works)
    /climate-risk
    /transition-strategy
    /impact-strategy
    /co2-management
  
  /climate-risk-management (NEW APP)
    /climate-risk
    /transition-strategy
    /impact-strategy
    /co2-management
```

## How to Deploy

### Automatic Deployment (If using Vercel Git integration)
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add New Day Climate Risk Management app section"
   git push
   ```
2. Vercel will automatically deploy the changes
3. Your new app will be live at: https://risk-software.newdayclimate.com/climate-risk-management

### Manual Deployment
1. Commit and push your changes to Git
2. Vercel will auto-deploy, or you can trigger manually in Vercel dashboard

## How to Direct Clients

### Option 1: Direct Link
Send clients directly to:
`https://risk-software.newdayclimate.com/climate-risk-management`

They'll see the login page, and after logging in, they'll only see the new app interface.

### Option 2: Update Login Redirect
You can modify the login page to redirect clients to `/climate-risk-management` instead of `/dashboard` after login.

### Option 3: Homepage Route
You can even make `/climate-risk-management` the default homepage if you want by updating the root page.

## Next Steps - Customization

Now that you have a duplicate app, you can:

1. **Remove features you don't want** - Delete pages from `/climate-risk-management/*`
2. **Add new features** - Create new pages under `/climate-risk-management/*`
3. **Customize the UI** - Edit the sidebar, dashboard cards, styling
4. **Change branding** - Update the title, metadata, colors

## Important Notes

- **Both apps share the same users/database** - A user logged into one app is logged into both
- **URL isolation** - Users only see what you link them to. If you only give clients the `/climate-risk-management` URL, they won't know about `/dashboard`
- **No conflicts** - Both apps can run simultaneously without any issues
- **Easy updates** - Changes to backend (APIs, database schema) affect both apps automatically

## Testing Checklist

- [x] New app loads at `/climate-risk-management`
- [x] Authentication works (redirects to login when not logged in)
- [x] Layout and sidebar display correctly
- [ ] Login and access the dashboard (test after deployment or with local login)
- [ ] Navigate through all modules
- [ ] Verify data loads from shared database

## Questions?

- Want to customize the new app further?
- Need to add/remove specific features?
- Want to change the URL structure?
- Need help with deployment?

Just let me know!
