/**
 * Motion design tokens — single source of truth shared by Framer Motion,
 * anime.js, and CSS (via --ease-out in globals.css).
 *
 * Character (cash.app-derived): intentional (punchy, ramped, never
 * indecisive), effortless (smooth, flowing), organic (anchored to physics).
 */

import { cubicBezier } from './anime';

/** The house easing — identical curve in all three notations. */
export const EASE = [0.25, 1, 0.5, 1] as const;
export const EASE_CSS = 'cubic-bezier(0.25, 1, 0.5, 1)';
/** anime.js 4.4 removed the string syntax — this is the easing *function*. */
export const EASE_ANIME = cubicBezier(0.25, 1, 0.5, 1);

/**
 * Slot-roll spring overshoot (CSS notation, used as a transition easing by
 * the slotText engine). Distinct from the house EASE — the roll lands with a
 * small overshoot; everything else stays on the no-overshoot house curve.
 */
export const EASE_SLOT_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/** Durations in seconds (Framer Motion). */
export const DUR = {
  micro: 0.18,
  fast: 0.3,
  base: 0.55,
  slow: 0.8,
  hero: 1.1,
} as const;

/** Durations in milliseconds (anime.js). */
export const MS = {
  micro: 180,
  fast: 300,
  base: 550,
  slow: 800,
  hero: 1100,
} as const;

/** Stagger steps in milliseconds (anime.js `stagger()`). */
export const STAGGER_MS = {
  chars: 18,
  words: 40,
  lines: 90,
  cards: 80,
  nav: 60,
} as const;

/** Framer Motion spring presets. */
export const SPRING = {
  /** Button press release — overshoots ~1.03 then settles. */
  press: { type: 'spring', stiffness: 600, damping: 18 },
  /** Card lift/tilt. */
  card: { type: 'spring', stiffness: 260, damping: 22 },
  /** Gentle return (magnetic release, icon settle). */
  soft: { type: 'spring', stiffness: 120, damping: 14 },
} as const;
