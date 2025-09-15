# QorkMe Deployment Guide

## Overview

QorkMe is a Next.js application with complete CI/CD automation via GitHub Actions. It requires server-side rendering capabilities due to its dynamic routing and API endpoints. **GitHub Pages is NOT suitable** for this application as it only supports static sites.

**Recommended Platform: Vercel** (created by Next.js team, optimized for Next.js apps)
**Alternative Options: Netlify, Railway, or Render**

**Note**: For comprehensive Vercel setup with detailed CI/CD configuration, see [VERCEL_SETUP.md](VERCEL_SETUP.md).

---

## Prerequisites

Before deployment, ensure you have:

1. A Supabase account and project set up
2. Your custom domain (qork.me) ready for configuration
3. Git repository with your code
4. Environment variables ready
5. GitHub Actions secrets configured (for automated deployments)

## CI/CD Pipeline

The project includes automated workflows for:

- **Testing & Quality Checks**: Runs on all pushes and pull requests (Node.js 18.x and 20.x)
- **Preview Deployments**: Automatic preview URLs for pull requests with GitHub comments
- **Production Deployment**: Automatic deployment to Vercel on main branch or manual dispatch
- **Security Scanning**: Dependency audits with npm audit and Trufflehog secret detection
- **GitHub Actions**: Uses latest actions/checkout@v4 and actions/setup-node@v4

### Required GitHub Secrets

For the CI/CD pipeline to work, add these secrets to your GitHub repository Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN=xxx_xxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxx  # From .vercel/project.json
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx  # From .vercel/project.json
```

---

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login and click "New Project"
3. Fill in:
   - **Project name**: `qorkme`
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for 200,000 URLs

### Step 2: Configure Database

1. Once project is created, go to **SQL Editor** in the sidebar
2. Click **New Query**
3. Copy and paste the entire contents of `/supabase/schema.sql`
4. Click **Run** to execute the schema creation
5. You should see "Success. No rows returned"

### Step 3: Get API Keys

1. Go to **Settings** → **API** in the sidebar
2. Copy these values:
   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **anon public** key: (safe for browser)
   - **service_role** key: (keep secret, server-only)

### Step 4: Configure Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Enable desired providers:
   - **Email**: Already enabled by default
   - **Google**: Add OAuth credentials
   - **GitHub**: Add OAuth app details

### Step 5: Set Up Row Level Security

1. Go to **Authentication** → **Policies**
2. Policies are already configured in our schema
3. Verify RLS is enabled on all tables (green shield icon)

---

## Part 2: Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

1. Commit all changes to your Git repository:

```bash
git add .
git commit -m "Initial QorkMe implementation"
git push origin main
```

### Step 2: Sign Up for Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click **"Add New Project"**
2. Select your `QorkMe` repository
3. Vercel will auto-detect Next.js

### Step 4: Configure Environment Variables

Add these environment variables in Vercel:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://qork.me
NEXT_PUBLIC_SHORT_DOMAIN=qork.me

# Feature Flags (Optional)
ENABLE_CUSTOM_ALIASES=true
ENABLE_ANALYTICS=true
MAX_URL_LENGTH=2048
MIN_ALIAS_LENGTH=3
MAX_ALIAS_LENGTH=50
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll get a `.vercel.app` URL for testing

### Step 6: Configure Custom Domain

1. Go to **Settings** → **Domains**
2. Add `qork.me`
3. Add DNS records to your domain provider:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. Wait for DNS propagation (5-30 minutes)
5. Vercel automatically provisions SSL certificate

---

## Part 3: Alternative - Netlify Deployment

### Step 1: Prepare for Netlify

1. Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "set_in_netlify_ui"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "set_in_netlify_ui"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

2. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

### Step 2: Deploy to Netlify

1. Run in project directory:

```bash
netlify init
netlify deploy --prod
```

2. Or use Netlify UI:
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Drag and drop your project folder
   - Configure environment variables in Settings

### Step 3: Configure Domain on Netlify

1. Go to **Domain Settings**
2. Add custom domain `qork.me`
3. Update DNS records as provided by Netlify

---

## Part 4: Post-Deployment Setup

### 1. Test Core Functionality

- [ ] Create a short URL
- [ ] Test custom alias
- [ ] Verify redirect works
- [ ] Check analytics tracking
- [ ] Test QR code generation

### 2. Monitor Performance

1. Set up Vercel Analytics (free tier available)
2. Monitor Supabase dashboard for:
   - Database size
   - API requests
   - Bandwidth usage

### 3. Set Up Backups

1. In Supabase: **Settings** → **Backups**
2. Enable Point-in-Time Recovery (paid feature)
3. Or set up manual backup script:

```sql
-- Run weekly in SQL Editor
SELECT * FROM urls
INTO OUTFILE '/backup/urls_backup.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

### 4. Configure Rate Limiting

Add to your Vercel configuration:

```json
{
  "functions": {
    "app/api/shorten/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-RateLimit-Limit",
          "value": "100"
        }
      ]
    }
  ]
}
```

---

## Part 5: Production Optimization

### Database Indexes (Already in Schema)

Verify these indexes exist:

- `idx_short_code_lower` - Fast lookups
- `idx_created_at` - Sorting by date
- `idx_click_count` - Popular links
- `idx_clicks_url_id` - Analytics queries

### Caching Strategy

1. Enable Vercel Edge Cache
2. Set cache headers in API routes:

```typescript
export const revalidate = 60; // Cache for 60 seconds
```

### Security Checklist

- [ ] Environment variables set correctly
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)

---

## Troubleshooting

### Common Issues

**1. "Supabase connection failed"**

- Check environment variables
- Verify Supabase project is active
- Check API keys are correct

**2. "Short URLs not redirecting"**

- Verify database has correct data
- Check redirect handler route
- Look at Vercel function logs

**3. "Custom domain not working"**

- Wait for DNS propagation (up to 48h)
- Verify DNS records
- Check SSL certificate status

**4. Build Failures**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Monitoring Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Check environment variables
vercel env ls
```

---

## Maintenance

### Weekly Tasks

- Check Supabase usage metrics
- Review error logs
- Backup database

### Monthly Tasks

- Update dependencies: `npm update`
- Review analytics for patterns
- Clean up expired URLs (if implemented)

### Scaling Considerations

When approaching limits:

**Database (at ~150,000 URLs)**:

- Archive old URLs to separate table
- Implement pagination for queries
- Consider upgrading Supabase plan

**Traffic (High Volume)**:

- Enable Vercel Edge Functions
- Implement Redis caching
- Use CDN for static assets

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Netlify Docs**: https://docs.netlify.com

---

## Quick Start Deployment Checklist

### Initial Setup

1. [ ] Supabase project created
2. [ ] Database schema executed
3. [ ] API keys obtained
4. [ ] Code pushed to GitHub

### Vercel Configuration

5. [ ] Vercel account created
6. [ ] Project imported to Vercel
7. [ ] Environment variables configured
8. [ ] Custom domain configured

### CI/CD Setup

9. [ ] GitHub secrets added (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
10. [ ] CI workflow tested (push to branch)
11. [ ] Preview deployment verified (create PR)
12. [ ] Production deployment successful (push to main)

### Final Verification

13. [ ] Basic functionality tested
14. [ ] Security headers verified
15. [ ] Performance checks completed

---

**Note**: For production use, ensure you have proper error tracking (Sentry), analytics (Vercel Analytics), and uptime monitoring configured. The project includes comprehensive CI/CD automation and security scanning for enterprise deployment.
