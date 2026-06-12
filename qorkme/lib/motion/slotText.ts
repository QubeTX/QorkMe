/**
 * slotText — the QubeTX slot roll. How a tiny label changes.
 *
 * The house micro-interaction for SHORT text that changes in place: button
 * labels, counters, status words. Each character sits in its own clipped
 * cell; the new glyph rolls in while the old one rolls out, landing with a
 * small spring. Incoming glyphs arrive in `--color-arrival` blue, then
 * settle to ink. Pure CSS transforms + timers — no anime.js, no deps.
 *
 * Adapted from slot-text v0.2.2 (MIT · textmotion.dev) via the Millis design
 * system kit copy. Vendored rather than installed: the upstream React
 * wrapper SSR-renders an empty span (violates our "server HTML shows final
 * state" rule), and an in-repo copy lets the brand defaults live here.
 *
 * Deviations from the kit copy:
 * - Structural classes → data attributes + inline styles (the splitText
 *   pattern): [data-slot-text] container, [data-slot-sr] accessible name,
 *   [data-slot-cell] / [data-slot-sizer] / [data-slot-face] cells. Cells do
 *   NOT impose a line-height — they inherit the consumer's.
 * - Reduced motion consults the house store (`prefersReducedMotion()`), and
 *   text snaps instantly to its new value. No opt-out.
 * - `will-change: transform` only while a roll is in flight (the will-change
 *   budget otherwise belongs to the cursor layers).
 * - Defaults are QubeTX-tuned: blue arrival (`--color-arrival`) settling to
 *   ink, EASE_SLOT_CSS overshoot, 240 ms / 40 ms stagger / 0.3 bounce.
 * - chromatic() (demo rainbow) and the declarative DOM bootstrap dropped.
 *
 * RULES (see DESIGN_SYSTEM.md § Slot roll):
 * - Labels only — a word or two, never sentences or headings.
 * - External links roll on hover (teaser label); internal ones on interaction.
 * - Blue on arrival, ink at rest — pass `color: null` for a quiet ink roll
 *   (mandatory on gradient surfaces where the blue would vanish).
 * - The engine owns the container's children — never hand-author cells, and
 *   never point decode()/Pretext/another engine at the same node.
 */

import { EASE_SLOT_CSS } from './tokens';
import { prefersReducedMotion } from './useMotionPreference';

export type SlotDirection = 'down' | 'up';
export type SlotColor = string | ((index: number, total: number) => string) | null;

export type SlotTextOptions = {
  /** "down" = new glyph enters from above; "up" for forward/advance travel. */
  direction?: SlotDirection;
  /** ms between adjacent character cells. */
  stagger?: number;
  /** ms per character roll. */
  duration?: number;
  /** ms head start the outgoing glyph gets over the incoming one. */
  exitOffset?: number;
  /** CSS easing for the roll itself. */
  easing?: string;
  /** 0..1 personality — per-glyph speed/stagger jitter and settle tilt. */
  bounce?: number;
  /** Arrival color: string, per-glyph fn, or null for a quiet ink-only roll. */
  color?: SlotColor;
  /** ms for the arrival color to settle back to ink. */
  colorFade?: number;
  /** Unchanged characters hold still. */
  skipUnchanged?: boolean;
  /** A new roll cuts a running one (false = let it finish, queue latest). */
  interrupt?: boolean;
};

export type SlotFlashOptions = {
  /** ms before the flash rolls back to the resting text. */
  revertAfter?: number;
  /** Option overrides for the roll to the flash text. */
  enter?: SlotTextOptions;
  /** Option overrides for the roll back. */
  exit?: SlotTextOptions;
};

export type SlotTextController = {
  readonly element: HTMLElement;
  readonly value: string;
  set(text: string, options?: SlotTextOptions): void;
  flash(text: string, options?: SlotFlashOptions): void;
  destroy(): void;
};

export const SLOT_TEXT_DEFAULTS = {
  direction: 'down' as SlotDirection,
  stagger: 40,
  duration: 240,
  exitOffset: 50,
  easing: EASE_SLOT_CSS,
  bounce: 0.3,
  color: 'var(--color-arrival)' as SlotColor,
  colorFade: 280,
  skipUnchanged: true,
  interrupt: true,
};

const NBSP = ' ';
const glyph = (char: string) => (char === ' ' ? NBSP : char);

type SlotState = {
  timers: number[];
  target: string;
  pending?: { text: string; options: SlotTextOptions };
};

const states = new WeakMap<HTMLElement, SlotState>();

/* --- Inline structural styles (the splitText pattern — no global CSS) ---- */

