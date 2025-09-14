# Complete Vercel & Supabase Setup Guide for QorkMe

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Vercel Account Setup](#vercel-account-setup)
4. [Project Deployment](#project-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Custom Domain Setup](#custom-domain-setup)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with your QorkMe repository
- [ ] Node.js 18+ installed locally
- [ ] Git installed and configured
- [ ] Access to domain registrar for qork.me
- [ ] Credit card (optional - for paid features)

---

## Supabase Setup

### Step 1: Create Supabase Account

1. Navigate to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create New Project

1. Click **"New Project"** on dashboard
2. Fill in project details:
   ```
   Organization: Your-Organization-Name
   Project Name: qorkme
   Database Password: [Generate strong password]
   Region: Select closest to your users (e.g., US West for California)
   Pricing Plan: Free (supports up to 500MB database, 2GB bandwidth)
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for provisioning

### Step 3: Configure Database Schema

1. Once project is ready, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Copy and paste the entire contents from `/supabase/schema.sql`
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: `Success. No rows returned`

### Step 4: Retrieve API Keys

1. Navigate to **Settings** (gear icon) → **API**
2. Copy and save these values:

```env
# Project URL (under "Project URL")
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Anon/Public Key (under "Project API keys" - anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (under "Project API keys" - service_role) - KEEP SECRET!
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Configure Security Settings

1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:

   ```
   https://qork.me/auth/callback
   http://localhost:3000/auth/callback
   ```

3. Go to **Authentication** → **Providers**
4. Configure email settings:
   - Enable **Email** provider
   - Set **Auto Confirm** to ON (for testing)
   - Customize email templates if desired

5. Go to **Storage** → **Policies** (if using file storage)
6. Ensure RLS is enabled (green shield icon)

---

## Vercel Account Setup

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account
5. Select repositories Vercel can access (can be configured later)

### Step 2: Install Vercel CLI

```bash
# Install globally
npm install -g vercel@latest

# Verify installation
vercel --version
```

### Step 3: Authenticate CLI

```bash
# Login to Vercel
vercel login

# Enter your email
# Click verification link in email
```

---

## Project Deployment

### Step 1: Prepare Your Repository

```bash
# Navigate to project
cd /Volumes/X9\ Pro/code/QorkMe/qorkme

# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Link Project to Vercel

```bash
# In your project directory
vercel

# Follow prompts:
# ? Set up and deploy "~/code/QorkMe/qorkme"? [Y/n] Y
# ? Which scope do you want to deploy to? Your-Username
# ? Link to existing project? [y/N] N
# ? What's your project's name? qorkme
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] N
```

This creates a `.vercel` folder with:

```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

### Step 3: Configure Environment Variables

#### Method 1: Via Vercel CLI

```bash
# Add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_SHORT_DOMAIN

# Select environment: Production, Preview, Development
# Paste value when prompted
```

#### Method 2: Via Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **qorkme** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://qork.me
NEXT_PUBLIC_SHORT_DOMAIN=qork.me

# Feature Flags
ENABLE_CUSTOM_ALIASES=true
ENABLE_ANALYTICS=true
MAX_URL_LENGTH=2048
MIN_ALIAS_LENGTH=3
MAX_ALIAS_LENGTH=50
```

5. Select environments for each variable:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Step 4: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Enter `qork.me` and click **Add**
4. Choose configuration:
   - ✅ Redirect www.qork.me to qork.me

### Step 2: Configure DNS Records

#### For Root Domain (qork.me)

**Option A: Vercel Nameservers (Recommended)**
Change nameservers at your registrar to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: A Records**
Add these A records at your DNS provider:

```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
```

#### For Subdomain (www.qork.me)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain

1. Wait 5-48 hours for DNS propagation
2. Check status in Vercel Dashboard
3. SSL certificate auto-provisions once verified
4. Test both:
   - https://qork.me
   - https://www.qork.me

---

## CI/CD Pipeline

### Step 1: Generate Vercel Token

1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create"**
3. Enter token name: `github-actions`
4. Set expiration: `No Expiration` (or custom)
5. Click **"Create Token"**
6. Copy token (shown only once!)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

```bash
VERCEL_TOKEN=xxx_xxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxx  # From .vercel/project.json
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx  # From .vercel/project.json
```

### Step 3: Verify GitHub Actions Workflows

The project includes two pre-configured workflows:

1. **CI Testing** (`.github/workflows/ci.yml`): Handles testing, linting, and preview deployments
2. **Production Deployment** (`.github/workflows/deploy.yml`): Manages production deployments

The production deployment workflow (`.github/workflows/deploy.yml`) is already configured with:

- **Automatic deployment** on main branch pushes
- **Manual deployment** via workflow_dispatch
- **Environment integration** with Vercel CLI
- **Commit comments** with deployment status

### Step 4: CI Testing Workflow

The CI testing workflow (`.github/workflows/ci.yml`) is already configured with:

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality Checks**: ESLint linting and TypeScript validation
- **Prettier Formatting**: Automatic code formatting validation
- **Security Scanning**: Dependency audits and secret detection
- **Preview Deployments**: Automatic preview URLs for pull requests
- **Bundle Size Analysis**: Build size reporting and optimization checks

---

## Monitoring & Maintenance

### Vercel Analytics Setup

1. Go to project **Analytics** tab
2. Enable **Web Analytics** (free tier available)
3. Enable **Speed Insights**
4. Add to your layout.tsx:

```tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Monitoring Checklist

#### Daily

- [ ] Check Vercel dashboard for errors
- [ ] Monitor deployment status
- [ ] Review error logs

#### Weekly

- [ ] Check Supabase usage (database size, API calls)
- [ ] Review analytics data
- [ ] Check SSL certificate status

#### Monthly

- [ ] Update dependencies
- [ ] Review and optimize slow queries
- [ ] Check domain renewal status

### Setting Up Alerts

1. **Vercel Notifications**:
   - Go to **Settings** → **Notifications**
   - Enable deployment notifications
   - Set up Slack/Discord webhooks

2. **Supabase Alerts**:
   - Go to **Settings** → **Alerts**
   - Configure usage threshold alerts

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures

**Error**: `Module not found`

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Error**: `Environment variables missing`

- Verify all variables in Vercel dashboard
- Check variable names match exactly
- Ensure no trailing spaces

#### 2. Database Connection Issues

**Error**: `Invalid API key`

- Regenerate Supabase keys
- Update in Vercel environment variables
- Redeploy application

**Error**: `Connection timeout`

- Check Supabase project status
- Verify project isn't paused (free tier)
- Check firewall/network settings

#### 3. Domain Issues

**Not resolving**:

```bash
# Check DNS propagation
nslookup qork.me
dig qork.me

# Verify records
dig qork.me A
dig www.qork.me CNAME
```

**SSL errors**:

- Wait for auto-provisioning (up to 24h)
- Check domain verification in Vercel
- Force SSL renewal in dashboard

#### 4. Performance Issues

**Slow builds**:

- Enable build cache in Vercel
- Optimize dependencies
- Use `next/dynamic` for large components

**Slow page loads**:

- Enable Vercel Edge Network
- Implement ISR (Incremental Static Regeneration)
- Optimize images with `next/image`

### Debug Commands

```bash
# Check deployment logs
vercel logs

# List recent deployments
vercel ls

# Check environment variables
vercel env ls

# Rollback deployment
vercel rollback

# Access project settings
vercel project
```

### Support Resources

- **Vercel Support**: https://vercel.com/support
- **Vercel Status**: https://www.vercel-status.com/
- **Supabase Support**: https://supabase.com/support
- **Community Discord**: https://discord.gg/vercel

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Custom domain verified and SSL active
- [ ] Database migrations completed
- [ ] Rate limiting configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics enabled
- [ ] Backup strategy defined
- [ ] CI/CD pipelines tested
- [ ] Security headers configured
- [ ] Performance optimizations applied
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Budget alerts set (if applicable)

---

## Cost Optimization

### Free Tier Limits

- **Vercel**: 100GB bandwidth, unlimited sites
- **Supabase**: 500MB database, 2GB bandwidth, 50,000 requests

### When to Upgrade

- Approaching 80% of any limit
- Need team collaboration features
- Require SLA guarantees
- Need advanced analytics

### Cost Saving Tips

1. Use Vercel Edge Config for frequently accessed data
2. Implement proper caching headers
3. Optimize images and assets
4. Use ISR instead of SSR where possible
5. Monitor and optimize database queries

---

This guide ensures your QorkMe URL shortener is properly deployed, monitored, and maintained on Vercel with Supabase integration.
