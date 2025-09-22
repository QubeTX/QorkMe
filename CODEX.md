# CODEX.md

This file is the working guide for Codex when operating inside the QorkMe repository.

## Role & Environment
- You are Codex (GPT-5) working via the Codex CLI in `/Volumes/X9 Pro/code/QorkMe`
- Files under `qorkme/` hold the Next.js 15 + TypeScript implementation of QorkMe
- Root-level assets: `README.md` (overview), `vercel.json` (deployment headers), font bundle `ZT Bros Oskon 90s`
- Git worktree may already contain user edits; never revert existing work unless explicitly instructed

## Key Instruction Sources
- `CLAUDE.md`: Legacy guidance saying the project was not yet started; **outdated** relative to current codebase
- `qorkme/CLAUDE.md`: Current authoritative instructions for Claude, detailing architecture, stack, and workflows
- `qorkme/docs/`: Comprehensive documentation (`DESIGN_SYSTEM.md`, `VERCEL_SETUP.md`, `DEPLOYMENT.md`)
- `qorkme/supabase/SETUP_INSTRUCTIONS.md`: Supabase schema + setup procedure (mirrors `schema.sql`)

## Project Snapshot
- Production-ready URL shortener with analytics, QR codes, and theme-aware UI
- Tech stack: Next.js 15.5.3 (App Router, React 19), TypeScript 5, Tailwind CSS v4 tokens, Supabase (PostgreSQL)
- Design: Premium glassmorphism dark mode (primary) with sandstone light theme fallback, ZT Bros Oskon typography
- Deployment: Vercel (see `vercel.json`, GitHub Actions `ci.yml` and `deploy.yml`)
- Database: `supabase/schema.sql` sets up `urls`, `clicks`, `reserved_words`, optional tagging tables, RLS policies, helper functions

## Code Architecture Highlights
- `app/page.tsx`: Landing page composed from shared components, wired to `UrlShortener`
- `app/api/shorten/route.ts`: POST transforms long URL → short code (custom alias support); GET checks alias availability
- `app/[shortCode]/route.ts`: Edge-friendly redirect with in-memory cache and analytics tracking via Supabase RPC `increment_click_count`
- `components/`: Card-based UI system (`cards/`, `ui/`, navigation, theme toggles, url workflow components)
- `lib/shortcode/`: Generator (consonant-vowel bias), validator, reserved words list
- `lib/supabase/`: Client/server helpers and types for Supabase access
- `public/fonts/`: Bundled ZT Bros Oskon woff2 assets (README still references older Gatha/Grafton plan)
- `.github/workflows/`: CI pipeline (lint/typecheck/build/audit + deploy)

## Ops & Deployment Notes
- Environment vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHORT_DOMAIN`
- Vercel secrets required for CI: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Supabase extensions expected: `uuid-ossp`, `pg_trgm`
- Fonts licensed; ensure any new assets respect existing naming and licensing

## Observations & Gotchas
- `CLAUDE.md` at repo root predates implementation; rely on `qorkme/CLAUDE.md` for accurate state
- `public/fonts/README.md` does not reflect current Oskon font bundle (consider updating if needed)
- Redirect handler keeps in-memory cache (`Map`) which resets per deployment; future scaling may require Redis/Upstash
- Analytics writes are best-effort; failures should stay silent to avoid breaking redirects (already in place)
- Generator logs `Increasing short code length ...` to console; may want structured logging later

## Codex Task Log
- Backlog
  - Review `public/fonts/README.md` accuracy vs actual assets
  - Audit Supabase RPC functions in `schema.sql` for alignment with redirect handler assumptions
  - Confirm client-side theme tokens align with latest `DESIGN_SYSTEM.md`
  - Evaluate test coverage (currently no automated tests beyond lint/type-check)
- In Progress
  - None
- Completed
  - Initial repository reconnaissance (docs, architecture, instruction sets)

## Next Steps When Picking Up Work
1. Re-read `qorkme/CLAUDE.md` before major changes to honor existing guidance
2. Check `qorkme/CHANGELOG.md` to remain consistent with current visual direction (premium dark glassmorphism)
3. Coordinate backend changes with Supabase schema + instructions to avoid drift
4. Update this `CODEX.md` as new discoveries or tasks emerge

