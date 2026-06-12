# QorkMe Design System — QubeTX base, QorkMe sub-brand

QorkMe is a **QubeTX property** and runs on the **QubeTX design system v3.2.1**
with a QorkMe sub-brand accent layer (sage + bamboo on the void).

- **Living spec (live specimens):** https://www.qubetx.com/design-system
- **Stable kit permalink:** https://www.qubetx.com/qubetx-design-system.zip —
  always serves the current build; re-download to refresh the vendored kit
- **Vendored kit docs (spec of record):** `docs/qubetx-design-system/`
  (`DESIGN_SYSTEM.md`, `SKILL.md`, `MOTION_GUIDE.md`, `tokens/`)
- **Tokens in code:** `app/globals.css` (`:root` block)

Future agents: cross-check this document against the live spec above. The
QubeTX structural layer (surfaces, borders, text inks, spacing, motion
doctrine) is adopted verbatim and must never fork; only the accent layer
below is QorkMe's.

## The two layers

### 1. QubeTX structural layer (verbatim — never fork)

| Token | Value | Usage |
| --- | --- | --- |
| `--color-void` | `#05070f` | Page background |
| `--color-surface` | `#0d1117` | Cards, panels, terminal chrome |
| `--color-surface-raised` | `#111827` | Hovered cells, dropdowns |
| `--color-border` | `#1a2236` | 1px hairlines (borders do elevation work — no big shadows) |
| `--color-border-bright` | `#2c3a5c` | Hovered borders |
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#94a3b8` | Body copy |
| `--color-text-dim` | `#76869f` | Mono labels, metadata — contrast-tuned (5.44:1 on void), **never adjust** |

Spacing: 8px ladder (`--space-xs…3xl`), `--container-max` 1440px (1800px at
≥2560px), `--container-padding-x: clamp(16px, 4vw, 32px)`,
`--section-spacing: clamp(48px, 10vw, 96px)`. Radius: 2px chips · 4px pills ·
6px panels/buttons · 999px pill tabs. Type scale: `--text-display/h2/h3/body`,
`--text-mono-label` (0.7rem, 0.12em tracking, uppercase via CSS). Easing:
`--ease-out: cubic-bezier(0.25, 1, 0.5, 1)` (the house curve).

### 2. QorkMe sub-brand accent layer (the color analysis)

Derived 2026-06-12 by measuring WCAG contrast on `#05070f`, mirroring how
QubeTX tuned `#3385ff` (5.69:1) as the AA arrival against `#0066FF` (4.16:1).
Sage is perceptually bright, so **QorkMe's heritage sage passes AA unchanged**
— the sub-brand keeps its exact identity hue.

| Token | Hex | Contrast on void | Usage |
| --- | --- | --- | --- |
| `--color-primary` | `#5b8a5b` | **5.01:1** (AA) | The action color — focus rings, active accents, primary buttons |
| `--color-primary-hover` | `#69a169` | 6.61:1 | Hover lift |
| `--color-arrival` | `#7dc87d` | 9.99:1 | Slot-roll arrival flash, success moments |
| `--gradient-brand` | `#4a9e5c → #c4a876` | 6.07 / 8.82 | Display gradients, LED color ramps (sage → bamboo) |
| `--color-accent` | `#c4a876` | 8.82:1 | Bamboo warm accent (hover `#d4b896`) |
| `--glow-primary` | `rgba(91,138,91,.25)` | — | Button hover glow |

Semantic tones (void-tuned, all ≥4.5:1 as text):

| Token | Hex | Contrast | Note |
| --- | --- | --- | --- |
| `--color-success` | `#7dc87d` | 9.99:1 | Same as arrival — "it worked" |
| `--color-warning` | `#d6a52e` | 8.89:1 | Heritage ochre, unchanged |
| `--color-error` | `#d07a66` | 6.38:1 | Heritage terracotta `#b05545` (4.05:1) lightened for the void |
| `--color-info` | `#7aa3d0` | 7.64:1 | Heritage slate `#345670` (2.60:1) lightened for the void |

The canvas LED surfaces (`DotGrid`, `MatrixDisplay`, `MatrixClock`) use a
`buildColorRamp('#4a9e5c', '#c4a876', 256)` LUT — the sub-brand's replacement
for QubeTX's blue→violet ramp.

## Theming

**Dark only.** There is no light mode and no theme toggle — one palette,
exactly like qubetx.com.

## Typography

