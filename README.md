# QorkMe - Modern URL Shortener

A professional, scalable URL shortener built with Next.js 15, TypeScript, and Supabase. Features a clean card-based design with natural earth tones, intelligent short code generation, and comprehensive analytics tracking.

## Quick Start

Visit the application directory for complete setup instructions:

```bash
cd qorkme/
```

See [`qorkme/README.md`](qorkme/README.md) for detailed installation, configuration, and deployment instructions.

## Project Structure

```
QorkMe/
├── qorkme/                    # Main application directory
│   ├── app/                   # Next.js 15 App Router
│   ├── components/            # React components
│   ├── lib/                   # Utilities and database clients
│   ├── docs/                  # Complete documentation
│   ├── supabase/             # Database schema and setup
│   └── README.md             # Comprehensive setup guide
├── README.md                 # This file (project overview)
└── LICENSE                   # Apache 2.0 license
```

## Key Features

- **Smart URL Shortening**: Memorable short codes using intelligent patterns
- **Modern Design**: Clean card-based SF startup aesthetic with natural colors
- **Theme Support**: Light/dark mode with smooth transitions
- **Analytics**: Comprehensive click tracking and device analytics
- **QR Codes**: Instant QR code generation for mobile sharing
- **Custom Aliases**: Personalized short codes with validation
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router and React 19
- **Language**: TypeScript 5 for full type safety
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Typography**: ZT Bros font family (Gatha, Grafton, Mono)
- **Deployment**: Vercel with automatic CI/CD integration

## Design System

QorkMe features a modern card-based design system with:

- **Natural Color Palette**: Sage green, warm beige, terracotta, and forest brown
- **ZT Bros Typography**: Professional font system with Inter fallbacks
- **Card Architecture**: Elevated components with soft shadows and interactions
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive keyboard navigation

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