function styleContainer(el: HTMLElement) {
  el.setAttribute('data-slot-text', '');
  el.style.display = 'inline-flex';
  el.style.whiteSpace = 'pre';
}

function makeSrText(text: string): HTMLSpanElement {
  const sr = document.createElement('span');
  sr.setAttribute('data-slot-sr', '');
  // Visually hidden, present for assistive tech — inlined so the engine
  // never depends on a utility class materializing from a .ts string.
  Object.assign(sr.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  });
  sr.textContent = text;
  return sr;
}

function makeFace(char: string): HTMLSpanElement {
  const face = document.createElement('span');
  face.setAttribute('data-slot-face', '');
  Object.assign(face.style, {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre',
  });
  face.textContent = glyph(char);
  return face;
}

function buildSlot(char: string): HTMLSpanElement {
  const slot = document.createElement('span');
  slot.setAttribute('data-slot-cell', '');
  slot.dataset.char = char;
  Object.assign(slot.style, {
    position: 'relative',
    display: 'inline-flex',
    // Never flex-shrink: when overflow stops being visible the automatic
    // minimum size drops to 0 and a constrained line would crush the cells.
    flex: 'none',
    justifyContent: 'center',
    // Clip only vertically: the roll needs a top/bottom mask, but glyph side
    // bearings, kerning overhang and the settle tilt must stay visible.
    // (visible + clip is the one mixed overflow pair the spec allows.)
    overflowX: 'visible',
    overflowY: 'clip',
    verticalAlign: 'bottom',
  });
  // Invisible sizer keeps the cell exactly the width/height of its glyph, so
  // the absolutely-positioned animating faces never reflow the line.
  const sizer = document.createElement('span');
  sizer.setAttribute('data-slot-sizer', '');
  Object.assign(sizer.style, { visibility: 'hidden', whiteSpace: 'pre' });
  sizer.textContent = glyph(char);
  slot.append(sizer, makeFace(char));
  return slot;
}

/* --- Engine ---------------------------------------------------------------- */

/** Cancel any running roll and snap the container to its target text. */
function settle(container: HTMLElement) {
  const state = states.get(container);
  if (!state) return;
  state.timers.forEach((t) => window.clearTimeout(t));
  states.delete(container);
  buildSlotText(container, state.target);
}

/**
 * Build a container into per-character roll cells showing `text`.
 * Screen readers get the label ONCE: a visually-hidden plain-text copy
 * carries the accessible name while the cells are aria-hidden.
 */
export function buildSlotText(container: HTMLElement, text: string): void {
  styleContainer(container);
  const cells = Array.from(text, buildSlot);
  cells.forEach((c) => c.setAttribute('aria-hidden', 'true'));
  container.replaceChildren(makeSrText(text), ...cells);
}

