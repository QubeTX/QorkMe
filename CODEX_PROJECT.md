# QorkMe Project Brief

## TL;DR
- Premium Next.js 15 + TypeScript URL shortener backed by Supabase, styled with glassmorphism aesthetics.
- Local development runs from `qorkme/` via `npm run dev`; environment variables mirror Supabase + deployment domains.
- Quality gate: lint, type-check, Prettier check, and full `next build` (CI matrix on Node 18 & 20 executes same steps).

## Project Overview
QorkMe delivers branded short links, QR codes, server-side analytics logging, and a premium UI suitable for production deployments. The app lives entirely inside the `qorkme/` directory and leans on Supabase PostgreSQL for data storage plus serverless API routes for URL shortening and redirect tracking. GitHub Actions pipelines handle linting, type checking, formatting verification, production builds, security audits, and optional Vercel preview deployments.

## Goals & Current Status
- ✅ Core URL shortening with custom aliases, QR export, and analytics logging (data is captured but no analytics dashboard is exposed to end users).
- ✅ Responsive, theme-aware front end using Tailwind CSS v4 tokens and bespoke glassmorphism.
- ✅ Supabase schema + setup guides checked into `supabase/`.
- ✅ Vitest suite protects the shortcode engine, `/api/shorten` route handlers, Supabase client factories, and the `UrlShortener` UI; pursue deeper integration coverage next (redirect analytics, Supabase RPCs, visual regressions).
- 📝 Backlog items captured in `CODEX.md` (e.g., font doc drift, Supabase RPC audit).

## Environment & Tooling
- Node.js ≥ 18.17 (CI covers 18.x and 20.x).
- npm (package-lock committed).
- Supabase project with URL, anon key, and service role key.
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

## Workspace File Tree (abridged)
```
QorkMe/
├── AGENTS.md                  # workspace-specific agent guidance
├── CHANGELOG.md               # workspace change log
├── CODEX.md                   # operational guidance for Codex
├── CODEX_PROJECT.md           # <— this file
├── README.md                  # repo-level overview
├── vercel.json                # deployment configuration
├── chatgpt-5-pro-FEEDBACK.md  # user feedback log
├── CLAUDE.md                  # legacy instruction set
├── ZT Bros Oskon 90s/         # font source files (OTF/TTF/WEB)
├── qorkme/
│   ├── CHANGELOG.md
│   ├── README.md
│   ├── app/
│   │   ├── api/shorten/route.ts
│   │   ├── [shortCode]/route.ts
│   │   ├── result/[id]/page.tsx
│   │   ├── layout.tsx, page.tsx, not-found.tsx, globals.css, favicon.ico
│   ├── components/
│   │   ├── ui/{Button.tsx, Input.tsx}
│   │   ├── cards/{Card.tsx, FeatureCard.tsx, MetricCard.tsx}
│   │   ├── bauhaus/GeometricDecor.tsx
│   │   └── *root components (UrlShortener, ThemeToggle, etc.)*
│   ├── docs/{DESIGN_SYSTEM.md, DEPLOYMENT.md, VERCEL_SETUP.md}
│   ├── lib/
│   │   ├── shortcode/{generator.ts, validator.ts, reserved.ts}
│   │   └── supabase/{client.ts, server.ts, types.ts}
│   ├── tests/
│   │   ├── routes/shorten-route.test.ts
│   │   ├── shortcode/generator.test.ts
│   │   ├── supabase/client.test.ts
│   │   ├── ui/url-shortener.test.tsx
│   │   └── setup.ts
│   ├── vitest.config.ts
│   ├── public/
│   │   ├── fonts/*.woff2
│   │   └── svg assets (globe.svg, window.svg, etc.)
│   ├── supabase/{schema.sql, SETUP_INSTRUCTIONS.md}
│   ├── eslint.config.mjs, next.config.ts, package.json, tsconfig.json
│   └── node_modules/, .next/, .vercel/ (generated artifacts — not checked in)
└── .github/workflows/{ci.yml, deploy.yml.disabled}
```
*Generated directories such as `qorkme/node_modules/` and `.next/` change after installs/builds; update this tree if new source directories are added.*

## Known Risks & TODOs
- Expand automated testing beyond current unit/UI suites to cover redirect edge cases, analytics persistence, and Supabase RPC behaviors.
- Keep font licensing notes aligned between `ZT Bros Oskon 90s/` and `public/fonts/README.md`.
- Monitor Supabase rate limits; redirect handler currently uses a simple in-memory cache.

## References
- Primary docs: `qorkme/README.md`, `qorkme/docs/`, `qorkme/supabase/SETUP_INSTRUCTIONS.md`.
- Architectural deep dive: `qorkme/CLAUDE.md`.
- Operational tips & backlog: `CODEX.md` at workspace root.
