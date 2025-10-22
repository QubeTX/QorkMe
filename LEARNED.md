# QorkMe Visual Effects Implementation Notes

## TL;DR
- Interactive grid: single SVG background with rect cells that light up on hover; use dynamic viewport sizing, noise-masked strokes, and Tailwind-friendly class hooks.
- Dot-matrix display: SVG-based Matrix component renders text/animations from frame arrays; QorkMe layers shimmered title and live time with responsive instances.
- Replicate by pairing `InteractiveGridPattern` for ambiance and `Matrix` for retro readouts, respecting performance (≤50×50 grids), accessibility (`ariaLabel`), and mobile fallbacks.

---

## Interactive Grid Pattern

### Core Concepts (from `INTERACTIVE_GRID_BACKGROUND.md`)
- **Single SVG**: All cells live inside one `<svg>` for minimal DOM overhead and 60 fps hovers.
- **Hover lighting**: Each `<rect>` toggles fill/opacity on pointer events; CSS transitions (`transition-all duration-300`) keep animation smooth.
- **Configurable density**: `width`, `height`, and `squares` props control cell size and grid dimensions. Defaults: 40 px cells, 24 × 24 grid.
- **Styling hooks**: `className` tweaks the wrapper `<svg>`, `squaresClassName` augments the interactive cells—use Tailwind utilities like `hover:fill-blue-500`.
- **Common pitfalls**: keep total cells under ~2500 (≈50×50); ensure container has explicit size; add foreground z-layer (`relative z-10`) since grid is absolutely positioned.
- **Customization tips**:
  - Adjust transitions for snappier hover (`duration-150`).
  - Swap hover color via `squaresClassName` or inline `fill`.
  - Layer with gradients/particles; maintain contrast for visibility.
- **Mobile**: No hover—consider touch handlers or keeping the effect decorative only.

### QorkMe Implementation Takeaways (`qorkme/components/ui/interactive-grid-pattern.tsx`)
- **Dynamic coverage**: A `useEffect` calculates columns/rows from `window.innerWidth/Height`, adding a 2-cell buffer so the grid always fills the viewport during resize.
- **Noise & gradients**: `<defs>` defines a radial gradient and `feTurbulence`-based noise mask, giving organic line variation and central glow.
- **Pointer handling**: Wrapper `<svg>` uses `pointer-events-none`; the `<g>` of cells re-enables pointer events so the background remains non-blocking while still responding to hover.
- **Terracotta glow**: Hover fill uses `var(--color-primary)` with `fillOpacity` 0.12, harmonizing with the design system.
- **Inline cursor lock**: Cells keep `cursor: default` to avoid implying clickability; change to `pointer` only if implementing clicks.

### Reuse Checklist
1. Copy the component (or npm package equivalent) and import anywhere inside a `relative` parent.
2. Ensure the parent container has explicit height (e.g., `h-screen`) so the SVG can size itself.
3. Layer your content in a `relative z-10` wrapper; keep the grid at `absolute inset-0 z-0`.
4. Tune `width`/`height` for desired density; test ≤50×50 grids for performance.
5. Use `squaresClassName` to align hover palette with project colors.
6. For touch devices, decide whether to disable pointer events or add a fallback animation.

---

## Dot-Matrix Display

### Core Concepts (from `MATRIX_DOCS.md`)
- **API surface**:
  - `Matrix` component accepts `rows`, `cols`, optional `pattern` (static frame), `frames` + `fps` for animation, or `mode="vu"` + `levels` for live meters.
  - Visual tuning with `size` (cell diameter) and `gap` (spacing), plus `palette` `{ on, off }` and `brightness` multiplier.
  - Hooks: `onFrame` callback, standard `className`, and spread `...props`.
- **Frame format**: `Frame = number[][]` with brightness 0–1. Build sequences for animations or use built-in presets (`digits`, `loader`, `pulse`, `snake`, `wave`, `vu` helper).
- **Examples**: retro displays, clock digits, animated hearts, custom VU meters.
- **Performance**: SVG-based with precomputed positions, `requestAnimationFrame` timing, good up to ≈16×16 cells; cleanly disposes animation loops on unmount.
- **Accessibility**: `role="img"`, `ariaLabel`, optional `aria-live="polite"` for animated updates.
- **Theming**: Uses CSS vars; sample palettes for phosphor green, amber, neon blue.

