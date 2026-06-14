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
npm run ci           # Full local CI: lint + type-check + format:check + test + build
```

**Always run `npm run ci` before committing or pushing** to catch issues locally before they hit GitHub Actions.

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

### CSS Modules beat Tailwind responsive utilities

An unlayered `.module.css` rule that sets `display` overrides Tailwind's layered `hidden`/`md:hidden` regardless of source order. For an element that carries a CSS-module class **and** needs responsive show/hide, do it in the module (`@media { display }`), not Tailwind classes. (Bit the admin table: `.mList { display: flex }` ignored `md:hidden`, so the desktop table and mobile cards both rendered at once.)

## Design System — full QubeTX v3.2.1

QorkMe runs on the **full QubeTX design system** (dark-only, void `#05070f`, canonical blue→violet). Full spec + measured WCAG ratios in `docs/DESIGN_SYSTEM.md`. The vendored kit (tokens, motion library, components, agent docs) lives at `docs/qubetx-design-system/`; **live spec: https://www.qubetx.com/design-system ; stable kit permalink: https://www.qubetx.com/qubetx-design-system.zip** — cross-check against the live version, re-download the zip to refresh the vendored kit.

**Key facts:**

- **Dark only** — no light mode, no theme toggle.
- Structural tokens (surfaces `#0d1117`/`#111827`, hairline borders `#1a2236`/`#2c3a5c`, text `#fff`/`#94a3b8`/`#76869f`) are QubeTX verbatim — never fork. Borders do elevation work; no large shadows.
- QubeTX accent: blue `#0066FF` action (~4.3:1 — a UI accent for borders/buttons/icons, not body text), hover `#3385ff`, arrival flash `#3385ff` (≈5.7:1 AA on void), gradient/LED ramp `#2563eb → #7c3aed` (blue→violet), violet accent `#7c3aed` (hover `#9d5cf5`), success `#22c55e`. Semantics: warning `#d6a52e`, error `#d07a66`, info `#7aa3d0` (void-tuned).
- **Typography**: Makira (400–900, Black 900 uppercase for headings/wordmarks) + IBM Plex Mono (the technical register: labels, statuses, buttons via `.btn`, short URLs, `.mono-label` utility). Sentence case in storage, UPPERCASE via CSS.
- **Motion doctrine** (see `docs/qubetx-design-system/MOTION_GUIDE.md` + `SKILL.md`): one owner per animated property; anime.js only via `lib/motion/anime.ts`; **no ResizeObserver** (use `lib/pretext/resizeCoordinator`); IO triggers, Lenis scrubbing; reduced motion = final state instantly; label changes ride the slot roll (`lib/motion/SlotRoll`); copy confirmation = `COPIED` flash, **never toasts**.
- **Pretext**: wrapping body copy uses `PretextBlock` (min-height reservation); `shrinkwrap` only on left-aligned blocks; never measure letter-spaced mono labels. `@chenglou/pretext` is transpiled via `next.config.ts`.
- Entrances: `LoadSequence` choreography from first paint (`html[data-loading]` FOUC guard, 3s failsafe). BootScreen is vendored but unmounted.

## Architecture Notes

### Path alias

`@/` maps to `qorkme/` root (configured in `tsconfig.json` and `vitest.config.ts`).

### Supabase

- **Project ID**: `gzsdakrkbirevpxcadrg`
- **MCP access**: Full database access via Supabase MCP server (execute SQL, apply migrations, view logs, etc.)
- **Clients**: `lib/supabase/server.ts` (`createServerClientInstance` for cookie auth, `createAdminClient` for service_role, `createAnonClient` for cookie-free work inside `after()` callbacks); `lib/supabase/client.ts` (browser)
- **Migrations**: `supabase/migrations/` (applied via MCP; `supabase/schema.sql` is the consolidated mirror)
- **Hot paths**: shorten = 1 RPC (`get_or_create_short_url` v2 — candidates array, atomic duplicate-return-or-insert); redirect = 1 RPC (`increment_click_count`) + click insert via Next 15 `after()`; admin health = 1 RPC (`admin_health_stats`, service-role only); admin analytics = 1 RPC (`admin_analytics`, service-role only)
- **Click metrics**: `urls.click_count` is a denormalized lifetime counter (bumped every redirect); the `clicks` table holds detailed per-event rows (device/time), sparse for pre-2026-06-12 redirects (fire-and-forget before the `after()` path). Admin distinguishes **total clicks** (`admin_health_stats().total_click_count` = `sum(click_count)`) from **tracked clicks** (clicks-table rows) — don't conflate them.

