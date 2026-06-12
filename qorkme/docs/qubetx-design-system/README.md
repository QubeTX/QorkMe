# QubeTX Design System — kit

The portable layer of the QubeTX design system: tokens, fonts, source
modules, and agent documentation, generated **from the live qubetx.com
codebase** by `scripts/build-kit.mjs` so it can never drift from reality.

- **Living spec (live specimens):** https://qubetx.com/design-system
- **Spec of record:** `DESIGN_SYSTEM.md` (in this zip)
- **Agent skill:** `SKILL.md` — start there if you're a coding agent
- **Motion playbook:** `MOTION_GUIDE.md`

## What's in the box

```
qubetx-design-system/
├── README.md / SKILL.md / MOTION_GUIDE.md / DESIGN_SYSTEM.md / BOOT_SCREEN.md
├── package-snippet.json        exact dependency versions to merge
├── tokens/qubetx-tokens.css    the :root token block (generated)
├── fonts/                      woff2 + fonts.css (standalone @font-face)
└── src/
    ├── lib/motion/             tokens · anime seam · slot roll (slotText/SlotRoll)
    │                           · RevealText/splitText · decode · colorRamp
    │                           · dotGridGeometry (wave ripples) · dotFont
    │                           · scrollTracePath · magnetic · proximity · hooks
    ├── lib/pretext/            PretextBlock · provider · resizeCoordinator
    ├── lib/designSystem/       tinyTint (code tinter)
    ├── hooks/                  useScrolled · useActiveSection · useAnchorNav
    ├── fonts/                  next/font/local declarations
    ├── components/ui/          OutlineButton · TextLink · LabelPill · cards
    │                           · StatValue · RollingLink · SectionHeading
    │                           · RoutedText · QubeTXLogo · icons registry
    ├── components/terminal/    TerminalFrame · CommandTable · CapabilityRows
    │                           · InstallBlock · DownloadCard  (the technical register)
    ├── components/layout/      SysStatus (the status heartbeat)
    ├── components/effects/     DotGrid · CustomCursor + engine · SmoothScroll
    │                           · ScrollProgress · ScrollTrace (optional expressive
    │                           decoration) · BootScreen · LoadSequence · MatrixDisplay
    └── test/                   vitest setup + mocks (pretext/FM/anime/lenis, IO, matchMedia)
```

Tests ship alongside their modules — they document intended behavior and
should pass in your project once the test harness is wired (see SKILL.md).

## Quick start

1. `npx create-next-app@latest app --typescript --app --no-tailwind`
2. Merge `package-snippet.json` deps → `npm install`
3. Copy the `src/` layers you need (start with `lib/`, `hooks/`, `fonts/`,
   `components/ui`, `test/`)
4. Merge `tokens/qubetx-tokens.css` into `app/globals.css`; wire the
   providers per `SKILL.md`
5. `npm run lint; npm test; npm run build` — green before you build features

Non-Next consumers: load `fonts/fonts.css`, then `tokens/qubetx-tokens.css`
(a literal-family fallback at the bottom maps the font variables). The
TS/React modules assume React 19 + the `@/` path alias.

## Fonts

Makira (400/500/700/900) and IBM Plex Mono (400/500/600), woff2. These ship
for use on QubeTX-branded properties — treat them as part of the brand, not
a general-purpose license.

## Versioning

Kit version == qubetx.com site version (see `package-snippet.json` and the
saved filename — the sidebar's download attribute stamps it
`qubetx-design-system-v{version}.zip`). The download URL itself is a stable
permalink — **https://qubetx.com/qubetx-design-system.zip** always serves
the current build, so reference that link from docs, skills, and agents; if
your copy is old, download a fresh one.

— QubeTX, a department of ES Development LLC
