# Repository Guidelines

## Project Structure & Module Organization
Work from `qorkme/`, the Next.js 15 app. Key routes live in `qorkme/app/`, including `app/page.tsx` (landing form), `app/[shortCode]/route.ts` (redirects), and `app/api/shorten/route.ts` (shortening API). Shared UI stays in `qorkme/components/`, while shortcode logic sits in `qorkme/lib/shortcode/` and Supabase clients in `qorkme/lib/supabase/`. Tests mirror these paths in `qorkme/tests/`. Supabase schema plus setup guidance is under `qorkme/supabase/`. Licensed fonts remain in `ZT Bros Oskon 90s/` with deployable copies in `qorkme/public/fonts/`.

## Build, Test, and Development Commands
Run all commands inside `qorkme/`:
- `npm run dev` — Launch the Next.js dev server on localhost:3000.
- `npm run lint` — Check code with the project ESLint rules.
- `npm run type-check` — Run `tsc --noEmit` in strict mode.
- `npm test` / `npm run test:watch` — Execute Vitest suites once or in watch mode.
- `npm run format` / `npx prettier --check .` — Apply or verify Prettier formatting.
- `npm run build` — Produce the production bundle used in CI/CD.

## Coding Style & Naming Conventions
Use TypeScript, React 19, and Tailwind with Prettier enforcing 2-space indenting and single quotes. Components remain PascalCase (`UrlShortener.tsx`), hooks/utilities stay camelCase, and route directories stay lowercase. Import shared modules with the `@/` alias. Follow the earthy modern system in `qorkme/docs/DESIGN_SYSTEM.md`—keep body copy in Inter Light (weight 300), reserve Inter 900 only when titles cannot use `ZT Bros Oskon`, and avoid any other families.

## Testing Guidelines
Place Vitest files in `qorkme/tests/` mirroring the source path (`lib/shortcode/generator.test.ts`). Reuse `qorkme/tests/setup.ts`, cover shortcode generation, API routes, Supabase clients, and UI forms with DOM assertions. Run `npm test` before opening a PR.

## Commit & Pull Request Guidelines
Write imperative commit subjects (e.g., `Refresh admin metrics`). Update both `CHANGELOG.md` and `qorkme/CHANGELOG.md` for every change. PRs explain intent, list commands run, link issues/tasks, and attach screenshots or recordings for UI updates. Document environment variable changes such as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SHORT_DOMAIN`, and admin GitHub handles.

## Security & Configuration Tips
Keep secrets in `.env.local` and never commit Supabase keys or service tokens. Align schema edits with `qorkme/supabase/schema.sql`, preserving RLS policies and the `reserved_words` table. After deployment adjustments, review `vercel.json` and GitHub workflows. When moving fonts, update `qorkme/public/fonts/README.md` so licensing remains accurate.
