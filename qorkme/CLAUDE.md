# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QorkMe is a fully-implemented, production-ready URL shortener with a modern card-based design system. Built with enterprise-grade architecture, optimized to handle 200,000+ URLs with memorable, typable short codes and comprehensive analytics.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 with modern card-based design system
- **Deployment**: Vercel with comprehensive GitHub Actions CI/CD pipeline
- **Domain**: qork.me

## Key Features Implemented

1. **Smart URL Shortening**: Consonant-vowel pattern algorithm for memorable codes (e.g., "ka9m", "pu3n")
2. **Custom Aliases**: Case-insensitive custom short codes with collision prevention
3. **Analytics**: Click tracking with device, browser, OS, and geographic data
4. **QR Code Generation**: On-demand QR codes for any shortened URL
5. **Sophisticated Design**: Refined card-based aesthetic with warm sandstone and earth tones

## Complete Project Structure

```
qorkme/
├── app/                          # Next.js App Router
│   ├── [shortCode]/
│   │   └── route.ts             # Dynamic redirect handler
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts         # URL shortening API endpoint
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx         # Success/result page
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global styles & design tokens
│   ├── layout.tsx               # Root layout component
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── bauhaus/
│   │   └── GeometricDecor.tsx   # Decorative elements
│   ├── cards/
│   │   ├── Card.tsx             # Base card component
│   │   └── FeatureCard.tsx      # Feature showcase card
│   ├── ui/
│   │   ├── Button.tsx           # Button component
│   │   └── Input.tsx            # Input component
│   ├── ClientThemeToggle.tsx    # Client-side theme toggle
│   ├── NavigationHeader.tsx     # Main navigation
│   ├── ResultNavigationHeader.tsx # Result page nav
│   ├── ShortUrlDisplay.tsx      # URL display component
│   ├── ThemeToggle.tsx          # Theme toggle component
│   └── UrlShortener.tsx         # Main shortener form
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── DESIGN_SYSTEM.md         # Design system specs
│   └── VERCEL_SETUP.md          # Vercel setup guide
├── lib/                          # Utilities and helpers
│   ├── shortcode/
│   │   ├── generator.ts         # Short code generation
│   │   ├── reserved.ts          # Reserved words list
│   │   └── validator.ts         # Validation logic
│   ├── supabase/
│   │   ├── client.ts            # Client-side Supabase
│   │   ├── server.ts            # Server-side Supabase
│   │   └── types.ts             # TypeScript types
│   ├── theme.tsx                # Theme context provider
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
│   ├── fonts/                   # ZT Bros Oskon fonts
│   │   ├── ZTBrosOskon90s-Regular.woff2
│   │   ├── ZTBrosOskon90s-Italic.woff2
│   │   ├── ZTBrosOskon90s-Medium.woff2
│   │   ├── ZTBrosOskon90s-MediumItalic.woff2
│   │   ├── ZTBrosOskon90s-SemiBold.woff2
│   │   ├── ZTBrosOskon90s-SemiBoldItalic.woff2
│   │   ├── ZTBrosOskon90s-Bold.woff2
│   │   ├── ZTBrosOskon90s-BoldItalic.woff2
│   │   └── README.md
│   └── *.svg                    # SVG icons
├── supabase/                     # Database
│   ├── schema.sql               # Database schema
│   └── SETUP_INSTRUCTIONS.md    # Setup guide
├── .github/                      # GitHub config
│   └── workflows/               # CI/CD pipelines
│       ├── ci.yml               # Continuous integration
│       └── deploy.yml           # Production deployment
├── CHANGELOG.md                  # Version history
├── CLAUDE.md                     # AI assistant guide (this file)
├── README.md                     # Project documentation
├── eslint.config.mjs            # ESLint configuration
├── next-env.d.ts                # Next.js TypeScript env
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── package-lock.json            # Dependency lock file
├── postcss.config.mjs           # PostCSS config
├── tsconfig.json                # TypeScript config
└── tsconfig.tsbuildinfo         # TypeScript build info
```

> Deployment configuration lives in the repository root [`../vercel.json`](../vercel.json), which runs installs and builds from this `qorkme` subdirectory during Vercel deployments.

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
- Security headers configured in root-level [`vercel.json`](../vercel.json)
- Function timeouts optimized for URL operations

## Security Measures

- Input validation and sanitization
- SQL injection prevention via parameterized queries and Supabase RLS
- XSS protection headers configured in root-level [`vercel.json`](../vercel.json)
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

Sophisticated card-based design with sandstone and earth tones:

- Primary colors: Desert Sand Brown (#8b7355), Rich Earth Brown (#3e2723), Warm Sandstone (#f5e6d3), Medium Earth Brown (#5d4037)
- Enhanced card components with stronger borders, refined shadows, and sophisticated hover effects
- ZT Bros Oskon typography system with bold serif fonts, uppercase styling, and serif fallbacks
- Light/dark theme support with deep earth tone transitions
- 8px grid system with responsive breakpoints and enhanced spacing
- Complete design specifications in `/docs/DESIGN_SYSTEM.md`

## Common Tasks

### Add a new reserved word

Add to `/lib/shortcode/reserved.ts` and update database

### Modify short code algorithm

Edit `/lib/shortcode/generator.ts`

### Update design system styling

Modify `/app/globals.css` and component files, update sandstone theme variables

### Change redirect behavior

Update `/app/[shortCode]/route.ts`

## Support Resources

- **Documentation**: See `/docs` folder
- **Deployment Guide**: `/docs/VERCEL_SETUP.md`
- **Design System**: `/docs/DESIGN_SYSTEM.md`
- **Database Setup**: `/supabase/SETUP_INSTRUCTIONS.md`