/** Roll a built container to `toText`. */
export function animateSlotText(
  container: HTMLElement,
  toText: string,
  options: SlotTextOptions = {}
): void {
  const {
    direction,
    stagger,
    duration,
    exitOffset,
    easing,
    bounce,
    color,
    colorFade,
    skipUnchanged,
    interrupt,
  } = { ...SLOT_TEXT_DEFAULTS, ...options };

  // Reduced motion: no roll, no flash — the label just becomes its new value.
  if (prefersReducedMotion()) {
    settle(container);
    buildSlotText(container, toText);
    return;
  }

  // Non-interrupting mode: if a roll is already in flight, let it finish and
  // remember this request instead. Only the latest request survives, so spam
  // taps coalesce into a single follow-up roll once the current one lands.
  const running = states.get(container);
  if (running && !interrupt) {
    if (toText !== running.target) {
      running.pending = { text: toText, options };
    }
    return;
  }

  // Interrupt: fast-forward any running roll to its target and tear down its
  // timers before starting fresh, so mid-roll changes never overlap.
  settle(container);

  // First run / empty container → just build it.
  if (!container.querySelector('[data-slot-cell]')) {
    buildSlotText(container, toText);
    return;
  }

  // Defensive: consumers that rewrite style/attrs between rolls must not
  // strand the cells without the container's flex/pre styles.
  styleContainer(container);

  // The accessible name updates immediately — assistive tech should not
  // have to wait out the animation to learn the new value.
  const sr = container.querySelector<HTMLElement>('[data-slot-sr]');
  if (sr) sr.textContent = toText;

  const slots = Array.from(container.querySelectorAll<HTMLElement>('[data-slot-cell]'));
  const fromText = slots.map((s) => s.dataset.char ?? '').join('');

  // Non-interrupting mode also drops rolls to the text already on screen, so
  // repeated triggers do not visibly re-roll an unchanged label.
  if (!interrupt && fromText === toText) return;

  const maxLen = Math.max(fromText.length, toText.length);

  // Whole-pixel slide distance = one cell height, so glyphs clip cleanly.
  // Ceil, not round: half a pixel short leaves a sliver of the outgoing
  // glyph visible at the clip edge.
  const sample = slots.find((s) => (s.dataset.char ?? '') !== '') ?? slots[0];
  const cs = getComputedStyle(container);
  const H =
    Math.ceil(
      sample?.getBoundingClientRect().height ||
        sample?.offsetHeight ||
        container.getBoundingClientRect().height ||
        parseFloat(cs.lineHeight) ||
        0
    ) ||
    Math.ceil(parseFloat(cs.fontSize) * 1.3) ||
    18;

  // Resting color the arrival flash settles back to.
  const restColor = color ? cs.color : '';

  // Pre-create any extra cells up front so the row never reflows mid-roll.
  for (let i = slots.length; i < maxLen; i++) {
    const slot = buildSlot('');
    slot.setAttribute('aria-hidden', 'true');
    container.appendChild(slot);
    slots.push(slot);
  }

  const timers: number[] = [];
  const state: SlotState = { timers, target: toText };
  states.set(container, state);

  // down: new enters from above (-H to 0), old exits below (0 to +H)
  // up:   new enters from below (+H to 0), old exits above (0 to -H)
  const outY = direction === 'down' ? H : -H;
  const inStart = direction === 'down' ? -H : H;

  // A tiny deterministic jitter in [-1, 1] per character. Scaled by `bounce`
  // it gives each glyph its own speed and a little tilt-wobble, so the line
  // does not land as one rigid block.
  const wobble = (i: number, salt: number) => {
    const n = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  };

  // Track the slowest letter so the safety-net snap waits for everyone.
  let maxEnd = 0;

  for (let i = 0; i < maxLen; i++) {
    const fromChar = fromText[i] || '';
    const toChar = toText[i] || '';
    if (fromChar === toChar && (skipUnchanged || fromChar === '')) continue;

    const slot = slots[i];
    const sizer = slot.querySelector<HTMLElement>('[data-slot-sizer]')!;
    const oldFace = slot.querySelector<HTMLElement>('[data-slot-face]');

    // Resize the cell to the new glyph — but ease the width instead of
    // snapping it, so a wide outgoing glyph (W → i) is never cropped by a
    // suddenly-narrow cell and neighbouring letters glide rather than jump.
    const oldW = slot.getBoundingClientRect().width;
    sizer.textContent = glyph(toChar);
    const newW = sizer.getBoundingClientRect().width;
    const widthChanges = Math.abs(newW - oldW) > 0.5;
    if (widthChanges) slot.style.width = `${oldW}px`;

    // A cell growing from or collapsing to empty changes width drastically —
    // clip it horizontally while it resizes so its glyph wipes in/out with
    // the cell instead of spilling over the neighbours.
    if (fromChar === '' || toChar === '') slot.style.overflowX = 'clip';

    const tint = typeof color === 'function' ? color(i, maxLen) : color;

    // Per-letter personality: vary the speed, the stagger and a starting
    // tilt that springs back upright as the glyph settles. Tail cells
    // (rolling out to nothing) join the same wave instead of queuing behind
    // it, so nothing trails after the new word has landed.
    const isTail = toChar === '';
    const d = Math.round(duration * (isTail ? 0.75 : 1) * (1 + bounce * 0.45 * wobble(i, 1)));
    const staggerIndex = isTail ? toText.length * 0.5 + (i - toText.length) * 0.25 : i;
    const base = Math.round(staggerIndex * stagger * (1 + bounce * 0.25 * wobble(i, 2)));
    const tilt = (bounce * 5 * wobble(i, 3)).toFixed(2);

    const rollTrans = `transform ${d}ms ${easing}`;
    const trans = color ? `${rollTrans}, color ${colorFade}ms linear ${d}ms` : rollTrans;

    const newFace = makeFace(toChar);
    newFace.style.willChange = 'transform';
    newFace.style.transformOrigin = '50% 50%';
    newFace.style.transform = `translateY(${inStart}px) rotate(${tilt}deg)`;
    if (tint) newFace.style.color = tint;
    slot.appendChild(newFace);

    void slot.offsetWidth; // commit start transforms

    // Glide the cell to its new width with a clean ease-out (no overshoot):
    //  - glyph → glyph: resize alongside the roll.
    //  - glyph → empty: roll out vertically at full width FIRST, then close
    //    the empty cell quickly — the exit reads as a roll, not a crush.
    //  - empty → glyph: open the cell quickly BEFORE the glyph rolls in.
    if (widthChanges) {
      let wDelay = base;
      let wDur = d;
      if (isTail) {
        wDelay = base + Math.round(d * 0.55);
        wDur = Math.max(140, Math.round(d * 0.6));
      } else if (fromChar === '') {
        wDur = Math.max(140, Math.round(d * 0.45));
      }
      timers.push(
        window.setTimeout(() => {
          slot.style.transition = `width ${wDur}ms cubic-bezier(0.2, 0, 0, 1)`;
          slot.style.width = `${newW}px`;
        }, wDelay)
      );
      maxEnd = Math.max(maxEnd, wDelay + wDur);
    }

    maxEnd = Math.max(maxEnd, base + exitOffset + d + (color ? colorFade : 0));

    // Outgoing glyph slides away first (with its own little counter-tilt).
    if (oldFace) {
      timers.push(
        window.setTimeout(() => {
          oldFace.style.willChange = 'transform';
          oldFace.style.transition = rollTrans;
          oldFace.style.transform = `translateY(${outY}px) rotate(${-Number(tilt)}deg)`;
        }, base)
      );
    }

    // Incoming glyph chases it in, then fades from arrival blue to ink.
    timers.push(
      window.setTimeout(() => {
        newFace.style.transition = trans;
        newFace.style.transform = 'translateY(0) rotate(0deg)';
        if (color) newFace.style.color = restColor;
        const done = (e: TransitionEvent) => {
          if (e.propertyName !== 'transform') return; // ignore the colour fade
          newFace.removeEventListener('transitionend', done);
          slot.dataset.char = toChar;
          // Hand sizing back to the sizer (same px, so nothing visibly moves).
          slot.style.removeProperty('transition');
          slot.style.removeProperty('width');
          slot.style.overflowX = 'visible';
          slot.querySelectorAll('[data-slot-face]').forEach((f) => {
            if (f !== newFace) f.remove();
          });
        };
        newFace.addEventListener('transitionend', done);
      }, base + exitOffset)
    );
  }

  // Safety net: snap to a pristine DOM once the slowest letter has settled.
  // (jsdom never fires transitionend — this rebuild is also what makes the
  // engine testable.) If a non-interrupting call was deferred mid-roll,
  // replay it now.
  const total = maxEnd + 80;
  timers.push(
    window.setTimeout(() => {
      const pending = state.pending;
      states.delete(container);
      buildSlotText(container, toText);
      if (pending) {
        animateSlotText(container, pending.text, pending.options);
      }
    }, total)
  );
}

