# Repository Guidelines

## Project Structure & Module Organization
Work inside `qorkme/`, the Next.js 15 app. Routes live under `qorkme/app/`: `app/page.tsx` renders the landing form, `[shortCode]/route.ts` handles redirects, and `api/shorten/route.ts` powers shortening. Shared UI belongs in `qorkme/components/`, shortcode helpers in `qorkme/lib/shortcode/`, and Supabase clients in `qorkme/lib/supabase/`. Tests mirror source paths in `qorkme/tests/`, environment docs live in `qorkme/supabase/`, and licensed fonts stay in `ZT Bros Oskon 90s/` with deployable copies under `qorkme/public/fonts/`.

## Build, Test, and Development Commands
Run all tooling from `qorkme/`:
- `npm run dev` starts the Next.js dev server on http://localhost:3000.
- `npm run lint` applies the project ESLint rules.
- `npm run type-check` uses `tsc --noEmit` for strict type coverage.
- `npm test` (or `npm run test:watch`) executes the Vitest suite.
- `npm run format` and `npx prettier --check .` enforce formatting.
- `npm run build` creates the CI production bundle.

## Coding Style & Naming Conventions
Code in TypeScript + React 19 with Tailwind utilities. Prettier enforces 2-space indents and single quotes; run the formatter before committing. Components stay PascalCase (`UrlShortener.tsx`), hooks/utilities are camelCase, and route directories remain lowercase. Use the `@/` alias for shared imports. Follow the earthy modern system in `qorkme/docs/DESIGN_SYSTEM.md`: body copy in Inter Regular (400), CTA buttons via Inter Black (900) and `--weight-ui-button`, titles in `ZT Bros Oskon` unless unavailable.

## Testing Guidelines
Write Vitest specs under `qorkme/tests/` using the same subpath as the source file (`lib/shortcode/generator.test.ts`). Reuse `qorkme/tests/setup.ts` for globals. Cover shortcode generation, API edge cases, Supabase client error handling, and UI flows with DOM assertions. Run `npm test` before submitting changes and capture failing snapshots when fixing regressions.

## Commit & Pull Request Guidelines
Use imperative commit subjects (`Refresh admin metrics`). Update both `CHANGELOG.md` and `qorkme/CHANGELOG.md` on every change, stamping the date and briefly noting scope. PRs describe intent, list local commands executed, link issues or tasks, and attach screenshots or recordings for UI updates. Document any environment variable updates, especially `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SHORT_DOMAIN`, and service keys.

## Security & Configuration Tips
Store credentials in `.env.local`; never commit Supabase tokens. Mirror schema edits in `qorkme/supabase/schema.sql` and keep RLS policies intact. Review `vercel.json` and `.github/workflows/` after configuration shifts. When moving fonts, update `qorkme/public/fonts/README.md` so licensing stays accurate and deployment bundles remain compliant.
