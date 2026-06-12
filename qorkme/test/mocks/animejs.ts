import { vi } from 'vitest';

/**
 * anime.js v4 mock — auto-applied via src/test/setup.ts.
 * Animations are no-ops; components must render correct final-state DOM with
 * this mock active (the splitText splitter renders real text server-side).
 */

type AnyRecord = Record<string, unknown>;

const makeAnimation = () => {
  const anim: AnyRecord = {
    completed: true,
    duration: 1000,
  };
  anim.play = vi.fn(() => anim);
  anim.pause = vi.fn(() => anim);
  anim.resume = vi.fn(() => anim);
  anim.restart = vi.fn(() => anim);
  anim.revert = vi.fn(() => anim);
  anim.cancel = vi.fn(() => anim);
  anim.seek = vi.fn(() => anim);
  anim.complete = vi.fn(() => anim);
  anim.then = (cb?: (v: unknown) => unknown) => Promise.resolve(cb?.(anim));
  return anim;
};

export const animate = vi.fn(() => makeAnimation());
export const createTimer = vi.fn(() => makeAnimation());

export const createTimeline = vi.fn(() => {
  const tl = makeAnimation();
  tl.add = vi.fn(() => tl);
  tl.set = vi.fn(() => tl);
  tl.label = vi.fn(() => tl);
  tl.init = vi.fn(() => tl);
  tl.call = vi.fn(() => tl);
  return tl;
});

export const stagger = vi.fn(() => () => 0);
export const createSpring = vi.fn(() => ({}));
export const cubicBezier = vi.fn(() => (t: number) => t);

export const createScope = vi.fn(() => {
  const scope: AnyRecord = { matches: {}, methods: {} };
  scope.add = vi.fn((fn: unknown) => {
    if (typeof fn === 'function') fn(scope);
    return scope;
  });
  scope.revert = vi.fn();
  return scope;
});

export const svg = {
  createDrawable: vi.fn(() => [{ draw: '0 0' }]),
};

export const utils = {
  $: vi.fn(() => []),
  get: vi.fn(() => 0),
  set: vi.fn(),
  remove: vi.fn(),
  random: vi.fn(() => 0),
  clamp: (v: number, min: number, max: number) => Math.min(max, Math.max(min, v)),
  round: (v: number) => Math.round(v),
};

export const engine = {
  fps: 60,
  precision: 4,
  pauseOnDocumentHidden: true,
};
