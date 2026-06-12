# Boot Screen (SYSTEM_INITIALIZER) — Architecture & Decisions

The first-load boot screen that covers initial hydration/font jank behind an
on-brand terminal boot sequence. Built 2026-06 from Emmett's Variant sample
(terminal box + timestamped log + progress bar + status badge), ported onto
the v3 design tokens. This doc records how it works and **why** — read it
before changing `BootScreen.tsx`, `LoadSequence.tsx`, or the layout inline
script, because the three are one coupled system.

## Files

| File                                           | Role                                            |
| ---------------------------------------------- | ----------------------------------------------- |
| `src/components/effects/BootScreen.tsx`        | Overlay component + completion logic            |
| `src/components/effects/BootScreen.module.css` | All visuals; pre-hydration CSS life             |
| `app/layout.tsx` (inline `<script>`)           | Pre-paint arming + failsafes                    |
| `src/components/effects/LoadSequence.tsx`      | Holds the hero entrance until boot completes    |
| `src/components/effects/BootScreen.test.tsx`   | Skip path, armed path (fake timers), log stream |

## Lifecycle

```
first paint                                  hydration              ready
│                                            │                      │
├─ inline script (layout.tsx, pre-paint):    ├─ BootScreen effect:  ├─ bar→100%, beat (280ms)
│  data-loading set                          │  log stream starts   ├─ sessionStorage flag set
│  data-boot set IFF no session flag         │  progress tracks     ├─ data-boot lifted
│  AND no reduced-motion                     │  elapsed/MIN         ├─ qubetx:boot-complete →
│                                            │                      │  LoadSequence entrance plays
├─ overlay paints (server HTML, CSS-alive:   │                      ├─ overlay fades 700ms
│  cursor blink, dot pulse, bar sweep,       │                      └─ display:none (done)
│  first log line)                           │
```

**Completion is dynamic**, not a timer:
`Promise.all([5s minimum, document.fonts.ready, window load]) → double-rAF`.
The 5s clock starts when the effect runs (i.e. after hydration), so slow
devices/networks extend the hold automatically; the double-rAF confirms the
renderer actually painted a frame before handoff. While readiness outlasts
the minimum, progress parks at 99% and an `AWAITING RENDERER SYNC...` log
line appears.

## Decisions (and why)

1. **Server-rendered overlay.** The lag being masked happens _before_
   hydration — a client-only overlay would appear after the jank it's meant
   to hide. The overlay is in the static HTML (first child of `<main>`, so
   it's early in the stream), and its idle motion (cursor blink, badge
   pulse, progress sweep, first log line) is **pure CSS** so the screen is
   alive while JS is still downloading.
2. **Arming happens pre-paint via `html[data-boot]`**, set by the layout
   inline script. CSS (`html:not([data-boot]) .overlay { display:none }`)
   means an unarmed page never flashes the overlay — there is no JS race.
   Since v3.1.0 the arming is additionally gated on
   `location.pathname === '/'` — the boot moment belongs to the landing;
   `/design-system` and `/wallpaper` never arm (and a first visit there
   leaves the sessionStorage flag unset, so a later visit to `/` still
   boots).
3. **"Cache detection" = `sessionStorage['qubetx:booted']`.** First boot of
   a browser session sets it; the inline script checks it before paint, so
   return visits skip the overlay entirely (zero flash). Session (not
   local) storage so a fresh visit tomorrow still gets the branded boot.
4. **Reduced motion skips it** (checked in the inline script _and_ the
   component) — policy everywhere in this codebase is skip-to-final-state.
5. **No-JS can't be trapped:** without JS the inline script never runs → no
   `data-boot` → overlay hidden, content visible. **Broken-JS can't be
   trapped either:** the inline script force-lifts `data-boot` after 10s.
6. **Handoff to the entrance, not after it.** Boot completion fires
   `qubetx:boot-complete` _before_ the 700ms fade starts; `LoadSequence`
   (which waits on that event whenever `data-boot` is armed) plays the hero
   entrance behind the dissolving overlay. A special CSS rule
   (`html:not([data-boot]) .overlay.exiting { display:block }`) keeps the
   fade visible after the attribute is lifted.
7. **5-second minimum** is a product decision (Emmett) — long enough to
   read the boot log, deliberate rather than apologetic. Log cadence
   (~400ms start, 320–600ms gaps) is tuned to fill it.
8. **Log timestamps are the real clock** (`toLocaleTimeString en-GB`), like
   the Variant sample — a fake-but-honest terminal.

## Tuning knobs (all in `BootScreen.tsx`)

`MIN_BOOT_MS` (hold), `EXIT_MS` (fade), `LOGS` (lines/accents), the cadence
constants in `addLog`, and the 99%-park progress pacing.

## Testing notes

jsdom: `document.readyState` is already `'complete'` and `document.fonts`
is mocked per `setup.ts`, so the armed path resolves under
`vi.useFakeTimers()` + `advanceTimersByTimeAsync(7000)` (sinon fake timers
also drive `requestAnimationFrame`). The skip path must complete
synchronously-ish (event + flag) — see `BootScreen.test.tsx`. Visual
verification belongs in a real Chrome session; an in-page sampling probe
(`setInterval` recording `data-boot` + overlay computed style) is the
reliable way to verify timing — MCP screenshot roundtrips lose the race to
the boot window (verified: armed 264ms → lifted 6001ms → hidden 6751ms).

## Related reading

`DESIGN_SYSTEM.md` §4 (effects table) — one-row summary and the system-wide
motion ownership rules this component obeys (its only animation libs are
CSS keyframes + inline style writes; no anime/FM on overlay nodes).
