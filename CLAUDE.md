# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QorkMe is a production-ready URL shortener built with Next.js 15, TypeScript, and Supabase. The interface follows an earthy-modern aesthetic that pairs warm parchment neutrals, terracotta accents, and sage highlights with intelligent short code generation and comprehensive analytics tracking. Licensed under Apache License 2.0.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router and React 19
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Styling**: Tailwind CSS v4 with an earthy modern token palette defined in `qorkme/docs/DESIGN_SYSTEM.md`
- **Typography**: ZT Bros Oskon 90s for display and Inter Regular (400) for body/UI text, with Inter Black (900) for buttons and rare title fallbacks
- **Deployment**: Vercel with automated GitHub Actions CI/CD
- **Testing**: Vitest with Testing Library

## Repository Structure

The project uses a monorepo structure with the main application in the `qorkme/` subdirectory:

```
QorkMe/
|-- qorkme/                    # Main Next.js application
|   |-- app/                   # Next.js 15 App Router
|   |-- components/            # React components
|   |-- lib/                   # Utilities and database clients
|   |-- tests/                 # Vitest test suites
|   |-- docs/                  # Documentation
|   |-- supabase/              # Database schema and setup
|   \-- public/fonts/          # ZT Bros Oskon font files (woff2)
|-- ZT Bros Oskon 90s/         # Source font files (OTF/TTF/WEB)
|-- vercel.json                # Root deployment config (points to qorkme/)
|-- .github/workflows/         # CI/CD automation
|-- AGENTS.md                  # Agent-specific guidelines
|-- CODEX_PROJECT.md           # Detailed project brief
\-- CLAUDE.md                  # This file
```

**Important**: All development commands must be run from the `qorkme/` directory, not the repository root.

## Development Commands

