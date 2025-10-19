# QorkMe - Modern URL Shortener

A professional, scalable URL shortener built with Next.js 15, TypeScript, and Supabase. The interface leans into an earthy modern aesthetic that pairs warm parchment neutrals, terracotta accents, and sage highlights with intelligent short code generation and comprehensive analytics tracking.

## Quick Start

Visit the application directory for complete setup instructions:

```bash
cd qorkme/
```

See [`qorkme/README.md`](qorkme/README.md) for detailed installation, configuration, and deployment instructions.

## Project Structure

```
.
├── NEW_REDESIGN_SAMPLE/          # Design component documentation
│   ├── INTERACTIVE_GRID_BACKGROUND.md
│   ├── MATRIX_DOCS.md
│   ├── SHIMMERING_TEXT_DOCS.md
│   └── qorkme.html
├── ZT Bros Oskon 90s/            # Display font source files (OTF/TTF/WEB)
│   ├── Italic - OTF/            # 36 italic font variants
│   ├── Italic - TTF/            # 36 italic font variants
│   ├── Italic - WEB OTF/        # 72 files (OTF + woff2)
│   ├── Italic - WEB TTF/        # 108 files (TTF + woff + woff2)
│   ├── OTF/                     # 37 regular font variants
│   ├── TTF/                     # 37 regular font variants
│   ├── WEB OTF/                 # 74 files (OTF + woff2)
│   └── WEB TTF/                 # 111 files (TTF + woff + woff2)
├── app/                          # Legacy admin directory
│   └── admin/
├── qorkme/                       # Main Next.js application
│   ├── app/                      # Next.js 15 App Router
│   │   ├── [shortCode]/         # Dynamic redirect handler
│   │   │   └── route.ts
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── login/page.tsx   # Admin login page
│   │   │   └── page.tsx         # Admin dashboard
│   │   ├── api/                 # API routes
│   │   │   ├── admin/purge/     # Database purge endpoint
│   │   │   └── shorten/         # URL shortening endpoint
│   │   ├── auth/                # Authentication
│   │   │   └── callback/route.ts # OAuth callback handler
│   │   ├── result/              # Success pages
│   │   │   └── [id]/page.tsx
│   │   ├── favicon.ico          # Site favicon
│   │   ├── globals.css          # Global styles & design tokens
│   │   ├── layout.tsx           # Root layout
│   │   ├── not-found.tsx        # 404 page
│   │   └── page.tsx             # Homepage
│   ├── components/              # React components (22 total)
│   │   ├── admin/               # Admin components (3)
│   │   ├── bauhaus/             # Geometric decorative elements (1)
│   │   ├── cards/               # Card-based components (3)
│   │   └── ui/                  # Base UI components (5)
│   ├── docs/                    # Documentation
│   │   ├── DEPLOYMENT.md
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── UI_LAYOUT_GUIDE.md
│   │   └── VERCEL_SETUP.md
│   ├── lib/                     # Utilities and database clients
│   │   ├── config/              # Configuration
│   │   ├── shortcode/           # Short code generation (3 files)
│   │   ├── supabase/            # Database clients (3 files)
│   │   ├── theme.tsx
│   │   └── utils.ts
│   ├── public/                  # Static assets
│   │   ├── fonts/               # ZT Bros Oskon woff2 files (8 variants + README)
│   │   ├── apple-touch-icon.png # iOS home screen icon
│   │   ├── favicon-*.png        # Multi-resolution favicons
│   │   ├── favicon.svg          # Vector dot-matrix favicon
│   │   ├── icon-*.png           # PWA icons (192×192, 512×512)
│   │   ├── manifest.json        # PWA manifest
│   │   └── *.svg                # UI icons
│   ├── supabase/                # Database schema and setup
│   │   ├── SETUP_INSTRUCTIONS.md
│   │   └── schema.sql
│   ├── tests/                   # Vitest test suites (4 test files + setup)
│   │   ├── routes/              # API route tests
│   │   ├── shortcode/           # Short code generation tests
│   │   ├── supabase/            # Database client tests
│   │   ├── ui/                  # Component tests
│   │   └── setup.ts
│   ├── CHANGELOG.md             # Application changelog
│   ├── CLAUDE.md                # AI assistant guide
│   ├── README.md                # Application setup guide
│   └── *.config.*               # Configuration files
├── AGENTS.md                    # Agent contribution guidelines
├── CHANGELOG.md                 # Repository changelog
├── CLAUDE.md                    # Claude Code instructions
├── CODEX.md                     # Project codex
├── CODEX_PROJECT.md             # Detailed project brief
├── LICENSE                      # Apache License 2.0
├── MATRIX_BACKGROUND_PLAN.md    # Matrix background technical docs
├── README.md                    # This file (project overview)
├── TESTING_CHECKLIST.md         # Testing verification guide
├── TODO-2025-09-22.md           # Historical TODO list
└── vercel.json                  # Deployment configuration

38 directories, 568 files
```

## Key Features

- **Smart URL Shortening**: Memorable short codes using intelligent patterns
- **Retro Matrix Background**: Animated dot-matrix display with real-time clock and pulsing wave effects
- **Earthy Modern Design**: Warm parchment surfaces, terracotta primaries, and sage accents with soft depth
- **Theme Support**: Light/dark mode with smooth transitions
- **Analytics**: Comprehensive click tracking and device analytics
- **QR Codes**: Instant QR code generation for mobile sharing
- **Custom Aliases**: Personalized short codes with validation
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router and React 19
- **Language**: TypeScript 5 for full type safety
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Styling**: Tailwind CSS v4 with an earthy modern token palette
- **Typography**: ZT Bros Oskon for display work and Inter Regular (400) for body/UI text, with Inter Black (900) for buttons
- **Deployment**: Vercel with automatic CI/CD integration

## Design System

QorkMe features an earthy modern design system with:

- **Warm Neutral Palette**: Parchment backgrounds with terracotta and sage accents
- **ZT Bros Display + Inter Body**: ZT Bros Oskon for headings, Inter Regular (400) for comfortable body copy, Inter Black (900) for buttons, and Inter Heavy (900) only when ZT is unavailable
- **Card Architecture**: Elevated surfaces, soft organic shadows, and calm hover states
- **Responsive Design**: Mobile-first layouts tuned for comfortable reading
- **Accessibility**: WCAG 2.1 AA compliant with visible focus indicators and high contrast
- **Tagline-free Masthead**: Navigation header shows only the QorkMe wordmark for a clean top bar

See [`qorkme/docs/DESIGN_SYSTEM.md`](qorkme/docs/DESIGN_SYSTEM.md) for complete design specifications.

## Documentation

- **[Setup Guide](qorkme/README.md)**: Complete installation and configuration
- **[Design System](qorkme/docs/DESIGN_SYSTEM.md)**: Modern design specifications
- **[Vercel Setup](qorkme/docs/VERCEL_SETUP.md)**: Deployment with CI/CD configuration
- **[Deployment Guide](qorkme/docs/DEPLOYMENT.md)**: Multi-platform deployment options
- **[Changelog](qorkme/CHANGELOG.md)**: Version history and recent updates

## Production Deployment

The application is configured for Vercel deployment with:

- Automatic builds from GitHub commits
- Preview deployments for pull requests
- Security headers and performance optimization
- Environment variable management
- Custom domain support

## License

Licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Development

This project is optimized for modern development workflows with GitHub Actions CI/CD, comprehensive testing, and automated deployment. The codebase is designed for long-term scalability and professional use.

For detailed development instructions, environment setup, and deployment guides, see the main application documentation in the [`qorkme/`](qorkme/) directory.
