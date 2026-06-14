# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QorkMe is a production-ready URL shortener built with Next.js 15, TypeScript, and Supabase. It is a **QubeTX property**: the interface runs on the full QubeTX design system v3.2.1 (dark-only void `#05070f`, hairline-border surfaces, IBM Plex Mono technical register, anime.js/Framer Motion doctrine) — canonical QubeTX blue `#0066FF` as the action color and a blue→violet (`#2563eb → #7c3aed`) LED ramp powering the signature dot-matrix surfaces. Paired with intelligent short code generation and comprehensive analytics tracking. Licensed under Apache License 2.0.

**Design system of record:** live spec https://www.qubetx.com/design-system · stable kit permalink https://www.qubetx.com/qubetx-design-system.zip · vendored kit + agent docs at `qorkme/docs/qubetx-design-system/` · QorkMe usage documented in `qorkme/docs/DESIGN_SYSTEM.md` (with measured WCAG ratios). Cross-check changes against the live spec.

## Technology Stack

- **Framework**: Next.js 15.5.7 with App Router and React 19.1.0
- **Language**: TypeScript 5.5.3 (strict mode)
- **Database**: Supabase (PostgreSQL) with real-time capabilities — Project ID: `gzsdakrkbirevpxcadrg`
- **Supabase SDK**: @supabase/supabase-js 2.57.4, @supabase/ssr 0.7.0
- **Styling**: QubeTX design tokens (CSS custom properties in `globals.css`) + CSS modules for component styling; Tailwind CSS 4 via @tailwindcss/postcss retained for layout utilities only (no tailwind.config — `@theme` inline)
- **Typography**: Makira Sans Serif (400–900; Black 900 uppercase for headings/wordmarks) + IBM Plex Mono (400–700) for the technical register — labels, statuses, buttons, short URLs, `.mono-label`
- **Animation**: animejs 4.4 (via the `lib/motion/anime.ts` seam only), framer-motion 12, lenis (smooth scroll), the kit slot-roll engine (`lib/motion/slotText.ts`); no toast library — slot-roll flashes and inline mono errors
- **Text measurement**: @chenglou/pretext (PretextBlock min-height reservation; transpiled via `next.config.ts`)
- **Icons**: lucide-react 0.544.0 (20px, strokeWidth 1.5, aria-hidden)
- **Deployment**: Vercel with automated GitHub Actions CI/CD
- **Testing**: Vitest 4 (node + jsdom projects) with @testing-library/react; kit tests vendored alongside their modules

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
|   \-- public/fonts/          # Makira Sans Serif + IBM Plex Mono font files (woff2)
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
npm run ci           # Full local CI: lint + type-check + format:check + test + build
```

**Always run `npm run ci` before committing or pushing** to catch issues locally before they hit GitHub Actions.

## Architecture Overview

### Application Structure

- **`app/`**: Next.js 15 App Router with file-based routing
  - `app/layout.tsx`: Root layout with Makira Sans Serif font loading
  - `app/page.tsx`: Homepage with URL shortener form
  - `app/not-found.tsx`: Custom 404 page (matrix-themed)
  - `app/[shortCode]/route.ts`: Dynamic redirect handler for short URLs
  - `app/api/shorten/route.ts`: URL shortening API endpoint (POST/GET)
  - `app/result/[id]/page.tsx`: Success page after URL creation
  - `app/admin/page.tsx`: Admin dashboard (GitHub OAuth gated)
  - `app/admin/login/page.tsx`: Admin login entry point
  - `app/auth/callback/route.ts`: OAuth callback handler for Supabase GitHub auth
  - `app/api/admin/purge/route.ts`: Admin database purge endpoint
  - `app/api/admin/health/route.ts`: Database health check endpoint
  - `app/api/admin/links/route.ts`: Paginated URL listing with sort/filter
  - `app/api/admin/links/[id]/route.ts`: Individual link management

- **`components/`**: React components organized by function
  - `ui/`: Form primitives (`Button.tsx`, `Input.tsx`) + vendored QubeTX kit components (OutlineButton, TextLink, LabelPill, SectionHeading, StatValue, RollingLink, RoutedText, Magnetic, QubeTXLogo, icons registry)
  - `effects/`: Vendored kit canvas/motion surfaces — DotGrid (background field, blue→violet ramp, `firePulse()`), MatrixDisplay (LED word board), MatrixClock (QorkMe live LED clock), LoadSequence (entrance choreography), SmoothScroll (Lenis), CustomCursor, ScrollProgress, ScrollTrace (unused), BootScreen (vendored, unmounted)
  - `terminal/`: Vendored technical-register kit (TerminalFrame, CommandTable, CapabilityRows, InstallBlock, DownloadCard)
  - `sections/`: Page sections — Hero (home "terminal" composition: LabelPill bar eyebrow, `$ qork "url"` mono line with blinking cursor, Makira Black blue→violet gradient `QORK.ME` wordmark via `background-clip:text`, gradient hairline, UrlShortener card, live LED MatrixClock)
  - `layout/`: SysStatus (footer slot-roll heartbeat)
  - `cards/`: Card primitives (Card/CardHeader/CardTitle/CardDescription/CardContent — QubeTX-restyled)
  - `admin/`: Admin console components (AdminSignInButton, AdminSignOutButton, ClearDatabaseButton, DatabaseHealthCard, AdminLinksTable — inline mono feedback, no toasts)
  - Root-level: UrlShortener (slot-roll showcase), ShortUrlDisplay, PageHeader (fixed, blur+compress), SiteFooter (SysStatus + QubeTX attribution)

- **`lib/`**: Business logic and utilities
  - `shortcode/`: Intelligent short code generation with consonant-vowel patterns
    - `generator.ts`: Creates memorable 4-character codes (e.g., "ka9m", "pu3n")
    - `validator.ts`: Custom alias validation
    - `reserved.ts`: Protected word list
  - `supabase/`: Database client wrappers
    - `client.ts`: Browser client (@supabase/ssr `createBrowserClient`)
    - `server.ts`: Server-side client (`createServerClientInstance` for cookie-based auth, `createAdminClient` for service_role operations)
    - `types.ts`: TypeScript type definitions
  - `admin/`: Admin authorization
    - `auth.ts`: `verifyAdminAuth()` — checks GitHub OAuth session against admin username
  - `config/`: Application configuration
    - `admin.ts`: Admin username from `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` env var
  - `theme.tsx`: Theme context provider for light/dark mode
  - `utils.ts`: Shared utility functions

### Database Schema

Supabase PostgreSQL (Project ID: `gzsdakrkbirevpxcadrg`) with optimized schema for 200,000+ URLs. Claude Code has full MCP access to this database via the Supabase MCP server (execute SQL, apply migrations, list tables, deploy edge functions, view logs, generate TypeScript types).

#### Tables

- **`urls`** (RLS enabled, 13 rows) — Primary URL storage
  - `id` (UUID PK, auto-generated), `short_code` (varchar, 3-50 chars), `short_code_lower` (generated, unique), `long_url` (text)
  - `title`, `description`, `favicon_url` (nullable text metadata)
  - `custom_alias` (bool, default false), `is_active` (bool, default true), `click_count` (int, default 0)
  - `expires_at`, `last_accessed_at`, `created_at`, `updated_at` (timestamptz)
  - `user_id` (UUID FK → auth.users, nullable — null = anonymous/public URL)

- **`clicks`** (RLS enabled) — Analytics per redirect
  - `id` (UUID PK), `url_id` (UUID FK → urls), `clicked_at` (timestamptz)
  - `ip_hash`, `country`, `city`, `region`, `device_type`, `browser`, `os` (varchar)
  - `referrer` (text), `utm_source`, `utm_medium`, `utm_campaign` (varchar)

- **`reserved_words`** (RLS enabled, SELECT-only, 25 rows) — Protected short codes, PK on `word` (varchar)

- **`tags`** (RLS enabled) — URL categorization: `id` (UUID PK), `name` (varchar, unique), `color` (varchar), `created_at`

- **`url_tags`** (RLS enabled) — Many-to-many join: composite PK (`url_id`, `tag_id`), FKs to both `urls` and `tags`

#### Indexes

| Table    | Index                     | Type                                      |
| -------- | ------------------------- | ----------------------------------------- |
| `urls`   | `unique_short_code_lower` | UNIQUE btree on `short_code_lower`        |
| `urls`   | `idx_short_code_lower`    | btree on `short_code_lower`               |
| `urls`   | `idx_long_url_hash`       | btree on `md5(long_url)`                  |
| `urls`   | `idx_active_urls`         | partial btree on `is_active` WHERE true   |
| `urls`   | `idx_click_count`         | btree on `click_count` DESC               |
| `urls`   | `idx_created_at`          | btree on `created_at` DESC                |
| `urls`   | `idx_user_id`             | partial btree on `user_id` WHERE NOT NULL |
| `clicks` | `idx_clicks_url_id`       | btree on `url_id`                         |
| `clicks` | `idx_clicks_url_date`     | btree on `(url_id, clicked_at DESC)`      |
| `clicks` | `idx_clicks_clicked_at`   | btree on `clicked_at` DESC                |

#### RLS Policies

- **urls**: Public SELECT for all; INSERT allows `auth.uid() = user_id OR user_id IS NULL` (anonymous URL creation); UPDATE/DELETE restricted to `authenticated` role with `auth.uid() = user_id` only (no anonymous modification)
- **clicks**: SELECT allowed when user owns the parent URL or the URL is anonymous; INSERT allowed for all (enables analytics tracking)
- **reserved_words**: RLS enabled, SELECT-only for all (admin writes via service_role)
- **tags / url_tags**: RLS enabled (no custom policies — default deny for non-service-role)
- **Grants**: anon/authenticated have SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER — **no TRUNCATE**

#### Custom Database Functions

- `increment_click_count(p_short_code text)` — **SECURITY DEFINER**, atomically increments `click_count` + updates `last_accessed_at`, returns `(id, long_url, title)`, checks `is_active` and expiry. Used by `app/[shortCode]/route.ts` for redirects.
- `get_or_create_short_url(p_long_url, p_candidates text[], p_custom_alias, p_user_id)` — **v2, the whole shorten path in one round trip**: MD5-indexed duplicate detection (an already-shortened URL returns its existing code, never a duplicate row), reserved-word filtering, first-available-candidate selection, and the insert; unique-violation races advance to the next candidate inside the function. Returns `(id, short_code, long_url, created_at, is_new)`.
- `admin_health_stats()` — consolidated admin health/stat aggregates in one call (counts, active/inactive, freshness timestamps). **EXECUTE revoked from anon/authenticated** — service_role only.
- `check_short_code_available(code text)` — checks availability against both `urls` and `reserved_words` tables
- `update_updated_at_column()` — trigger function on `urls` table, fires BEFORE UPDATE
- All functions pin `search_path = public`. Migrations live in `qorkme/supabase/migrations/`.

#### Installed Extensions

`uuid-ossp`, `pgcrypto`, `pg_graphql`, `pg_trgm`, `pg_stat_statements`, `supabase_vault`, `plpgsql`

Schema file: `qorkme/supabase/schema.sql`
Setup guide: `qorkme/supabase/SETUP_INSTRUCTIONS.md`

### Short Code Algorithm

QorkMe uses a sophisticated consonant-vowel pattern generator:

1. Alternating consonant-vowel sequences create memorable codes
2. Collision detection with automatic retry on conflicts
3. Reserved word filtering to exclude profanity and system terms
4. Case-insensitive storage with database-level normalization
5. Custom alias support with validation (3-50 characters)

Implementation: `qorkme/lib/shortcode/generator.ts`

### Critical UI/Layout Patterns

**IMPORTANT**: QorkMe uses Tailwind CSS v4 which has different behavior than v3. Key gotchas:

1. **Flexbox Margin Collapse**: When a parent has `items-center justify-center`, margins on children are collapsed/ignored. Always use `gap` on the flex parent instead of `margin` on children.

   ```jsx
   // ❌ WRONG - margin ignored
   <main className="flex items-center justify-center">
     <div className="mt-32"><Component /></div>
   </main>

   // ✅ RIGHT - use gap
   <main className="flex items-center justify-center">
     <div className="flex flex-col gap-32">
       <Component1 />
       <Component2 />
     </div>
   </main>
   ```

2. **Tailwind v4 Utility Generation**: Large padding values (>12) may not generate properly. Use inline styles with explicit pixel values when Tailwind classes fail:

   ```jsx
   // May not work: <div className="p-16">
   // Always works: <div style={{ padding: '64px' }}>
   ```

   **Real-world example from mobile responsive improvements (2025-10-18)**:

   ```jsx
   // ❌ WRONG - Classes don't generate in Tailwind v4
   <div className="px-6">  // Won't render
   <div className="mx-4">  // Won't render

   // ✅ RIGHT - Inline styles guaranteed to work
   <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
   <div style={{ marginLeft: '16px', marginRight: '16px' }}>
   ```

3. **Responsive Rendering**: For components that need different sizes at different breakpoints, render separate instances with Tailwind visibility utilities:

   ```jsx
   // ✅ Mobile and desktop versions with different props
   <div className="md:hidden">
     <Component size={5} cols={32} />  {/* Mobile */}
   </div>
   <div className="hidden md:block">
     <Component size={8} cols={50} />  {/* Desktop */}
   </div>
   ```

4. **Component Structure**: Keep layouts flat - avoid unnecessary nesting. Each extra div adds complexity and potential layout issues.

Complete troubleshooting guide: `qorkme/docs/UI_LAYOUT_GUIDE.md`

### Dot-Field Background (DotGrid)

The home and 404 pages float on the QubeTX canvas dot field, on the canonical blue→violet ramp:

- **Component**: `qorkme/components/effects/DotGrid.tsx` (vendored kit, LUT divergence documented in-file)
- **Architecture**: anime.js animates plain dot objects (breathe/pulse channels); Canvas 2D only blits; feathered TL→BR ramp; ≤1400 dots; IO-paused offscreen; rebuilds via `resizeCoordinator` (no ResizeObserver)
- **Interactions**: window-level pointer move/down → elastic swell around the cursor; `firePulse({x, y, strength})` / the `qubetx:pulse` CustomEvent → field-wide ripple. **The shortener fires a pulse when a link is created.**
- **Layering**: the component's container is `pointer-events: none` and it listens on `window`, so content never needs the old pointer-events dance. Grid at z-0 (fixed), content at z-10.
- Reduced motion: static ramp, no loops.

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

- **Multi-node testing**: Node.js 20.x and 22.x matrix (vitest 4 requires Node ≥ 20.19)
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

**Full QubeTX design system v3.2.1.** Live spec: https://www.qubetx.com/design-system · kit permalink: https://www.qubetx.com/qubetx-design-system.zip · vendored kit at `qorkme/docs/qubetx-design-system/`.

- **Dark only** — void `#05070f` page background, surfaces `#0d1117`/`#111827`, 1px hairline borders `#1a2236` (hover `#2c3a5c`) do the elevation work (no large shadows). Text: `#ffffff` / `#94a3b8` / `#76869f` dim (contrast-tuned — never adjust). No theme toggle.
- **QubeTX accent (measured on void, see `qorkme/docs/DESIGN_SYSTEM.md`)**: blue `#0066FF` action (~4.3:1 — a UI accent for borders/buttons/icons, not body text), hover `#3385ff`, arrival flash `#3385ff` (slot rolls; ≈5.7:1 AA), gradient/LED ramp `#2563eb → #7c3aed` (blue→violet), violet accent `#7c3aed` (hover `#9d5cf5`), success `#22c55e`. Semantics: warning ochre `#d6a52e`, error `#d07a66`, info `#7aa3d0`.
- **Typography**: Makira (Black 900 uppercase headings/wordmarks, −0.02em) + IBM Plex Mono technical register (labels, buttons, statuses, short URLs; `--text-mono-label` 0.7rem/0.12em). Sentence case in storage, UPPERCASE via CSS.
- **Radii**: 2px chips · 4px pills · 6px panels/buttons · 999px pill tabs. **Spacing**: 8px ladder + clamp()-based page rhythm; `--container-max` 1440px (1800px ≥2560px).
- **Motion**: house curve `cubic-bezier(0.25, 1, 0.5, 1)`; slot rolls for every label change; one owner per property; no ResizeObserver; IO triggers + Lenis scrubbing; reduced motion = instant final state. Playbook: `qorkme/docs/qubetx-design-system/MOTION_GUIDE.md`.

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