All commands run from `qorkme/` directory:

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint checks
npm run type-check   # TypeScript validation (tsc --noEmit)
npm test             # Run Vitest test suite
npm run test:watch   # Watch mode for tests
npm run format       # Format code with Prettier
npm run format:check # Verify formatting (used in CI)
```

## Architecture Overview

### Application Structure

- **`app/`**: Next.js 15 App Router with file-based routing
  - `app/page.tsx`: Homepage with URL shortener form
  - `app/[shortCode]/route.ts`: Dynamic redirect handler for short URLs
  - `app/api/shorten/route.ts`: URL shortening API endpoint (POST/GET)
  - `app/result/[id]/page.tsx`: Success page after URL creation
  - `app/admin/page.tsx`: Admin dashboard (GitHub OAuth gated)
  - `app/api/admin/purge/route.ts`: Admin database purge endpoint

- **`components/`**: Modular React components organized by function
  - `ui/`: Base components (Button, Input)
  - `cards/`: Card-based components (Card, FeatureCard, MetricCard)
  - `admin/`: Admin console components (sign-in/out, database operations)
  - `bauhaus/`: Decorative geometric elements
  - Root-level: Main features (UrlShortener, ThemeToggle, NavigationHeader)

- **`lib/`**: Business logic and utilities
  - `shortcode/`: Intelligent short code generation with consonant-vowel patterns
    - `generator.ts`: Creates memorable 4-character codes (e.g., "ka9m", "pu3n")
    - `validator.ts`: Custom alias validation
    - `reserved.ts`: Protected word list
  - `supabase/`: Database client wrappers
    - `client.ts`: Browser client
    - `server.ts`: Server-side client with service role
    - `types.ts`: TypeScript type definitions
  - `theme.tsx`: Theme context provider for light/dark mode
  - `utils.ts`: Shared utility functions

### Database Schema

Supabase PostgreSQL with optimized schema for 200,000+ URLs:

- **`urls` table**: Primary storage with UUID keys, case-insensitive lookups via generated columns
- **`clicks` table**: Analytics tracking (device, browser, OS, geography, timestamps)
- **`reserved_words` table**: Protected short codes
- Comprehensive indexes for fast lookups and analytics queries
- Row Level Security (RLS) policies for access control

Schema file: `qorkme/supabase/schema.sql`
Setup guide: `qorkme/supabase/SETUP_INSTRUCTIONS.md`

### Short Code Algorithm

QorkMe uses a sophisticated consonant-vowel pattern generator:

1. Alternating consonant-vowel sequences create memorable codes
2. Collision detection with automatic retry on conflicts
3. Reserved word filtering to exclude profanity and system terms
4. Case-insensitive storage with database-level normalization
5. Custom alias support with validation (3-8 characters)

Implementation: `qorkme/lib/shortcode/generator.ts`

## Environment Variables

Required in `qorkme/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anonymous key
SUPABASE_SERVICE_KEY=              # Supabase service role key (admin operations)
NEXT_PUBLIC_SITE_URL=              # Base URL (e.g., https://qork.me)
NEXT_PUBLIC_SHORT_DOMAIN=          # Short URL domain (e.g., qork.me)
NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB= # Admin GitHub username (defaults to REALEMMETTS)
```

## CI/CD Pipeline

GitHub Actions workflows in `.github/workflows/`:

### `ci.yml` - Continuous Integration

- **Multi-node testing**: Node.js 18.x and 20.x matrix
- **Code quality**: ESLint, Prettier, TypeScript checks
- **Build verification**: Full production build with mock env vars
- **Security scanning**:
  - `npm audit` for dependency vulnerabilities
  - Trufflehog for secret detection
- **Bundle size analysis**: Reports build artifact sizes
- **Automatic deployment**: Production deployment on main branch pushes
- **Working directory**: All steps run in `qorkme/`

### `deploy.yml.disabled` - Legacy Deployment

- Disabled reference workflow at root level
- Active deployment now integrated into `ci.yml`

### Required GitHub Secrets

Configure in repository Settings -> Secrets and variables -> Actions:

- `VERCEL_TOKEN`: Vercel account token
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Design System

QorkMe now leans into an earthy modern aesthetic that pairs warm parchment neutrals with terracotta and sage accents:

- **Color palette**: Soft sand surfaces (`#f6f1e8`, `#f2e7d6`) contrasted with terracotta primary (`#c4724f`) and sage accent (`#5f7d58`).
- **Typography**: Only `ZT Bros Oskon` for display moments and Inter Regular (400) for body, UI, and numeric content; buttons use Inter Black (900) for maximum contrast via `--weight-ui-button`; if Inter must headline a section, use the `.font-inter-heavy` helper (weight 900). No other families are allowed.
- **Surfaces & depth**: Rounded cards (`12px-28px` radii) with diffused warm shadows; blur is subtle and used sparingly.
- **Theme**: Light theme focused, dark mode swaps to espresso tones via the same tokens. Tokens live in `qorkme/app/globals.css`.
- **Interaction**: Calm transitions (140-420ms), faint gradient overlays, and focus rings using the primary terracotta.
- **Spacing**: 8px grid with responsive clamps for sections, stacks, and grids.

Complete specification: `qorkme/docs/DESIGN_SYSTEM.md`

## Deployment Configuration

### Root-level `vercel.json`

- Points to `qorkme/` subdirectory for all operations
- Security headers (CSP, XSS protection, frame options)
- Function timeouts optimized for URL operations (10s max)
- Cache controls for API routes (no-store)
- Custom rewrites for routing

### Vercel Setup

1. Link GitHub repository to Vercel
2. Set root directory to `qorkme`
3. Configure environment variables in Vercel dashboard
4. Enable automatic deployments from main branch
5. Configure custom domain (optional)

Comprehensive guide: `qorkme/docs/VERCEL_SETUP.md`

## Testing Strategy

Vitest suite covering core functionality:

