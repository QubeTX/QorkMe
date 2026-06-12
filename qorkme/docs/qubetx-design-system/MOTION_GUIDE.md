# QubeTX Motion Guide

The animation playbook behind qubetx.com — distilled from DESIGN_SYSTEM.md
§motion and the hard-won gotchas. Live demos of everything here:
https://qubetx.com/design-system (§16–22).

## 1 · Ownership (the load-bearing law)

One owner per element property. The owners and their territories:

| Owner               | Territory                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **anime.js v4**     | dot-field breathe/entrance, scroll-scrubbed timelines, text reveals/decode/letter rolls, SVG drawing               |
| **Framer Motion**   | AnimatePresence exits, `layoutId` indicators, `whileInView` entrances, `whileTap` squash, `useScroll` MotionValues |
| **raw rAF**         | cursor engine, magnetic pull, micro-tilt (transform-only, settle-cancelled)                                        |
| **slotText engine** | per-character label changes (owns its cells entirely)                                                              |
| **wave objects**    | dot-field ripples — pure math evaluated per frame by the blitter                                                   |
| **CSS**             | every simple hover (brackets, underlines, sweeps, blinks)                                                          |

An FM-variant element is never also an anime target — anime targets live one
level down (split spans, SVG paths). When two animations fight, find the
property with two writers.

## 2 · The tokens

```ts
EASE = [0.25, 1, 0.5, 1]; // FM tuple
EASE_CSS = 'cubic-bezier(0.25, 1, 0.5, 1)'; // CSS (--ease-out)
EASE_ANIME = cubicBezier(0.25, 1, 0.5, 1); // anime v4 FUNCTION (string form was removed)
EASE_SLOT_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // overshoot — slot roll ONLY

DUR = { micro: 0.18, fast: 0.3, base: 0.55, slow: 0.8, hero: 1.1 }; // seconds (FM)
MS = { micro: 180, fast: 300, base: 550, slow: 800, hero: 1100 }; // ms (anime)
STAGGER_MS = { chars: 18, words: 40, lines: 90, cards: 80, nav: 60 };
SPRING = { press: 600 / 18, card: 260 / 22, soft: 120 / 14 }; // stiffness/damping
```

Micro-interactions land under 400ms total. The overshoot is reserved for the
slot roll — restraint is what makes its bounce read as an event.

## 3 · The slot roll (THE standard for changing text)

Any short label that changes in place rolls per character. Engine:
`src/lib/motion/slotText.ts`; React layer: `SlotRoll.tsx` (named so because
`SlotText.tsx` would collide case-insensitively with `slotText.ts`).

```ts
const [ref, label] = useSlotRoll('Copy')      // imperative (events)
label.flash('Copied')                          // transient + auto-revert (~1.4s)
label.set('May 2026', { direction: 'up' })     // permanent; direction follows travel

<SlotRoll text={status} />                     // declarative (state-driven)
attachSlotText(el, '0%', { color: null })      // raw controller (odometers)
```

Defaults: 240ms / 40ms stagger / 0.3 bounce / arrival `var(--color-arrival)`
settling to ink in 280ms / `skipUnchanged` / `interrupt`.

**Rules:** labels only · external links roll on HOVER to a teaser, internal
on INTERACTION (the destination rule; mouse only) · blue on arrival, ink at
rest (`color: null` on gradient faces) · direction follows travel · reduced
motion snaps · meaningful change only · the engine owns its container's
children · reserve the width with an invisible sizer stack (hover shifts are
not CLS-exempt).

**A11y:** a `[data-slot-sr]` span carries the accessible name (updated
immediately); cells are aria-hidden. **Tests:** assert via `[data-slot-sr]`
after `vi.runAllTimers()` — jsdom never fires transitionend; the engine's
safety-net rebuild is the testable state.

## 4 · Text systems routing

