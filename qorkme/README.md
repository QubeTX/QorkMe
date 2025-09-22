# QorkMe - Premium URL Shortener

A sophisticated, scalable URL shortener built with Next.js 15, TypeScript, and Supabase, featuring advanced glassmorphism design with midnight blue aesthetics, premium interactive effects, and intelligent short code generation.

## Features

### Core Functionality

- **Smart URL Shortening**: Generate memorable short codes using consonant-vowel patterns
- **Custom Aliases**: Create personalized short codes with case-insensitive matching
- **QR Code Generation**: Instant QR codes for easy mobile sharing
- **Analytics Tracking**: Comprehensive click analytics with device and geographic data
- **Bulk Operations**: Efficient handling of multiple URLs
- **URL Validation**: Robust URL validation and sanitization

### Design & User Experience

- **Advanced Glassmorphism Design**: Sophisticated backdrop-blur effects with layered shadow systems
- **Premium Dark Mode**: Deep midnight blue (#0f172a) with bright accents (blue, purple, cyan)
- **Enhanced Interactivity**: Shimmer effects, hover transforms, and floating animations
- **Responsive Excellence**: Optimized for all devices with premium touch interactions
- **Dual Theme Support**: Dark mode primary with sophisticated light mode fallback
- **ZT Bros Oskon Typography**: Bold serif fonts with uppercase styling and enhanced spacing
- **Premium Visual Effects**: Scale transforms, gradient overlays, and sophisticated micro-animations
- **Integrated Notification System**: Glassmorphic toasts matching the overall aesthetic

### Technical Excellence

- **Next.js 15.5.3 with App Router**: Latest React 19 features and server-side rendering
- **TypeScript 5**: Full type safety throughout the application
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Scalable Architecture**: Designed to handle 200,000+ URLs efficiently
- **Performance Optimized**: Database indexes and caching strategies
- **Security First**: Input validation, sanitization, and protected API routes

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
qorkme/
├── .github/              # GitHub Actions workflows
│   └── workflows/        # CI/CD automation
│       ├── ci.yml        # Testing, linting, security scans
│       └── deploy.yml    # Production deployment
├── app/                  # Next.js 15 App Router
│   ├── api/             # API routes
│   │   └── shorten/     # URL shortening endpoint
│   ├── result/[id]/     # Results page
│   ├── [shortCode]/     # Dynamic redirect handler
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Home page
│   └── not-found.tsx    # 404 page
├── components/           # React components
│   ├── ui/              # Base UI components
│   │   ├── Button.tsx   # Modern styled button
│   │   └── Input.tsx    # Form input component
│   ├── cards/           # Card-based components
│   │   ├── Card.tsx     # Base card component
│   │   └── FeatureCard.tsx # Feature display cards
│   ├── ThemeToggle.tsx  # Light/dark theme toggle
│   ├── UrlShortener.tsx # Main shortener form
│   └── ShortUrlDisplay.tsx # Results display
├── lib/                  # Utility libraries
│   ├── shortcode/       # Short code generation
│   │   ├── generator.ts # Smart generation algorithm
│   │   ├── validator.ts # Validation logic
│   │   └── reserved.ts  # Reserved words list
│   ├── supabase/        # Database client
│   ├── theme.tsx        # Theme context provider
│   └── utils.ts         # Shared utilities
├── supabase/            # Database schema
│   └── schema.sql       # Complete database setup
├── docs/                # Documentation
│   ├── VERCEL_SETUP.md  # Comprehensive Vercel & Supabase guide
│   ├── DEPLOYMENT.md    # General deployment instructions
│   └── DESIGN_SYSTEM.md # Complete design specifications
├── .prettierrc          # Code formatting configuration
└── package.json         # Dependencies and scripts
```

> Deployment configuration lives in the repository root [`../vercel.json`](../vercel.json), which orchestrates installs and builds for this sub-application on Vercel.

### Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 with sophisticated glassmorphism design tokens and advanced CSS variables
- **UI Components**: Card-based components with refined shadows and sophisticated interactions
- **Theme System**: Dynamic light/dark mode with deep earth tone variants
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

## Premium Design Philosophy

QorkMe delivers a sophisticated, premium user experience:

- **Refined & Sophisticated**: Every element crafted for premium feel and elegant functionality
- **Advanced Color Architecture**: Deep midnight blues with bright, high-contrast accent colors
- **Glassmorphism Excellence**: Backdrop-blur effects with layered shadow systems for depth
- **Dark-First Approach**: Sophisticated dark mode as primary experience with elegant light fallback
- **Typography Mastery**: ZT Bros Oskon serif fonts with uppercase styling and enhanced character
- **Premium Interactions**: Shimmer effects, transform animations, and floating elements for engaging UX

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for complete glassmorphism and sophisticated design specifications.

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

```typescript
// POST /api/shorten
{
  "longUrl": "https://example.com/very/long/path/to/resource"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "shortCode": "revo",
    "shortUrl": "https://qork.me/revo",
    "longUrl": "https://example.com/very/long/path/to/resource"
  }
}
```

### Custom Alias

```typescript
// POST /api/shorten
{
  "longUrl": "https://mysite.com",
  "customAlias": "mysite"
}

// Creates: https://qork.me/mysite
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

Built with sophistication - Bringing premium glassmorphism and advanced interactive design to URL shortening.