- **Shortcode logic**: Generation patterns, validation, reserved words (`tests/shortcode/generator.test.ts`)
- **API routes**: POST/GET endpoints for `/api/shorten` (`tests/routes/shorten-route.test.ts`)
- **Supabase clients**: Client/server factory functions (`tests/supabase/client.test.ts`)
- **UI components**: UrlShortener form interactions with Testing Library (`tests/ui/url-shortener.test.tsx`)
- **Setup**: Shared test configuration in `qorkme/tests/setup.ts`

**Test Patterns**:

- UI tests use @testing-library/react with user-event for realistic interactions
- API route tests mock Supabase client responses
- Tests mirror source structure for easy navigation

**Running specific tests**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx vitest run tests/shortcode/generator.test.ts
```

Test files mirror source structure (e.g., `lib/shortcode/generator.ts` → `tests/shortcode/generator.test.ts`)

## Admin Console

- **Route**: `/admin` (linked from footer), login at `/admin/login`
- **Authentication**: GitHub OAuth via Supabase, callback at `/auth/callback`
- **Authorization**: `lib/admin/auth.ts` (`verifyAdminAuth()`) checks session against `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` (default: `REALEMMETTS`)
- **Components**: `admin/AdminSignInButton`, `AdminSignOutButton`, `ClearDatabaseButton`, `DatabaseHealthCard`, `AdminLinksTable`
- **API routes** (all use `createAdminClient()` with service_role key, bypassing RLS):
  - `GET /api/admin/health`: Database status, table counts, latency, freshness timestamps
  - `GET /api/admin/links`: Paginated URL listing with sort/order params (page, pageSize, sort, order)
  - `PATCH/DELETE /api/admin/links/[id]`: Individual link toggle/delete
  - `POST /api/admin/purge`: Wipes all clicks and urls (keeps schema)
- **Features**:
  - Total URL count (active + inactive breakdown)
  - Aggregate click metrics
  - Latest activity timestamps
  - Database health check with latency monitoring
  - Paginated links table with sorting
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

### LED Matrix Surfaces (Canvas, Kit Architecture)

- **`qorkme/components/effects/MatrixDisplay.tsx`** — kit LED word board: anime.js sweeps words in/out left→right, blue→violet LUT, IO-paused, `resizeCoordinator` rebuilds, reduced motion renders the first word statically. Used for 404 (`404`/`NOT.FOUND`) and admin login (`SECURE`/`ACCESS`). **No longer used for the home wordmark** — the home `QORK.ME` is now a Makira Black blue→violet gradient headline (see `components/sections/Hero.tsx`), not an LED board.
- **`qorkme/components/effects/MatrixClock.tsx`** — QorkMe's live 12-hour LED clock on the same dotFont/canvas architecture. Real wall-clock time ("the terminal is honest"); only changed dots animate per tick; `seconds` prop (home renders a seconds instance ≥768px and a no-seconds instance below via dual-instance pattern); client-only (canvas has no hydration surface).
- **`qorkme/lib/motion/dotFont.ts`** — 5×7 bitmap font; QorkMe divergence adds digits 0-9 and `:`.
- Canvas components size from their **containers** — wrappers must carry explicit width/height (clamp()-based), which is how responsiveness collapses the old dual cell-size render paths.

### URL Shortener Card (Slot-Roll Showcase)

Implementation: `qorkme/components/UrlShortener.tsx` + `UrlShortener.module.css`

- Submit button label rolls `SHORTEN → WORKING…` (Enter submits via a real `<form>`)
- Card corner status rolls while typing: `IDLE → INPUT → READY → BUSY → DONE`
- Custom-alias availability rolls `CHECKING → AVAILABLE / TAKEN / INVALID` (debounced GET)
- Result short URL arrival-rolls from a masked placeholder; `COPY → COPIED` flash (1.4s revert, `FAILED` on clipboard error)
- Success fires a `firePulse` ripple through the DotGrid
- Errors are inline mono `ERR //` lines (`role="alert"`) — no toasts anywhere in the app

