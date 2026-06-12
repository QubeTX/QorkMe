'use client';

import { useSyncExternalStore } from 'react';

/**
 * Single module-level prefers-reduced-motion store.
 *
 * Policy: reduced motion means SKIP TO FINAL STATE — never "slower versions".
 * Every motion primitive consults this (hook for components, getter for
 * imperative code like easter eggs and the cursor engine).
 */
const QUERY = '(prefers-reduced-motion: reduce)';

let mql: MediaQueryList | null = null;

function getMql(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  if (!mql) mql = window.matchMedia(QUERY);
  return mql;
}

function subscribe(callback: () => void): () => void {
  const m = getMql();
  if (!m) return () => {};
  m.addEventListener('change', callback);
  return () => m.removeEventListener('change', callback);
}

/** Imperative check for non-React code paths. */
export function prefersReducedMotion(): boolean {
  return getMql()?.matches ?? false;
}

/** Reactive check — re-renders when the OS preference flips. */
export function useMotionPreference(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
