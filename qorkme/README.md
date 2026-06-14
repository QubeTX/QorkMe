# QorkMe - Premium URL Shortener

A sophisticated, scalable URL shortener built with Next.js 15, TypeScript, and Supabase, featuring a dark-only QubeTX interface — void `#05070f` surfaces, a blue→violet (`#2563eb → #7c3aed`) brand gradient, hairline-border panels, and intelligent short code generation.

## Features

### Core Functionality

- **Smart URL Shortening**: Generate memorable short codes using consonant-vowel patterns
- **Custom Aliases**: Create personalized short codes with case-insensitive matching
- **QR Code Generation**: Instant QR codes for easy mobile sharing
- **Analytics Tracking**: Comprehensive click analytics with device and geographic data
- **Bulk Operations**: Efficient handling of multiple URLs
- **URL Validation**: Robust URL validation and sanitization

### Design & User Experience

- **Animated Dot-Grid Background**: Canvas dot field on the QubeTX blue→violet ramp with pointer-reactive swells and a `firePulse` ripple when a link is created
- **LED Matrix Surfaces**: Canvas LED word board (404, login) and a live 12-hour LED clock, both on the blue→violet color ramp
- **Terminal Hero**: A "terminal" home composition — a `$ qork "url"` mono line and a Makira Black blue→violet gradient `QORK.ME` wordmark
- **Hairline Surfaces**: 1px borders do the elevation work on dark void surfaces — no heavy shadows
- **Technical Typography**: Makira Sans Serif (Black 900 uppercase headings/wordmarks) paired with IBM Plex Mono for the technical register (labels, statuses, buttons, short URLs)
- **Slot-Roll Interactions**: Every label change rides a slot roll; inline mono `ERR //` lines instead of toasts
- **Responsive Excellence**: Mobile-first layouts optimized for quick scanning, scaling up to a TV tier and down to landscape phones
- **Dark Only**: A single QubeTX palette — no light mode, no theme toggle

### Technical Excellence

- **Next.js 15.5.3 with App Router**: Latest React 19 features and server-side rendering
- **TypeScript 5**: Full type safety throughout the application
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Scalable Architecture**: Designed to handle 200,000+ URLs efficiently
- **Performance Optimized**: Database indexes and caching strategies
- **Security First**: Input validation, sanitization, and protected API routes

## Command-Line Tool (`qork`)