/** Tear the cells down and restore a plain text node. */
export function clearSlotText(container: HTMLElement, text = ''): void {
  settle(container);
  container.removeAttribute('data-slot-text');
  container.style.removeProperty('display');
  container.style.removeProperty('white-space');
  container.textContent = text;
}

/**
 * Controller for one element — the everyday API. `flash` rolls to a
 * transient label (Copied, Opening form…) and auto-reverts to the resting
 * text; spammed flashes coalesce into one revert.
 */
export function attachSlotText(
  element: HTMLElement,
  initialText: string,
  options: SlotTextOptions = {}
): SlotTextController {
  let value = initialText;
  let revertTimeout: number | undefined;
  let restingText: string | undefined;
  buildSlotText(element, initialText);
  return {
    element,
    get value() {
      return value;
    },
    set(text, nextOptions = {}) {
      // An explicit set wins over a pending flash revert.
      window.clearTimeout(revertTimeout);
      restingText = undefined;
      value = text;
      animateSlotText(element, text, { ...options, ...nextOptions });
    },
    flash(text, { revertAfter = 1400, enter, exit }: SlotFlashOptions = {}) {
      // Capture the resting text only on the first flash of a burst, so a
      // flash-during-flash still reverts to the original label.
      if (restingText === undefined) {
        restingText = value;
      }
      value = text;
      animateSlotText(element, text, { ...options, interrupt: false, ...enter });
      window.clearTimeout(revertTimeout);
      revertTimeout = window.setTimeout(() => {
        const back = restingText as string;
        restingText = undefined;
        revertTimeout = undefined;
        value = back;
        animateSlotText(element, back, { ...options, interrupt: false, ...exit });
      }, revertAfter);
    },
    destroy() {
      window.clearTimeout(revertTimeout);
      clearSlotText(element, value);
    },
  };
}
