/**
 * Sole import point for animejs (v4).
 *
 * Every animation file imports from here, never from 'animejs' directly —
 * this gives tests a single mock seam and keeps the imported surface
 * auditable. anime.js is ESM/tree-shakeable; only what's re-exported below
 * ends up in the bundle.
 */
export {
  animate,
  createTimeline,
  createTimer,
  createScope,
  createSpring,
  cubicBezier,
  stagger,
  svg,
  utils,
  engine,
} from 'animejs';