## Development Troubleshooting

### Clear Cache and Restart Dev Server

When changes don't appear or layout behaves unexpectedly:

```bash
# Kill dev server if running
pkill -f "next dev"

# Clear Next.js cache
rm -rf qorkme/.next

# Restart from qorkme directory
cd qorkme && npm run dev
```

### Verify Changes Applied

1. **Hard refresh browser**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Check rendered HTML**: `curl -s http://localhost:3000 | grep "your-class"`
3. **Browser inspector**: Check "Computed" tab for actual CSS values

### Layout Debugging

1. Add temporary colored backgrounds to visualize container boundaries
2. Check parent for `items-center` or `justify-center` (these collapse margins)
3. Verify `gap` is on the direct parent of elements you're spacing
4. Use inline styles if Tailwind classes aren't generating

See `qorkme/docs/UI_LAYOUT_GUIDE.md` for comprehensive layout troubleshooting.

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

### Modify matrix display or clock

- `qorkme/components/effects/MatrixDisplay.tsx` - LED word board (kit, blue→violet LUT)
- `qorkme/components/effects/MatrixClock.tsx` - live 12-hour LED clock (per-tick dot diffs)
- `qorkme/lib/motion/dotFont.ts` - 5×7 glyph bitmaps (A-Z, 0-9, `.`, `-`, `:`, space)
- Canvas-only rendering (client-side; no hydration surface); containers must have explicit dimensions

## Documentation

- **Setup guide**: `qorkme/README.md` - Complete installation and configuration
- **Design system**: `qorkme/docs/DESIGN_SYSTEM.md` - full QubeTX system (blue→violet on void) with measured WCAG ratios; vendored kit + agent docs at `qorkme/docs/qubetx-design-system/`; live spec https://www.qubetx.com/design-system
- **UI/Layout guide**: `qorkme/docs/UI_LAYOUT_GUIDE.md` - Critical Tailwind v4 gotchas, flexbox patterns, troubleshooting
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

Two font families ship in `qorkme/public/fonts/` (woff2 only):

- **Makira Sans Serif** (proprietary, self-hosted): Regular, Medium, SemiBold, Bold, ExtraBold, Black. Source: `C:\Users\hey\Documents\NEWFONTS2026\Makira-Sans-Serif\` (OTF/TTF/Variable/Web)
- **IBM Plex Mono** (IBM open source, SIL OFL 1.1): Regular, Medium, SemiBold, Bold. Used for the `--font-mono` slot

- Keep font licensing notes aligned in `qorkme/public/fonts/README.md`
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
