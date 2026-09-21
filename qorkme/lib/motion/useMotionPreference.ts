'use client';

import { useSyncExternalStore } from 'react';
import { useMotionPreference as useSiteMotion } from '@/components/brand/MotionPreference';

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
  return (
    (getMql()?.matches ?? false) ||
    (typeof document !== 'undefined' &&
      document.querySelector('.site-shell')?.getAttribute('data-paused') === 'true')
  );
}

/** Reactive check — re-renders when the OS preference flips. */
export function useMotionPreference(): boolean {
  const { paused } = useSiteMotion();
  const reduced = useSyncExternalStore(
    subscribe,
    () => getMql()?.matches ?? false,
    () => false
  );
  return paused || reduced;
}
