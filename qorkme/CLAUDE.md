# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QorkMe is a fully-implemented, production-ready URL shortener with a Bauhaus-inspired industrial design. Built with enterprise-grade architecture, optimized to handle 200,000+ URLs with memorable, typable short codes and comprehensive analytics.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 with custom Bauhaus design system
- **Deployment**: Vercel with comprehensive GitHub Actions CI/CD pipeline
- **Domain**: qork.me

## Key Features Implemented

1. **Smart URL Shortening**: Consonant-vowel pattern algorithm for memorable codes (e.g., "ka9m", "pu3n")
2. **Custom Aliases**: Case-insensitive custom short codes with collision prevention
3. **Analytics**: Click tracking with device, browser, OS, and geographic data
4. **QR Code Generation**: On-demand QR codes for any shortened URL
5. **Bauhaus Design**: Industrial functional aesthetic with geometric elements

## Project Structure

```
qorkme/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   └── shorten/       # URL shortening endpoint
│   ├── [shortCode]/       # Redirect handler
│   └── result/[id]/       # Success page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── bauhaus/          # Bauhaus-specific components
├── lib/                   # Utilities and helpers
│   ├── shortcode/        # Code generation logic
│   └── supabase/         # Database clients
├── docs/                  # Documentation
├── supabase/             # Database schema
└── .github/workflows/    # CI/CD pipelines
```

## Development Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
npm run format     # Format code with Prettier
```

## Database Schema

The application uses Supabase with:

- `urls` table: Stores shortened URLs with metadata
- `clicks` table: Analytics data
- `reserved_words` table: Protected short codes
- Optimized indexes for 200,000+ URL performance
- Row Level Security (RLS) policies

Run `/supabase/schema.sql` in Supabase SQL Editor to set up the database.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_SITE_URL=https://qork.me
NEXT_PUBLIC_SHORT_DOMAIN=qork.me
```

## CI/CD Pipeline

GitHub Actions workflows with latest action versions:

- **ci.yml**: Multi-node testing (18.x, 20.x), lint, type-check, build, security scanning with Trufflehog, preview deployments with PR comments
- **deploy.yml**: Production deployment on main branch pushes or manual dispatch, uses Vercel CLI latest

Required GitHub Secrets (add in repository Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` - From Vercel account tokens
- `VERCEL_ORG_ID` - From .vercel/project.json after first deployment
- `VERCEL_PROJECT_ID` - From .vercel/project.json after first deployment

## Deployment

The application deploys automatically to Vercel when pushing to main branch via GitHub Actions. Manual deployment also available via workflow dispatch. See `/docs/VERCEL_SETUP.md` for comprehensive deployment setup and `/docs/DEPLOYMENT.md` for general deployment instructions.

## Architecture Decisions

1. **Next.js 15.5.3 App Router**: Modern React 19 patterns with server components
2. **Supabase**: Managed PostgreSQL with real-time capabilities and comprehensive RLS policies
3. **Vercel Edge Functions**: Fast redirects with minimal latency
4. **Smart Short Code Generation**: Consonant-vowel patterns for memorability
5. **Case-Insensitive Storage**: Generated columns prevent collisions like "MyLink" vs "mylink"
6. **Comprehensive CI/CD**: Automated testing, security scanning, and deployment

## Performance Optimizations

- Database indexes optimized for 200,000+ URLs with generated columns for case-insensitive lookups
- Vercel Edge deployment for fast global redirects
- Optimized bundle splitting with Next.js 15
- Lazy loading for analytics components
- Security headers configured in vercel.json
- Function timeouts optimized for URL operations

## Security Measures

- Input validation and sanitization
- SQL injection prevention via parameterized queries and Supabase RLS
- XSS protection headers configured in vercel.json
- Security scanning with Trufflehog in CI pipeline
- Hashed IP addresses for privacy in analytics
- Dependency auditing with npm audit in CI

## Testing Strategy

- Type checking with TypeScript 5 strict mode
- Linting with ESLint and Next.js recommended rules
- Format checking with Prettier (100-character line width)
- Multi-node build verification in CI (Node.js 18.x and 20.x)
- Security scanning with npm audit and Trufflehog
- Preview deployments for all pull requests

## Design System

Bauhaus-inspired industrial design with:

- Primary colors: Crimson (#DC143C), Cobalt Blue (#0048BA), Gold (#FFD700)
- Geometric shapes and animated background elements
- Industrial typography (Bebas Neue for display, Inter for body)
- 8px grid system with responsive breakpoints
- Custom Tailwind CSS v4 configuration
- Complete design specifications in `/docs/DESIGN_SYSTEM.md`

## Common Tasks

### Add a new reserved word

Add to `/lib/shortcode/reserved.ts` and update database

### Modify short code algorithm

Edit `/lib/shortcode/generator.ts`

### Update Bauhaus styling

Modify `/app/globals.css` and component files

### Change redirect behavior

Update `/app/[shortCode]/route.ts`

## Support Resources

- **Documentation**: See `/docs` folder
- **Deployment Guide**: `/docs/VERCEL_SETUP.md`
- **Design System**: `/docs/DESIGN_SYSTEM.md`
- **Database Setup**: `/supabase/SETUP_INSTRUCTIONS.md`
