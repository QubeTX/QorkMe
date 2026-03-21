# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from this `qorkme/` directory:

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (strict mode)
npm test             # Vitest suite (single run)
npm run test:watch   # Vitest watch mode
npm run format       # Prettier write
npm run format:check # Prettier verify (CI enforces this)
```

Run a single test file: `npx vitest run tests/shortcode/generator.test.ts`

## Tailwind CSS v4 — Critical Gotchas

This project uses Tailwind v4 via `@tailwindcss/postcss`. No `tailwind.config` file — tokens are defined inline via `@theme` in `globals.css`.

### Flexbox margin collapse

When a parent has `items-center justify-center`, margins on children are collapsed. Use `gap` on the flex parent instead:

```jsx
// WRONG — margin ignored under items-center
<main className="flex items-center justify-center">
  <div className="mt-32">...</div>
</main>

// RIGHT — use gap
<main className="flex flex-col items-center justify-center gap-32">
  ...
</main>
```

### Utility generation failures

Large padding/margin values (>12) and some standard classes (`px-6`, `mx-4`) may not generate in v4. Use inline styles as fallback:

```jsx
// May not work: <div className="px-6">
// Always works: <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
```

### Responsive rendering

For components needing different props at different breakpoints, render separate instances:

```jsx
<div className="md:hidden">
  <Component size={5} cols={32} />   {/* Mobile */}
</div>
<div className="hidden md:block">
  <Component size={8} cols={50} />   {/* Desktop */}
</div>
```

## Design System

Earthy modern aesthetic. Full spec in `docs/DESIGN_SYSTEM.md`. Tokens live in `app/globals.css` as CSS custom properties.

**Palette:**

- Parchment surfaces: `#f6f1e8`, `#f2e7d6`
- Terracotta primary: `#c4724f`
- Sage accent: `#5f7d58`
- Dark mode swaps to espresso tones via same token names

**Typography:**

- **Makira Sans Serif** — sole font site-wide, scoped via `.font-makira` class on page wrappers
  - Regular (400) — body text, UI labels, numbers
  - Medium (500) — emphasized text, form labels
  - SemiBold (600) — headings, strong UI elements
  - Bold (700) — bold headings, smaller buttons
  - ExtraBold (800) — heavy emphasis
  - Black (900) — display text, prominent CTAs, via `--weight-ui-button` CSS variable

**Transitions:** 140ms (fast), 240ms (base), 420ms (slow). Spacing: 8px grid.

## Architecture Notes

### Path alias

`@/` maps to `qorkme/` root (configured in `tsconfig.json` and `vitest.config.ts`).

### Admin console

- Route: `/admin` (linked from footer)
- Auth: GitHub OAuth via Supabase, gated to `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` username
- `lib/admin/auth.ts` — authorization logic
- `lib/config/admin.ts` — admin username config
- `app/auth/callback/route.ts` — OAuth callback handler
- Admin API routes: `api/admin/purge`, `api/admin/health`, `api/admin/links/[id]`

### Matrix display

- `components/MatrixDisplay.tsx` — main component with title + real-time 12-hour clock
- `components/ui/matrix.tsx` — dot-matrix rendering engine
- **Deterministic rendering** — no `Math.random()` to avoid hydration mismatches
- Dual render paths: desktop (`createTitleFrame`, `createTimeFrame`) and mobile (`createTitleFrameMobile`, `createTimeFrameMobile`)
- Mobile: "Qork" at 5px cells/26 cols, time without seconds at 3px/50 cols
- Desktop: "Qork.Me" at 8px cells/50 cols, time with seconds at 6px/66 cols

### Interactive grid background

- `components/ui/interactive-grid-pattern.tsx` — SVG grid with noise-masked opacity and hover glow
- **Pointer events pattern** (critical): container elements use `pointer-events-none`, interactive elements (cards, forms, buttons, links, footer) use `pointer-events-auto`

### Short code algorithm

`lib/shortcode/generator.ts` — consonant-vowel alternating patterns for memorable 4-char codes. Collision detection with retry, reserved word filtering (`lib/shortcode/reserved.ts`), case-insensitive via database generated columns.

## Testing

Vitest with two environments configured in `vitest.config.ts`:

- **Node** (default) — API routes, shortcode logic, Supabase clients
- **jsdom** — UI component tests (auto-selected for `tests/ui/` via `environmentMatchGlobs`)

Shared setup: `tests/setup.ts`. Test files mirror source paths (e.g., `lib/shortcode/generator.ts` → `tests/shortcode/generator.test.ts`).

## Prettier

100-character line width, 2-space indent, single quotes, semicolons, Unix line endings. CI runs `format:check` — always run `npm run format` before committing.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_SITE_URL=https://qork.me
NEXT_PUBLIC_SHORT_DOMAIN=qork.me
NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB=REALEMMETTS
```

## CI/CD

GitHub Actions at root `.github/workflows/ci.yml` — multi-node (18.x, 20.x), lint, type-check, Prettier, build, npm audit, Trufflehog, bundle analysis. Production deploy on main branch pushes via Vercel CLI. Root `vercel.json` points builds to this `qorkme/` subdirectory.

## Changelogs

Update BOTH `../CHANGELOG.md` (root) and `CHANGELOG.md` (this directory) on every change.