Shorten URLs straight from your terminal with **`qork`**, a cross-platform Rust CLI ([QubeTX/qork](https://github.com/QubeTX/qork)):

```bash
qork https://example.com/some/very/long/path     # → https://qork.me/ka9m
qork "https://example.com/a b?x=1&y=2"            # quote URLs with spaces/specials
qork https://example.com --alias launch            # custom short code
qork https://example.com --no-check                # skip the pre-shorten liveness check
qork --json https://example.com                     # raw JSON for scripts/agents
qork help                                           # CLI docs (also `man qork`)
qork update                                         # self-update (install-method-aware)
qork uninstall [--yes]                              # fully remove qork (--yes/-y skips the prompt)
```

`help`, `update`, and `uninstall` are recognized as whole-word, case-insensitive commands and are
never treated as URLs. Other flags: `--no-color`, `--api-base <URL>` (or `QORK_API_BASE`),
`-h/--help`, `-V/--version`.

Before shortening, `qork` runs a quick safety check — it rejects accidentally-pasted
text offline and refuses a dead link (a live 404/410 or a host that won't resolve);
auth walls (401/403), 5xx, and slow sites still shorten. Pass `--no-check` to skip it.
`qork uninstall` fully removes qork on every platform, aware of how it was installed
(MSI, Inno EXE, or cargo/script) — add `--yes` to skip the confirmation prompt.

Install (no Rust toolchain required):

```bash
# macOS / Linux
curl -LsSf https://qork.me/install.sh | sh
# Windows (PowerShell)
irm https://qork.me/install.ps1 | iex
# Cargo
cargo install qork
```

The command-line one-liner (`curl … | sh` / `cargo install qork`) is the recommended path on
**macOS and Linux**; on **Windows the MSI/EXE installer is recommended** (MSIs work better on
Windows). Native per-platform installers ship with every release — Windows `.msi`/`.exe` (Global,
per-machine + Corporate, per-user/no-admin), macOS `.pkg` (Apple Silicon + Intel), and Linux
`.deb`/`.rpm` (x86-64 + ARM) — downloadable from the
[latest GitHub release](https://github.com/QubeTX/qork/releases/latest). `qork update` re-runs the
matching installer.

Full install guide + per-platform downloads: **https://qork.me/install**.

## Public API

`POST /api/shorten` (JSON body) or `GET /api/shorten?url=<url-encoded>` (convenience mode for curl/agents) — both return the same envelope.

```bash
# POST — best for long URLs with their own query strings
curl -X POST https://qork.me/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","source":"api"}'

# GET convenience mode
curl "https://qork.me/api/shorten?url=https%3A%2F%2Fexample.com"
```

Request fields: `url` (required), `customAlias` (optional), `source` (optional — `web` | `cli` | `api`, recorded for analytics). Response:

```json
{
  "shortCode": "ka9m",
  "shortUrl": "qork.me/ka9m",
  "href": "https://qork.me/ka9m",
  "longUrl": "https://example.com",
  "isNew": true
}
```

Use `href` for the full clickable link. Errors return `{ "error": "…" }` with a 4xx/5xx status. A machine-readable guide for agents lives at **https://qork.me/llms.txt**.

## Quick Start

### Prerequisites

- Node.js 18.17 or later (tested on 18.x and 20.x)
- A Supabase account and project
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/qorkme.git
   cd qorkme
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SHORT_DOMAIN=localhost:3000
   NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB=REALEMMETTS
   ```

4. **Set up the database**
   - Follow the complete setup guide in `supabase/SETUP_INSTRUCTIONS.md`
   - Or copy the contents of `supabase/schema.sql` and run in your Supabase SQL Editor

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run Vitest unit tests
npm run test:watch   # Watch mode for Vitest
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing

Run `npm test` to execute the Vitest suite. Coverage currently includes the short code engine, `/api/shorten` route handlers (POST/GET), Supabase client factories, and the interactive `UrlShortener` form; expand with integration tests as the platform grows.

## Admin Console

- Visit `/admin` (linked from the footer) for a private control room summarizing Supabase metrics.
- Supabase GitHub authentication restricts access to the username defined in `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` (defaults to `REALEMMETTS`).
- The dashboard displays total URL counts, active redirects, aggregate click totals, latest activity timestamps, and a basic health check query.
- A gated danger-zone action purges stored `urls` and `clicks` data without modifying database structure.

## Architecture

### Project Structure

```
.
├── app/                       # Next.js 15 App Router
│   ├── [shortCode]/
│   │   └── route.ts          # Dynamic redirect handler
│   ├── admin/                # Admin console
│   │   ├── login/
│   │   │   └── page.tsx      # Admin login page
│   │   └── page.tsx          # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── admin/
│   │   │   └── purge/
│   │   └── shorten/
│   │       └── route.ts      # URL shortening endpoint
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx      # Success page
│   ├── favicon.ico           # Site favicon
│   ├── globals.css           # Global styles & design tokens
│   ├── layout.tsx            # Root layout with fonts
│   ├── not-found.tsx         # 404 page
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── admin/               # Admin console components
│   │   ├── AdminSignInButton.tsx
│   │   ├── AdminSignOutButton.tsx
│   │   └── ClearDatabaseButton.tsx
│   ├── bauhaus/
│   │   └── GeometricDecor.tsx
│   ├── cards/               # Card-based components
│   │   ├── Card.tsx         # Base card component
│   │   ├── FeatureCard.tsx  # Feature showcase card
│   │   └── MetricCard.tsx   # Metric display card
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx       # Button component
│   │   ├── Input.tsx        # Input component
│   │   ├── interactive-grid-pattern.tsx  # Interactive grid background
│   │   ├── matrix.tsx       # Matrix display core logic
│   │   └── shimmering-text.tsx  # Shimmering text effect
│   ├── ClientThemeToggle.tsx
│   ├── MatrixBackground.tsx
│   ├── MatrixDisplay.tsx
│   ├── NavigationHeader.tsx
│   ├── ResultNavigationHeader.tsx
│   ├── ShortUrlDisplay.tsx
│   ├── SiteFooter.tsx
│   ├── SiteHeader.tsx
│   ├── ThemeToggle.tsx
│   └── UrlShortener.tsx
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── DESIGN_SYSTEM.md     # Design system specs
│   ├── UI_LAYOUT_GUIDE.md   # UI/layout troubleshooting
│   └── VERCEL_SETUP.md      # Vercel setup guide
├── lib/                     # Utilities and helpers
│   ├── config/
│   │   └── admin.ts
│   ├── shortcode/          # Short code generation
│   │   ├── generator.ts    # Code generation algorithm
│   │   ├── reserved.ts     # Reserved words list
│   │   └── validator.ts    # Validation logic
│   ├── supabase/           # Database clients
│   │   ├── client.ts       # Client-side Supabase
│   │   ├── server.ts       # Server-side Supabase
│   │   └── types.ts        # TypeScript types
│   ├── theme.tsx           # Theme context provider
│   └── utils.ts            # Utility functions
├── public/                  # Static assets
│   ├── fonts/              # Makira Sans Serif + IBM Plex Mono (woff2)
│   │   └── README.md       # font licensing notes
│   ├── apple-touch-icon.png   # iOS home screen icon (180×180)
│   ├── favicon-16x16.png      # Browser tab icon
│   ├── favicon-32x32.png      # Retina browser tab icon
│   ├── favicon-48x48.png      # Windows taskbar icon
│   ├── favicon.svg            # Vector Qork logo favicon
│   ├── qork-logo.svg          # Qork brand logo (hero, header, footer)
│   ├── file.svg
│   ├── globe.svg
│   ├── icon-192.png           # PWA icon (192×192)
│   ├── icon-512.png           # PWA icon (512×512)
│   ├── manifest.json          # PWA manifest
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── supabase/                # Database
│   ├── SETUP_INSTRUCTIONS.md
│   └── schema.sql
├── tests/                   # Vitest test suites
│   ├── routes/
│   │   └── shorten-route.test.ts
│   ├── shortcode/
│   │   └── generator.test.ts
│   ├── supabase/
│   │   └── client.test.ts
│   ├── ui/
│   │   └── url-shortener.test.tsx
│   └── setup.ts
├── CHANGELOG.md             # Version history
├── CLAUDE.md                # AI assistant guide
├── README.md                # This file
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vitest.config.ts

31 directories, 87 files
```

> Deployment configuration lives in the repository root [`../vercel.json`](../vercel.json), which orchestrates installs and builds for this sub-application on Vercel.

### Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: QubeTX design tokens (CSS custom properties) + CSS modules; Tailwind CSS v4 retained for layout utilities (no `tailwind.config` — `@theme` inline)
- **Typography**: Makira Sans Serif (headings/wordmarks) + IBM Plex Mono (technical register), self-hosted woff2
- **Theme System**: Dark only — a single QubeTX void palette, no light mode or theme toggle
- **Icons**: Lucide React v0.544.0
- **QR Codes**: qrcode v1.5.4 library
- **Notifications**: React Hot Toast v2.6.0
- **ID Generation**: nanoid v5.1.5 for secure short codes

## Smart Short Code Algorithm

QorkMe uses an intelligent short code generation system:

1. **Memorable Patterns**: Alternating consonant-vowel sequences (e.g., `revo`, `tiku`, `balo`)
2. **Collision Avoidance**: Automatic retry with different patterns
3. **Reserved Word Protection**: Excludes profanity and reserved terms
4. **Case Sensitivity**: Database stores lowercase for fast lookups
5. **Custom Aliases**: User-defined codes with validation
6. **Length Optimization**: 3-8 characters for optimal memorability

## Database Design

Optimized PostgreSQL schema with:

- **Primary Table**: `urls` with UUID primary keys
- **Analytics Table**: `clicks` for detailed tracking
- **Indexes**: Optimized for fast lookups at scale
- **Constraints**: Data integrity and validation
- **Extensions**: UUID generation and fuzzy search support

Key performance features:

- Case-insensitive lookups with generated columns
- Partitioned analytics for high-volume tracking
- Comprehensive indexing strategy for 200,000+ URLs
- Row-level security for multi-tenant support

## QubeTX Design System

QorkMe runs on the full QubeTX design system (dark only):

- **Void Color Story**: Void `#05070f` background with hairline-border surfaces; the blue→violet (`#2563eb → #7c3aed`) brand gradient powers the wordmark, dot grid, and LED surfaces; QubeTX blue `#0066FF` is the action color
- **Hairline Depth**: 1px borders do the elevation work — no heavy shadows
- **Typography Balance**: Makira Sans Serif (Black 900 uppercase) leads hero moments and wordmarks while IBM Plex Mono carries the technical register — labels, statuses, buttons, and short URLs
- **Dark Only**: A single QubeTX palette — no light mode, no theme toggle
- **Measured Motion**: anime.js / Framer Motion under the QubeTX motion doctrine — one owner per property, slot-roll label changes, reduced motion = instant final state

### Brand Logo Assets

- **Qork Logo (transparent)**: `https://shaughv.s3.us-east-1.amazonaws.com/brandmark/QORK/qork-logo.svg`
- **Qork Logo (with background)**: `https://shaughv.s3.us-east-1.amazonaws.com/brandmark/QORK/qork-logo-background.svg`

The Qork logo appears in the homepage hero, site header, 404 page, admin dashboard, site footer, and as the favicon.

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for the complete QubeTX design system specification.

## Production Configuration

### Vercel Configuration (root `../vercel.json`)

- **Security Headers**: Content Security Policy, XSS protection, frame options
- **Function Timeouts**: Optimized for URL shortening and redirects
- **Caching Strategy**: No-cache for API routes, optimized static asset caching
- **Environment Variables**: Secure configuration management

### Code Quality & Formatting

- **Prettier Configuration**: Consistent code formatting with 100-character line width
- **ESLint**: Next.js recommended rules with strict TypeScript checking
- **TypeScript**: Strict mode with comprehensive type checking

### CI/CD Automation

The project includes two GitHub Actions workflows:

#### 1. CI Testing & Quality Checks (`ci.yml`)

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality**: ESLint, Prettier, and TypeScript checks
- **Security Scanning**: Dependency audits with npm audit and Trufflehog secret detection
- **Preview Deployments**: Automatic preview URLs for pull requests with GitHub comments
- **Bundle Size Analysis**: Build size reporting and optimization checks

#### 2. Production Deployment (`deploy.yml`)

- **Automatic Deployment**: Triggers on main branch pushes or manual workflow dispatch
- **Vercel Integration**: Seamless production deployment with CLI v4
- **Commit Comments**: Automatic deployment status updates with production URLs
- **Actions Versions**: Uses actions/checkout@v4 and actions/setup-node@v4

## Deployment & CI/CD

QorkMe is optimized for Vercel deployment with a complete CI/CD pipeline using GitHub Actions.

### Vercel Deployment (Recommended)

- **Automatic builds** from Git commits
- **Serverless functions** for API routes
- **Global CDN** with edge caching
- **Custom domains** with automatic SSL
- **Preview deployments** for pull requests

### CI/CD Pipeline

- **Continuous Integration**: Automated testing, linting, type-checking, and security scans
- **Preview Deployments**: Every PR gets a preview deployment with automatic URL comments
- **Production Deployment**: Automatic deployment to production on main branch pushes
- **Security Scanning**: Dependency audits and secret detection
- **Code Quality**: Prettier formatting checks and ESLint validation

### Alternative Platforms

- **Netlify**: With Next.js plugin support
- **Railway**: Container-based deployment
- **Render**: Full-stack hosting solution

**Important**: GitHub Pages is NOT supported due to server-side requirements.

### Complete Setup Guides

- [Vercel & Supabase Setup](docs/VERCEL_SETUP.md) - Comprehensive guide with CI/CD configuration
- [General Deployment Guide](docs/DEPLOYMENT.md) - Multi-platform deployment instructions

## Usage Examples

### Basic URL Shortening

```jsonc
// POST /api/shorten  — body
{ "url": "https://example.com/very/long/path/to/resource" }

// Response (flat envelope)
{
  "id": "uuid",
  "shortCode": "revo",
  "shortUrl": "qork.me/revo",
  "href": "https://qork.me/revo",
  "longUrl": "https://example.com/very/long/path/to/resource",
  "isNew": true,
  "domain": "example.com",
  "createdAt": "2026-06-14T09:57:58Z"
}
```

`href` is the fully-qualified short link; `shortUrl` is the same without the scheme. When the URL
was already shortened, the response is `{ shortCode, shortUrl, href, isNew: false }` (no new row).

### Custom Alias

```jsonc
// POST /api/shorten  — body
{ "url": "https://mysite.com", "customAlias": "mysite" }

// Creates: https://qork.me/mysite  (409 if the alias is already taken)
```

## Performance & Scalability

Designed for high-performance operation:

- **Database Optimization**: Efficient indexes for fast lookups
- **Caching Strategy**: Server-side caching for popular URLs
- **CDN Integration**: Static assets served from global network
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Code splitting and tree shaking

**Capacity**: Tested and optimized for 200,000+ URLs with sub-100ms response times.

## Security Features

- **Input Validation**: Comprehensive URL and alias validation
- **SQL Injection Protection**: Parameterized queries throughout
- **XSS Prevention**: Input sanitization and output encoding
- **Rate Limiting**: API endpoint protection
- **HTTPS Enforcement**: Secure connections required
- **Environment Variables**: Sensitive data properly managed

## Analytics & Monitoring

Track comprehensive metrics:

- **Click Analytics**: Total clicks, unique visitors, geographic data
- **Device Tracking**: Mobile, desktop, tablet usage
- **Referrer Data**: Traffic source analysis
- **Performance Metrics**: Response times and error rates
- **Database Monitoring**: Usage patterns and optimization opportunities

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the design system guidelines
4. Commit with descriptive messages
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Maintain modern design consistency and card-based layouts
- Respect theme system and use CSS custom properties
- Write comprehensive tests
- Update documentation for new features
- Use semantic commit messages

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

Modern browsers with ES2020+ support required.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Documentation

### Complete Documentation

- **[Vercel & Supabase Setup Guide](docs/VERCEL_SETUP.md)**: Comprehensive deployment setup with CI/CD configuration
- **[General Deployment Guide](docs/DEPLOYMENT.md)**: Multi-platform deployment instructions and troubleshooting
- **[Design System Documentation](docs/DESIGN_SYSTEM.md)**: Complete modern design specifications and component guidelines

### Getting Help

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions for help and ideas
- **Documentation**: All guides are comprehensive with troubleshooting sections

## Roadmap

- [ ] Bulk URL import/export
- [ ] Advanced analytics dashboard
- [ ] API rate limiting tiers
- [ ] Custom domain support for users
- [ ] Link expiration management
- [ ] A/B testing for short codes
- [ ] Integration webhooks
- [ ] Mobile app companion

---

Built with calm confidence - Bringing the QubeTX design system and purposeful interactions to URL shortening.
