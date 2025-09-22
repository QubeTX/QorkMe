# QorkMe Workspace Agent Guide

## Project Context
- This repo hosts **QorkMe**, a premium URL shortener built with Next.js 15.5, React 19, TypeScript, Tailwind CSS v4 tokens, and Supabase PostgreSQL.
- Active application code lives in `qorkme/`; root-level assets (fonts, deployment config, instruction files) support that subproject.
- For architecture nuance, read `qorkme/README.md` and `qorkme/CLAUDE.md` before significant edits. `CODEX_PROJECT.md` carries the current workspace summary and file tree.

## Working Agreements
- Maintain both `CHANGELOG.md` files: the workspace log at repo root (this directory) and the existing `qorkme/CHANGELOG.md` when you touch application code.
- Preserve the glassmorphism visual language (deep midnight blues, shimmering gradients, ZT Bros Oskon typography). Consult `qorkme/docs/DESIGN_SYSTEM.md` when altering UI.
- Treat Supabase schema (`qorkme/supabase/schema.sql`) and setup guide as canonical; coordinate API or DB changes with those docs.
- Fonts under `ZT Bros Oskon 90s/` are licensed assets—never remove or rename files without updating `public/fonts/README.md` and deployment notes.

## Edit & Review Checklist
1. Re-read relevant docs (`qorkme/CLAUDE.md`, design/system docs) tied to the area you plan to modify.
2. Sync environment secrets in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHORT_DOMAIN`).
3. Make changes inside `qorkme/` unless explicitly working on workspace-level tooling/docs.
4. Update documentation alongside code (README sections, Supabase guides, design notes) if behavior shifts.
5. Record your updates in `CHANGELOG.md` (root) plus `qorkme/CHANGELOG.md` when app logic/UI changes.

## Quality Gates (run from `qorkme/`)
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npx prettier --check .` (or `npm run format:check`)
- `npm run build`
- Vitest currently exercises the shortcode engine, `/api/shorten` route logic, Supabase client factories, and the `UrlShortener` UI—extend coverage alongside new features.

## Deployment & CI Notes
- CI pipeline (`qorkme/.github/workflows/ci.yml`) mirrors the commands above, adds bundle-size echo, npm audit, and optional Vercel preview deploy.
- Root-level `.github/workflows/ci.yml` should stay aligned with the project pipeline; leave `deploy.yml.disabled` untouched unless re-enabling root deploy automation.
- Preview deploys require `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`; avoid committing secrets.

## Supabase & Data Considerations
- Schema + RLS policies reside in `qorkme/supabase/schema.sql`; helper walkthrough in `supabase/SETUP_INSTRUCTIONS.md`.
- Redirect handler expects Supabase RPC `increment_click_count` and tables (`urls`, `clicks`, `reserved_words`) to exist.
- Any throttle/cache adjustment in `app/[shortCode]/route.ts` should respect current analytics logging (failures must not break redirects).

## Useful References
- UI components: `qorkme/components/`
- Short code engine: `qorkme/lib/shortcode/`
- Supabase clients: `qorkme/lib/supabase/`
- Deployment doc set: `qorkme/docs/`
- Fonts in production: `qorkme/public/fonts/`

> Keep this file updated as workflows evolve. Treat it as the first stop for any new agent picking up QorkMe work.