### Admin console

- Route: `/admin` (linked from footer), login at `/admin/login`
- Auth: GitHub OAuth via Supabase, gated to `NEXT_PUBLIC_SUPABASE_ADMIN_GITHUB` username (default: `REALEMMETTS`)
- `lib/admin/auth.ts` — `verifyAdminAuth()` authorization logic
- `lib/config/admin.ts` — admin username config
- `app/auth/callback/route.ts` — OAuth callback handler
- Admin API routes (all use service_role, bypassing RLS):
  - `api/admin/health` — database status, counts, latency
  - `api/admin/links` — paginated URL listing with sort/order
  - `api/admin/links/[id]` — individual link toggle/delete
  - `api/admin/purge` — wipe all data (keeps schema)

### Matrix / LED surfaces (canvas, kit architecture)

- `components/effects/MatrixDisplay.tsx` — kit LED word board (anime.js sweeps, blue→violet LUT). 404 `404/NOT.FOUND`, login `SECURE/ACCESS`. **No longer the home wordmark** — the home `QORK.ME` is now a Makira Black blue→violet gradient headline in `components/sections/Hero.tsx`.
- `components/effects/MatrixClock.tsx` — QorkMe live 12-hour LED clock on the kit dotFont/canvas architecture; only changed dots animate per tick. `seconds` prop; dual instance for mobile (no seconds).
- `lib/motion/dotFont.ts` — 5×7 bitmap font (QorkMe divergence: digits + colon added).
- Canvas components size from their **container** (give wrappers explicit width/height) via `resizeCoordinator`; IO-paused offscreen; reduced motion renders static; client-only (no hydration surface).

### Dot-field background

- `components/effects/DotGrid.tsx` — canvas dot field (blue→violet ramp), listens on **window** for pointer swells, so it never blocks clicks and the old pointer-events dance is unnecessary. `firePulse({x, y, strength})` fires a field-wide ripple — the shortener fires one when a link is created.

### Short code algorithm

`lib/shortcode/generator.ts` — consonant-vowel alternating patterns for memorable 4-char codes. `generateCandidates(count, minLength)` emits a shortest-first batch (4 chars while the namespace has room, +1 char as it fills, timestamp last resort); the `get_or_create_short_url` RPC walks the batch atomically (duplicate detection + reserved filtering + availability + insert in ONE round trip). Reserved words: `lib/shortcode/reserved.ts` is canonical, mirrored in the DB `reserved_words` table.

## qork CLI & public API