- **Shortcode logic**: Generation patterns, validation, reserved words
- **API routes**: POST/GET endpoints for `/api/shorten`
- **Supabase clients**: Client/server factory functions
- **UI components**: UrlShortener form interactions with Testing Library
- **Setup**: Shared test configuration in `qorkme/tests/setup.ts`

Test files mirror source structure (e.g., `lib/shortcode/generator.test.ts`)

## Admin Console

- **Route**: `/admin` (linked from footer)
- **Authentication**: GitHub OAuth via Supabase
- **Access control**: Restricted to `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` username
- **Features**:
  - Total URL count
  - Active redirects
  - Aggregate click metrics
  - Latest activity timestamps
  - Database health check
  - Danger zone: Purge all data (keeps schema intact)

## Key Implementation Details

### Case-Insensitive Short Codes

Database uses generated columns for lowercase normalization:
- User input "MyLink" is stored alongside normalized "mylink"
- Lookups always use lowercase to prevent collisions
- Display preserves original casing

### Analytics Tracking

Every redirect logs:
- Timestamp
- User agent (parsed for device/browser/OS)
- Referrer URL
- Geographic data (when available)
- IP address (hashed for privacy)

### QR Code Generation

- On-demand generation using `qrcode` library
- Embedded in result pages
- Optimized for mobile scanning
- Base64 encoded for instant display

### Performance Optimizations

- Database indexes on frequently queried columns
- In-memory caching for popular redirects (simple implementation)
- CDN delivery for static assets
- Code splitting and lazy loading
- Bundle optimization with Next.js 15

## Common Development Tasks

### Update short code generation logic
Edit `qorkme/lib/shortcode/generator.ts` and add tests to `qorkme/tests/shortcode/generator.test.ts`

### Add new reserved words
Update `qorkme/lib/shortcode/reserved.ts` and sync with database `reserved_words` table

### Modify design system colors
Edit CSS custom properties in `qorkme/app/globals.css` following specifications in `qorkme/docs/DESIGN_SYSTEM.md`

### Change redirect behavior
Update `qorkme/app/[shortCode]/route.ts` server component

### Add new API endpoint
Create route handler in `qorkme/app/api/` following Next.js App Router conventions

## Documentation

- **Setup guide**: `qorkme/README.md` - Complete installation and configuration
- **Design system**: `qorkme/docs/DESIGN_SYSTEM.md` - Earthy modern palette, typography, and component tokens
- **Vercel deployment**: `qorkme/docs/VERCEL_SETUP.md` - CI/CD configuration
- **General deployment**: `qorkme/docs/DEPLOYMENT.md` - Multi-platform options
- **Database setup**: `qorkme/supabase/SETUP_INSTRUCTIONS.md` - Supabase configuration
- **Project brief**: `CODEX_PROJECT.md` - Detailed technical overview
- **Agent guidelines**: `AGENTS.md` - Workspace-specific guidance

## Changelog Management

Both root and application changelogs must be updated:
- **Root changelog**: `CHANGELOG.md` - Repository-level changes
- **Application changelog**: `qorkme/CHANGELOG.md` - Application-specific updates

Update both files before committing changes to maintain accurate version history.

## Font Asset Management

ZT Bros Oskon 90s font family:
- **Source files**: `ZT Bros Oskon 90s/` (OTF/TTF/WEB formats)
- **Production files**: `qorkme/public/fonts/` (woff2 only)
- Keep font licensing notes aligned between source README and `qorkme/public/fonts/README.md`
- Never commit font files to version control outside designated directories

## Security Considerations

- Store secrets in `.env.local` (never commit)
- Use environment variables for all sensitive configuration
- Validate and sanitize all user inputs
- Maintain RLS policies in Supabase schema
- Review security scan results in CI/CD pipeline
- Keep dependencies updated with `npm audit`

## Browser Support

Modern browsers with ES2020+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

- Redirect response time: <100ms
- Homepage load time: <2s
- Lighthouse score: 90+ across all metrics
- Database capacity: 200,000+ URLs tested and optimized