### QorkMe Matrix Display (`qorkme/components/MatrixDisplay.tsx`)
- **Two-tier layout**:
  - Title matrix showing “Qork.Me” (desktop) / “Qork” (mobile).
  - Time matrix rendering a 12-hour clock with seconds (desktop) or without seconds (mobile).
- **Responsive duplication**: Separate `hidden md:block` / `md:hidden` instances to change `cols`, `size`, and textual content per breakpoint.
- **Custom text rendering**:
  - `renderTextToFrame` places character frames on a blank canvas with configurable brightness per character.
  - `makeBoldPattern` expands letter dots to create thicker strokes by stamping adjacent cells.
- **Shimmer animation**:
  - `createTitleFrames` generates 24 brightness arrays (one per character) using phase-shifted sine waves for subtle pulsing.
  - `frameIndex` advances at 10 fps via `setInterval`.
- **Time updates**: `useEffect` refreshes `Date` every second; separate builders for desktop/mobile frames ensure layouts stay centered.
- **Visual polish**:
  - Shared palette: `on` terracotta (`rgba(196, 114, 79, 1)`), `off` at 8% opacity.
  - SVG cascade props (`cascadeDelay`, `cascadeStartDelay`) produce staggered fade-ins.
  - Radial CSS masks (`mask-image` / `-webkit-mask-image`) feather edges for atmospheric falloff.
- **SSR guard**: `mounted` flag prevents hydration mismatches by rendering sized placeholders until client-side mount.

### Replication Blueprint
1. **Import assets**: `import { Matrix, digits, letters } from '@/components/ui/matrix'`.
2. **Prepare helpers**:
   - Build empty frames (`Array.from`) and render text via char maps (`letters`, `digits`, custom punctuation).
   - Apply optional bolding by duplicating neighboring pixels.
3. **Animate titles**:
   - Create brightness frames (sine-based or random sparkle).
   - Memoize frame arrays and increment index with `setInterval`.
4. **Render matrices**:
   - Use `pattern={frame}` for static snapshots, or pass `frames`/`fps` for built-in animations.
   - Tune `rows`/`cols` to leave padding around glyphs (QorkMe uses 9 rows for 7-row glyphs plus breathing room).
5. **Handle responsiveness**:
   - Duplicate components per breakpoint when props must differ (cell size, column count, content).
   - Gate instances with Tailwind visibility utilities.
6. **Style & layer**:
   - Wrap each matrix in a `relative` div and apply masks/gradients as desired.
   - Align palette with brand colors; adjust `size`/`gap` to balance density vs. legibility.
7. **Performance hygiene**:
   - Keep `setInterval` timers cleared on unmount.
   - Avoid unnecessary re-renders by memoizing frames and dependency arrays.
8. **Accessibility & SSR**:
   - Provide descriptive `ariaLabel`s.
   - Use mount guards or `useEffect` gating when relying on `window` or time-based animation to avoid Next.js hydration issues.

---

## Applying Both Effects in New Projects
- Layer the `InteractiveGridPattern` as the base background, ensuring z-index separation from interactive UI.
- Stack `Matrix` components above the grid using `relative z-10` wrappers; the dot-matrix glow aligns visually with the terracotta hover from the grid.
- Maintain spacing with flex layouts and Tailwind `gap` utilities (per `docs/UI_LAYOUT_GUIDE.md`); avoid margins in centered flex parents.
- Test in desktop and mobile to confirm hover degradation is acceptable and responsive matrices stay readable.
- Add regression tests or storybook entries for matrix frames if animations or text rendering change—frame data is deterministic and easy to snapshot.

---

## Quick Reference
- `InteractiveGridPattern` props: `className`, `width`, `height`, `squares`, `squaresClassName`.
- `Matrix` props: `rows`, `cols`, `pattern` | `frames` + `fps`, `mode="vu"`, `levels`, `size`, `gap`, `palette`, `brightness`, `ariaLabel`, `onFrame`.
- Performance guardrails: grid ≤50×50 cells; matrix ≤16×16 for fluid animation.
- Mobile strategy: duplicate matrices per breakpoint; accept decorative-only grid hovers on touch.

---

## Next Steps for Future Projects
1. Extract helpers (`makeBoldPattern`, `renderTextToFrame`, `createTitleFrames`) into a shared utility module for reuse.
2. Consider packaging the interactive grid as a standalone npm component with configurable noise gradients.
3. Document palette tokens and animation cadence inside the design system so new projects stay visually cohesive.