Same two voices as QubeTX (both self-hosted via `@font-face`, more weights
than the kit ships):

- **Makira Sans Serif** (400/500/600/700/800/900) — `--font-stack-sans`.
  Headings: Black 900, uppercase via CSS, −0.02em. Buttons use the mono
  register instead (see below).
- **IBM Plex Mono** (400/500/600/700) — `--font-stack-mono`. The technical
  register: labels, pills, statuses, short URLs, errors, corner metadata,
  buttons (`.btn` is mono 600 uppercase 0.1em).

Sentence case in storage, UPPERCASE via CSS. `.mono-label` is the utility for
mono micro-labels. The `.font-makira` page-wrapper scope excludes
`code`/`pre`/`.font-mono` so the mono face surfaces.

## Registers

- **Landing register** (home, result, 404): DotGrid field, LED matrix
  surfaces, entrance choreography (LoadSequence — no boot overlay; the site
  loads straight in), editorial copy.
- **Technical register** (admin console, login, card internals): mono
  statuses, real values and timestamps ("the terminal is honest"), inline
  `ERR //` lines — **never toasts**.

## QorkMe signature components

| Component | File | Notes |
| --- | --- | --- |
| `MatrixDisplay` | `components/effects/MatrixDisplay.tsx` | Kit LED word board, sage→bamboo ramp. Home wordmark, 404, login |
| `MatrixClock` | `components/effects/MatrixClock.tsx` | QorkMe-built on kit dotFont/canvas — live 12h clock, per-tick dot diffs |
| `DotGrid` | `components/effects/DotGrid.tsx` | The background field; reacts to pointer + `firePulse()` (a sage ripple fires when a link is created) |
| `UrlShortener` | `components/UrlShortener.tsx` | Slot rolls everywhere: SHORTEN→WORKING…, corner status IDLE→INPUT→READY→BUSY→DONE while typing, alias CHECKING→AVAILABLE/TAKEN, arrival-rolled result, COPY→COPIED |
| `SysStatus` | `components/layout/SysStatus.tsx` | Footer heartbeat (NOMINAL/SCANNING/SECURE) |
| `PageHeader` | `components/PageHeader.tsx` | Fixed header, blur+compress past 24px |
| `SiteFooter` | `components/SiteFooter.tsx` | Wordmark + SysStatus + mono links + "A QubeTX Property" |

Kit components live in `components/ui` (OutlineButton, TextLink, LabelPill,
SectionHeading, StatValue, RollingLink, Magnetic, QubeTXLogo, icons),
`components/terminal` (TerminalFrame, CommandTable, CapabilityRows,
InstallBlock, DownloadCard), `components/effects`, `lib/motion`, `lib/pretext`,
`hooks/`. BootScreen is vendored but **unmounted** by decision.

## Motion doctrine (the laws — see `docs/qubetx-design-system/MOTION_GUIDE.md`)

- One owner per animated property (anime via `lib/motion/anime.ts` seam only;
  Framer Motion; rAF engines; CSS — never two on one node).
- **No ResizeObserver** — subscribe to `lib/pretext/resizeCoordinator`.
- Triggers are IntersectionObserver; scrubbing is Lenis. `anime onScroll` is banned.
- Server HTML is the final state; `html[data-loading]` FOUC guard with 3s
  failsafe; no-JS never arms.
- Reduced motion = the final state instantly (the matrix clock still ticks —
  it's content — but without sweeps).
- Slot rolls for label changes, always (`lib/motion/SlotRoll`); arrival color
  is `--color-arrival` sage. Copy confirmation = flash `COPIED`, never a toast.

## Text measurement (Pretext)

Wrapping body copy goes through `PretextBlock` (min-height reservation —
no CLS while Makira loads). `shrinkwrap` ONLY on left-aligned blocks. Never
Pretext-measure mono labels (letter-spaced) or single-line headings.
`@chenglou/pretext` is transpiled via `next.config.ts` `transpilePackages`.

## Responsiveness

Fluid by token: container clamps, type clamps, 8px ladder. Canvas surfaces
size from their containers via `resizeCoordinator`. Verified breakpoints:
320 / 375 / 768 / 1024 / 1440 / 2560 (TV tier). Touch targets ≥44px under
`@media (pointer: coarse)`; CustomCursor renders on fine pointers only.

## Quality floors (QubeTX)

Lighthouse 100 accessibility / 100 best-practices / 100 SEO; real-navigation
CLS 0; `npm run ci` green before every commit.