| Situation                    | System                                         |
| ---------------------------- | ---------------------------------------------- |
| Heading/sentence arrives     | `RevealText` (masked rise, once, IO)           |
| Label feels freshly verified | `decode(el, 450)` (scramble L→R)               |
| Short text CHANGED           | the slot roll, always                          |
| Link label hover             | `RollingLabel` (stacked-copy letter roll)      |
| Terminal output appears      | `TerminalFrame` boot-print (line stream)       |
| Paragraph wraps              | not motion — `PretextBlock` reserves the space |

decode rewrites textContent — it never shares a node with the slot roll,
RevealText, Pretext, or anime/FM.

## 5 · Scroll

- **Lenis is the single driver** (`<SmoothScroll>` at the root; lerp 0.1).
- **Triggers** = `useInViewOnce` (IO, fires once, initial state false).
- **Scrubbing** = a PAUSED anime timeline `seek()`ed from a Lenis callback
  (bidirectional by construction). anime's `onScroll` is banned.
- **Jumps** = `useAnchorNav(offset)` → `lenis.scrollTo`; links keep real
  hrefs; CSS `scroll-behavior: smooth` stays absent.
- Overlays call `lenis.stop()` / `start()`.

### The scroll trace (OPTIONAL expressive decoration)

`ScrollTrace` (kit `effects/`) is the scrub pattern's flagship: a circuit
trace of `svg.createDrawable` segments drawing down a page gutter and
reversing back up, junction cubes at section boundaries (`sectionIds` prop;
geometry is the pure, unit-tested `buildTrace()` in
`src/lib/motion/scrollTracePath.ts`). Left or right gutter is a per-surface
choice (`gutterX` is just a lane coordinate) — qubetx.com draws it on the
left, the /design-system rail rides the right edge.

It is a **decoration, not a requirement** — reserve it for showcase
surfaces; working tools don't scroll-animate. When you do build one, be
creative with the product's own context (a waveform, a dependency graph,
whatever its diagnostic flavor suggests) and keep the brand invariants:
Lenis-seeked paused timeline, gradient strokes (`#0066FF → #7c3aed`), glow
as a second wider stroke (never an SVG filter), hidden where the gutter is
too thin, re-measure only via `resizeCoordinator`, reduced motion = the
complete trace rendered statically. The specific design varies per surface;
the language doesn't.

## 6 · Canvas surfaces (the dot-field model)

anime (or pure math) animates **plain JS objects**; canvas only blits.
Separated channels (`breathe` vs `pulse`/`mix`) compose at paint time.
High-frequency interaction NEVER creates anime instances in the handler —
a pointer-move ripple as ~600 tweens cost 8ms (taps 36ms, measured); as a
wave object (`makeRippleWave`/`applyRippleWaves`) it costs 0.2ms. Geometry
culls invisible dots; delays are distance functions; boards rebuild only
via `resizeCoordinator`; IO pauses offscreen; reduced motion = static.

Verify canvas work with timed `getImageData` probes in real Chrome — jsdom
cannot see any of it.

## 7 · Reduced motion

`useMotionPreference()` (hook) / `prefersReducedMotion()` (imperative) —
every primitive consults it and **skips to the final state**. Never a slower
version. The slot roll, reveals, boot, field, and cursor all comply
automatically; new features must too, in the same commit.

## 8 · Gotchas (each one is a paid invoice)

1. anime 4.4 removed string cubic-beziers; named eases (`'out(3)'`) still work.
2. Never derive initial React state from browser-API presence (SSR divergence).
3. react-hooks v7: no sync setState in effects; no ref reads during render.
4. Inline `display` beats media queries; CSS animations beat inline styles.
5. SVG `<g>` with attribute matrices never get CSS transforms — draw strokes.
6. `grid-column: auto / -1` is a span of 1, not "rest of row".
7. Fullscreen fixed overlays portal to `document.body` (identity transforms
   on ancestors still create containing blocks).
8. Case-insensitive filesystems: never add files differing only in case.
9. Gradient-clipped text needs the per-face `background: inherit` + clip
   chain under slot-roll cells, or the glyphs disappear.
10. CSS-module HMR doesn't remount canvas boards — hard-reload before
    judging visual bugs in dev.
