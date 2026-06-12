---
name: qubetx-design
description: The QubeTX design system — use when building, styling, or animating ANY QubeTX-branded site, app, product page, or tool surface (qubetx.com family, reports.qubetx.com products, TR-300/SD-300/ND-300/WB-300-style pages), when asked to "make it QubeTX", match the QubeTX look/feel/motion, add a slot roll / dot field / terminal frame / install block, or bootstrap a new QubeTX project. Covers tokens, fonts, components, the motion doctrine, and the agent playbook.
---

# QubeTX Design System — agent skill

You are building a QubeTX surface. The living spec is **qubetx.com/design-system**
(26 numbered sections, live specimens); the spec of record is **DESIGN_SYSTEM.md**
(shipped in this kit). This skill is the executable summary.

## The seven principles (decide everything else from these)

1. **Detail is the product** — if it ships under the name, it ships finished.
2. **Server HTML is the final state** — complete, readable content before JS.
3. **One owner per element property** — every animated property has exactly one writer.
4. **Reduced motion = the final state, instantly** — never slower, never an opt-out.
5. **The terminal is honest** — real clocks, real values, real commands.
6. **Motion earns its place** — move on meaning; decoration moves once or never.
7. **The laws outlive the code** — the bans below each have a post-mortem behind them.

## Bootstrap a new project

```bash
npx create-next-app@latest app --typescript --app --no-tailwind
npm install animejs framer-motion lenis clsx lucide-react @chenglou/pretext
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Then copy from this kit:

| Kit path                   | Into your project            | Gives you                                                                                         |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/lib/motion/`          | same                         | tokens, anime seam, slot roll, reveals, decode, geometry, hooks                                   |
| `src/lib/pretext/`         | same                         | PretextBlock, provider, resizeCoordinator (THE resize system)                                     |
| `src/hooks/`               | same                         | useScrolled, useActiveSection, useAnchorNav                                                       |
| `src/fonts/`               | same                         | Makira + IBM Plex Mono woff2 + next/font declarations                                             |
| `src/components/ui/`       | same                         | buttons, links, pills, cards, stats, logo, icons registry                                         |
| `src/components/terminal/` | same                         | TerminalFrame, CommandTable, InstallBlock, DownloadCard, CapabilityRows                           |
| `src/components/effects/`  | as needed                    | DotGrid, CustomCursor+engine, SmoothScroll, ScrollProgress, ScrollTrace, BootScreen, LoadSequence |
| `src/test/`                | same                         | setup.ts mocks (pretext/FM/anime/lenis) + IO/matchMedia stubs                                     |
| `tokens/qubetx-tokens.css` | merge into `app/globals.css` | the full token block                                                                              |

Wire `app/layout.tsx`:

```tsx
<html lang="en" suppressHydrationWarning>
  <body className={`${makira.variable} ${plexMono.variable}`}>
    <PretextProvider>
      <SmoothScroll>
        <CustomCursor />
        {children}
      </SmoothScroll>
    </PretextProvider>
  </body>
</html>
```

Map the stacks in globals.css (never literal family names — next/font rewrites them):
`--font-stack-sans: var(--font-makira), ui-sans-serif, system-ui, sans-serif;`
`--font-stack-mono: var(--font-plex-mono), ui-monospace, "Cascadia Mono", monospace;`

## Pick the register

- **Landing register** (persuading): hero + dot field, editorial sections,
  cards, entrance choreography.
- **Technical register** (operating — product/tool pages): TerminalFrame hero,
  CapabilityRows, CommandTable, InstallBlock + DownloadCard. This is the
  canonical anatomy for every TR-300-style product page.

Both share ALL tokens and the motion doctrine. Never fork the palette.

## Task routing

| Building…                                                                            | Use                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A label that changes (button caught mid-action, counter, status)                     | **The slot roll. Always.** `useSlotRoll`/`SlotRoll`                                                                                                                                                                                                        |
| A button/link                                                                        | `OutlineButton`/`TextLink` + the destination rule: external → `hoverLabel` (hover teaser), internal → `flashLabel` (click flash)                                                                                                                           |
| Copy-to-clipboard                                                                    | `InstallBlock` pattern: `flash('Copied')` — never a toast                                                                                                                                                                                                  |
| A heading arriving                                                                   | `RevealText` (words); pill labels `decode()`                                                                                                                                                                                                               |
| Body copy that wraps                                                                 | `PretextBlock` (min-height; `shrinkwrap` ONLY left-aligned)                                                                                                                                                                                                |
| Terminal output                                                                      | `TerminalFrame` (server-renders all lines; boot-prints on first view)                                                                                                                                                                                      |
| A canvas surface                                                                     | DotGrid's model: anime/pure-math animates plain objects, canvas only blits                                                                                                                                                                                 |
| Scroll trigger / scrub / jump                                                        | `useInViewOnce` / Lenis-seeked paused timeline / `useAnchorNav`                                                                                                                                                                                            |
| Scroll-storytelling decoration (OPTIONAL — showcase surfaces only, never every page) | `ScrollTrace` pattern: `buildTrace()` geometry + drawable timeline seeked from Lenis. Keep the brand language (gradient strokes, no SVG filters, reduced-motion = static); the specific design varies per surface — be creative with the product's context |
| First-load theater                                                                   | BootScreen CONTRACT (pre-paint arming, readiness completion, failsafes) — opt-in                                                                                                                                                                           |

## The laws (violations are bugs, not style)

- **NO ResizeObserver** — subscribe to `resizeCoordinator`.
- **anime.js only via `src/lib/motion/anime.ts`** (the test seam). v4.4 removed
  string cubic-beziers — use `EASE_ANIME`/`cubicBezier()`.
- **anime `onScroll` banned**; triggers = IO, scrubbing = Lenis callbacks.
- **No per-event anime tween bursts** in pointer handlers (8–36ms each, measured) —
  high-frequency channels use wave objects / pure math.
- **Sentence case in storage; UPPERCASE via CSS.**
- **Letter-spaced text is never Pretext-measured.**
- **Fullscreen fixed overlays portal to document.body.**
- **decode/slot-roll/Pretext/anime/FM never share a node.**
- **`--color-text-dim` and `--color-arrival` are contrast-tuned — don't adjust.**

## The gate (before EVERY commit)

```bash
npm run lint; npm test; npm run build
```

All three green, then verify motion in a real Chrome session — jsdom cannot
exercise canvas/anime/Lenis. Floors: Lighthouse 100 a11y / 100 BP / 100 SEO,
real-navigation CLS 0.000.

## Testing conventions

- Components render **correct final-state DOM with all mocks active**.
- Pure modules (geometry, ramps, engines, splitters) get real unit tests.
- Slot-roll assertions go through `[data-slot-sr]` after `vi.runAllTimers()`.
- jsdom quirks: `onPointerEnter` ← `fireEvent.pointerOver` with
  `{ pointerType: 'mouse' }`; `onFocus` ← `fireEvent.focusIn`.

## More depth

- `MOTION_GUIDE.md` — the full animation playbook (slot roll spec, recipes).
- `DESIGN_SYSTEM.md` — the spec of record (tokens, components, gotchas).
- `BOOT_SCREEN.md` — the boot overlay's architecture & decision record.
- qubetx.com/design-system — every pattern, live.