- **`qork`** is a separate cross-platform Rust CLI (repo **QubeTX/qork**, `cargo-dist` + crates.io) that shortens URLs via this site's API. The binary lives in its own repo; this site only hosts the install surface + the API it calls.
- **`app/install/page.tsx`** — the install/usage/downloads page, built from the vendored `components/terminal/` kit (`InstallBlock`, `TerminalFrame`, `CommandTable`, `DownloadCard`) + `LatestVersion.tsx` (a client island that fetches the latest release tag). Linked from the home hero `$ qork "url"` line and the footer "qork CLI" link.
- **`public/install.sh` + `public/install.ps1`** — branded wrappers (`qork.me/install.sh|ps1`) that pass through to `github.com/QubeTX/qork/releases/latest/download/qork-installer.{sh,ps1}`. **`public/llms.txt`** — agent guide served at `qork.me/llms.txt`. These static `public/` files (and the `/install` route) take precedence over the `[shortCode]` redirect.
- **qork is at v1.0.1** (GitHub Releases + crates.io). Each release ships a **native-installer matrix** under `github.com/QubeTX/qork/releases/latest/download/`: **4 Windows** (`*-pc-windows-msvc.msi` Global/per-machine, `*-corporate.msi` per-user/no-admin, `*-setup.exe` + `*-corporate-setup.exe` Inno EXEs; `qork update` re-runs the matching one via the `HKCU\Software\Qork\InstallSource` marker), **2 macOS** (`*-aarch64-apple-darwin.pkg` + `*-x86_64-apple-darwin.pkg`, unsigned — first run is right-click → Open), and **4 Linux** (`*-{x86_64,aarch64}-unknown-linux-gnu.{deb,rpm}`). Built by **three workflows**: cargo-dist `release.yml` (per-target archives + shell/PowerShell installers + Global MSI), `windows-installers.yml` (Corporate MSI + both Inno EXEs), `unix-installers.yml` (macOS `.pkg` + Linux `.deb`/`.rpm` via `nfpm`); all upload to the Release. **Recommended install:** the one-liner (`curl … | sh` / `cargo install qork`) on macOS/Linux, the MSI/EXE installer on Windows.
- **`/api/shorten`** — `POST` (JSON `{ url, customAlias?, source? }`) and a `GET ?url=<encoded>` convenience mode return the same envelope, now including a fully-qualified **`href`**. `resolveSource()` tags each link `web | cli | api` (explicit `source` field › `qork/*` User-Agent ⇒ `cli` › `api`); the web client (`UrlShortener.tsx`) sends `web`. Stored in `urls.source`; surfaced in the admin **New links by source** card via `admin_analytics().source_breakdown`. CORS is irrelevant to the CLI (a non-browser client), so no `vercel.json` change is needed.

## Testing

Vitest 4 with two projects configured in `vitest.config.ts`:

- **node** — API routes, shortcode logic, Supabase clients (`tests/**`, excluding `tests/ui/`)
- **jsdom** — UI tests (`tests/ui/**`) plus the vendored kit tests living next to their sources (`components/**`, `lib/**`, `hooks/**`); `globals: true`; setup = `tests/setup.ts` + `test/setup.ts` (kit mocks for anime/framer-motion/pretext/lenis + IO/matchMedia stubs)

Slot-roll assertions go through `[data-slot-sr]`. Test files mirror source paths (e.g., `lib/shortcode/generator.ts` → `tests/shortcode/generator.test.ts`); kit tests sit alongside their modules.

## Prettier

100-character line width, 2-space indent, single quotes, semicolons, Unix line endings. CI runs `format:check` — always run `npm run format` before committing.

## Browser verification (Playwright MCP)

The animated DotGrid canvas (home / 404 / admin) wedges Playwright MCP on **viewport resize** (calls time out). Size the viewport on a light page first (`/admin/login` has no DotGrid), then navigate to the heavy page; prefer viewport JPEG over `fullPage`; recover a hung browser by killing only the Playwright chromium (`Get-CimInstance Win32_Process` filtered on `ms-playwright|--remote-debugging-pipe`). The home page is pinned to `100dvh` to fit with no scroll (scroll fallback under 560px tall).

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

**Local gotcha:** a typical local `.env.local` has only the `NEXT_PUBLIC_*` vars — **no `SUPABASE_SERVICE_KEY`** — so `createAdminClient()` (admin page stats + every `/api/admin/*` route) throws `supabaseKey is required` and 500s locally; it works in prod (key set on Vercel). To preview the admin UI locally, temporarily mock the data behind an env flag and remove it before commit. Admin is GitHub-OAuth gated → verify it on the live site after deploy.

## CI/CD

GitHub Actions at root `.github/workflows/ci.yml` — multi-node (20.x, 22.x; vitest 4 requires Node ≥ 20.19), lint, type-check, Prettier, build, npm audit, Trufflehog, bundle analysis. Production deploy on main branch pushes via Vercel CLI. Root `vercel.json` points builds to this `qorkme/` subdirectory.

## Changelogs

Update BOTH `../CHANGELOG.md` (root) and `CHANGELOG.md` (this directory) on every change.
