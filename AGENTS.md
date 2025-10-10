# Repository Guidelines

## Project Structure & Module Organization
QorkMe’s Next.js 15 app lives in `qorkme/`; root-level files cover meta docs, fonts, and CI configs. Key directories:
- `qorkme/app/` — App Router routes, including `/api/shorten` and redirect handlers.
- `qorkme/components/` — Shared UI (preserve glassmorphism styling defined in `qorkme/docs/DESIGN_SYSTEM.md`).
- `qorkme/lib/shortcode/` & `qorkme/lib/supabase/` — Business logic and typed clients.
- `qorkme/tests/` — Vitest specs mirroring the source tree.
- `qorkme/supabase/` — Schema + setup instructions; sync schema updates here.
Licensed font sources sit in `ZT Bros Oskon 90s/`; ship webfont copies via `qorkme/public/fonts/`.

## Build, Test, and Development Commands
Run all commands from `qorkme/`:
- `npm run dev` – Start the local Next.js dev server.
- `npm run lint` – ESLint using the project config.
- `npm run type-check` – TypeScript `--noEmit` verification.
- `npm test` – Vitest suite (UI, API, Supabase helpers).
- `npx prettier --check .` – Enforce formatting; fix with `--write` before committing.
- `npm run build` – Production build parity with CI.

## Coding Style & Naming Conventions
TypeScript + React with Prettier formatting (2-space indent, single quotes). Keep components PascalCase (`UrlShortener.tsx`), hooks/utilities camelCase, and route segment folders lowercase. Favor Tailwind CSS tokens already defined; extend via `qorkme/docs/DESIGN_SYSTEM.md` when adding styles. Import paths should use the configured `@/` alias. Document complex logic with short comments; avoid noise.

## Testing Guidelines
Write Vitest specs alongside new features under `qorkme/tests/`, matching the source path (`lib/shortcode/generator.test.ts`, etc.). Use `.test.ts`/`.test.tsx` suffixes and reuse shared setup from `qorkme/tests/setup.ts`. Cover edge cases for Supabase interactions, redirects, and shortcode validation; expand mocks when adding RPCs. UI changes need DOM assertions or screenshot references to verify state.

## Commit & Pull Request Guidelines
Commits use short, imperative subjects (`Update redirect caching`). For every change, update both `CHANGELOG.md` and `qorkme/CHANGELOG.md` before you commit so release notes stay accurate. PRs should describe intent, list testing performed (commands above), link issues/tasks, and attach before/after screenshots or recordings for UI updates. Confirm environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SHORT_DOMAIN`, etc.) are documented when configurations change.

## Security & Configuration Tips
Use `.env.local` for secrets; never commit Supabase keys or Vercel tokens. Align schema edits with `qorkme/supabase/schema.sql` and keep RLS policies intact. Preserve licensed font filenames and update `qorkme/public/fonts/README.md` if assets move. Review `vercel.json` and GitHub workflows after modifying deployment behavior.
