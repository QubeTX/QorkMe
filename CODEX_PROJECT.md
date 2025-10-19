# QorkMe Project Brief

## TL;DR
- Premium Next.js 15 + TypeScript URL shortener backed by Supabase, styled with glassmorphism aesthetics.
- Local development runs from `qorkme/` via `npm run dev`; environment variables mirror Supabase + deployment domains.
- Quality gate: lint, type-check, Prettier check, and full `next build` (CI matrix on Node 18 & 20 executes same steps).

## Project Overview
QorkMe delivers branded short links, QR codes, server-side analytics logging, and a premium UI suitable for production deployments. The app lives entirely inside the `qorkme/` directory and leans on Supabase PostgreSQL for data storage plus serverless API routes for URL shortening and redirect tracking. GitHub Actions pipelines handle linting, type checking, formatting verification, production builds, security audits, and optional Vercel preview deployments.

## Goals & Current Status
- ✅ Core URL shortening with custom aliases, QR export, and analytics logging (data is captured but no analytics dashboard is exposed to end users; admin console reveals aggregate metrics for the authorized GitHub admin only).
- ✅ Responsive, theme-aware front end using Tailwind CSS v4 tokens and bespoke glassmorphism.
- ✅ Supabase schema + setup guides checked into `supabase/`.
- ✅ Vitest suite protects the shortcode engine, `/api/shorten` route handlers, Supabase client factories, and the `UrlShortener` UI; pursue deeper integration coverage next (redirect analytics, Supabase RPCs, visual regressions).
- 📝 Backlog items captured in `CODEX.md` (e.g., font doc drift, Supabase RPC audit).

## Environment & Tooling
- Node.js ≥ 18.17 (CI covers 18.x and 20.x).
- npm (package-lock committed).
- Supabase project with URL, anon key, and service role key.
- Supabase GitHub OAuth configured for the admin console (`NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB`, default `REALEMMETTS`).
- Optional: Vercel CLI + secrets for preview deployments.

## Local Setup Snapshot
1. Copy `.env.local` using keys described in `README.md` and `supabase/SETUP_INSTRUCTIONS.md`.
2. `cd qorkme && npm install`.
3. Start dev server with `npm run dev`.
4. Supabase schema: apply `supabase/schema.sql` or follow the step-by-step guide in `supabase/SETUP_INSTRUCTIONS.md`.

## Build & Quality Commands
- `npm run lint` — ESLint.
- `npm run type-check` — TypeScript `tsc --noEmit`.
- `npm test` — Vitest suite spanning shortcode logic, Supabase clients, API route handlers, and UI interaction smoke tests (headless `vitest run`).
- `npx prettier --check .` (or `npm run format:check`).
- `npm run build` — Ensure Next.js build passes with env defaults.
- `npm run dev` — Local development server.

## CI/CD Notes
- `.github/workflows/ci.yml`: lint, type-check, prettier check, build (with mocked Supabase vars), bundle size report, security audit, and optional Vercel preview.
- `.github/workflows/deploy.yml.disabled`: reference deployment workflow kept disabled at root; within `qorkme/` the active deployment workflow lives in the project subdir.
- Vercel preview requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets.

## Key Directories & Files
- `qorkme/app/` — App Router pages (`page.tsx`, `[shortCode]/route.ts`, API routes, result view).
- `qorkme/components/` — UI components (cards, buttons, nav, animations, theme toggles).
- `qorkme/lib/shortcode/` — Short code generator, validator, reserved word list.
- `qorkme/lib/supabase/` — Client/server helpers and typed responses.
- `qorkme/docs/` — Deployment, design system, and Vercel setup guides.
- `qorkme/supabase/` — SQL schema and setup walkthrough.
- `ZT Bros Oskon 90s/` — Font family bundle used by the UI; mirrored copies exist in `qorkme/public/fonts/` as woff2 assets.
- `vercel.json` — Root-level headers and install instructions for deployments.

