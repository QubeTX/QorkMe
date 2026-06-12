/**
 * QubeTX motion system.
 *
 * OWNERSHIP RULES (one animation owner per element property):
 * - anime.js  — DotGrid values, ScrollTrace timeline, text reveals/decode/
 *               typewriter, letter rolls, logo disassemble, Konami boot.
 * - Framer    — AnimatePresence exits, layoutId indicators, whileInView card
 *               entrances, whileTap squash, useScroll MotionValues.
 * - raw rAF   — CustomCursor engine, useMagnetic.
 * - CSS       — simple hovers (brackets, underlines, gradient sweeps, blink).
 * Never two owners writing the same property on the same node. An element
 * with FM variants must not also be an anime target — anime targets live one
 * level down (split spans, SVG paths).
 *
 * Reduced motion = skip to final state (useMotionPreference), never slower.
 * Scroll triggers = IntersectionObserver (useInViewOnce). Scrubbing = Lenis.
 * NO ResizeObserver — resizes go through src/lib/pretext/resizeCoordinator.
 */
export {
  animate,
  createTimeline,
  createTimer,
  createScope,
  createSpring,
  stagger,
  svg,
  utils,
  engine,
} from './anime';
export { EASE, EASE_CSS, EASE_ANIME, EASE_SLOT_CSS, DUR, MS, STAGGER_MS, SPRING } from './tokens';
export {
  createContainerVariants,
  slideUpVariants,
  slideLeftVariants,
  heroItemVariants,
  sectionTitleAnimation,
} from './variants';
export { useMotionPreference, prefersReducedMotion } from './useMotionPreference';
export { useInViewOnce } from './useInViewOnce';
export { useAnimeScope } from './useAnimeScope';
export { splitText, type SplitMode } from './splitText';
export { RevealText } from './RevealText';
export {
  buildSlotText,
  animateSlotText,
  clearSlotText,
  attachSlotText,
  SLOT_TEXT_DEFAULTS,
  type SlotTextOptions,
  type SlotFlashOptions,
  type SlotTextController,
  type SlotDirection,
  type SlotColor,
} from './slotText';
export { SlotRoll, useSlotRoll } from './SlotRoll';
export { useMagnetic } from './useMagnetic';
export { hexToRgb, buildColorRamp, rampIndex } from './colorRamp';
export {
  computeGrid,
  nearestDotIndex,
  DOT_PITCH,
  MAX_DOTS,
  type Dot,
  type DotGridGeometry,
} from './dotGridGeometry';