## Workspace File Tree (current as of 2025-10-19)
```
QorkMe/
├── AGENTS.md                  # workspace-specific agent guidance
├── CHANGELOG.md               # workspace change log
├── CLAUDE.md                  # Claude Code instruction set
├── CODEX_PROJECT.md           # <— this file
├── LICENSE                    # Apache License 2.0
├── MATRIX_BACKGROUND_PLAN.md  # matrix background technical docs
├── README.md                  # repo-level overview
├── TESTING_CHECKLIST.md       # testing verification guide
├── vercel.json                # deployment configuration
├── NEW_REDESIGN_SAMPLE/       # design component documentation
│   ├── INTERACTIVE_GRID_BACKGROUND.md
│   ├── MATRIX_DOCS.md
│   ├── SHIMMERING_TEXT_DOCS.md
│   └── qorkme.html
├── ZT Bros Oskon 90s/         # font source files (OTF/TTF/WEB variants)
└── qorkme/                    # main Next.js application
    ├── CHANGELOG.md           # application changelog
    ├── CLAUDE.md              # application-specific guidance
    ├── README.md              # application setup guide
    ├── app/                   # Next.js 15 App Router
    │   ├── [shortCode]/route.ts      # dynamic redirect handler
    │   ├── admin/
    │   │   ├── login/page.tsx        # admin login page
    │   │   └── page.tsx              # admin dashboard
    │   ├── api/
    │   │   ├── admin/purge/route.ts  # database purge endpoint
    │   │   └── shorten/route.ts      # URL shortening endpoint
    │   ├── auth/callback/route.ts    # OAuth callback handler
    │   ├── result/[id]/page.tsx      # success page
    │   ├── favicon.ico               # multi-resolution favicon
    │   ├── globals.css               # global styles & design tokens
    │   ├── layout.tsx                # root layout with fonts
    │   ├── not-found.tsx             # 404 page
    │   └── page.tsx                  # homepage
    ├── components/            # React components
    │   ├── admin/             # admin console components
    │   │   ├── AdminSignInButton.tsx
    │   │   ├── AdminSignOutButton.tsx
    │   │   └── ClearDatabaseButton.tsx
    │   ├── bauhaus/GeometricDecor.tsx
    │   ├── cards/             # card-based components
    │   │   ├── Card.tsx
    │   │   ├── FeatureCard.tsx
    │   │   └── MetricCard.tsx
    │   ├── ui/                # base UI components
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── interactive-grid-pattern.tsx
    │   │   ├── matrix.tsx
    │   │   └── shimmering-text.tsx
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
    ├── docs/                  # documentation
    │   ├── DEPLOYMENT.md
    │   ├── DESIGN_SYSTEM.md
    │   ├── UI_LAYOUT_GUIDE.md
    │   └── VERCEL_SETUP.md
    ├── lib/                   # utilities and helpers
    │   ├── config/
    │   ├── shortcode/         # short code generation
    │   │   ├── generator.ts
    │   │   ├── reserved.ts
    │   │   └── validator.ts
    │   ├── supabase/          # database clients
    │   │   ├── client.ts
    │   │   ├── server.ts
    │   │   └── types.ts
    │   ├── theme.tsx          # theme context provider
    │   └── utils.ts           # utility functions
    ├── public/                # static assets
    │   ├── fonts/             # ZT Bros Oskon woff2 files
    │   │   ├── ZTBrosOskon90s-Bold.woff2
    │   │   ├── ZTBrosOskon90s-BoldItalic.woff2
    │   │   ├── ZTBrosOskon90s-Italic.woff2
    │   │   ├── ZTBrosOskon90s-Medium.woff2
    │   │   ├── ZTBrosOskon90s-MediumItalic.woff2
    │   │   ├── ZTBrosOskon90s-Regular.woff2
    │   │   ├── ZTBrosOskon90s-SemiBold.woff2
    │   │   ├── ZTBrosOskon90s-SemiBoldItalic.woff2
    │   │   └── README.md
    │   ├── apple-touch-icon.png   # iOS home screen icon (180×180)
    │   ├── favicon-16x16.png      # browser tab icon
    │   ├── favicon-32x32.png      # retina browser tab icon
    │   ├── favicon-48x48.png      # Windows taskbar icon
    │   ├── favicon.svg            # vector favicon
    │   ├── icon-192.png           # PWA icon (192×192)
    │   ├── icon-512.png           # PWA icon (512×512)
    │   ├── manifest.json          # PWA manifest
    │   └── *.svg                  # SVG icons
    ├── supabase/              # database schema and setup
    │   ├── SETUP_INSTRUCTIONS.md
    │   └── schema.sql
    ├── tests/                 # Vitest test suites
    │   ├── routes/shorten-route.test.ts
    │   ├── shortcode/generator.test.ts
    │   ├── supabase/client.test.ts
    │   ├── ui/url-shortener.test.tsx
    │   └── setup.ts
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── node_modules/          # generated - not checked in
    ├── .next/                 # generated - not checked in
    └── .vercel/               # generated - not checked in
```
*Generated directories such as `node_modules/`, `.next/`, and `.vercel/` change after installs/builds and are not version controlled.*

## Known Risks & TODOs
- Expand automated testing beyond current unit/UI suites to cover redirect edge cases, analytics persistence, and Supabase RPC behaviors.
- Keep font licensing notes aligned between `ZT Bros Oskon 90s/` and `public/fonts/README.md`.
- Monitor Supabase rate limits; redirect handler currently uses a simple in-memory cache.

## References
- Primary docs: `qorkme/README.md`, `qorkme/docs/`, `qorkme/supabase/SETUP_INSTRUCTIONS.md`.
- Architectural deep dive: `qorkme/CLAUDE.md`.
- Operational tips & backlog: `CODEX.md` at workspace root.
