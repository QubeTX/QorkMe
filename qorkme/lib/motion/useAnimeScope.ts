'use client';

import { useEffect, type RefObject } from 'react';
import { createScope } from './anime';

type Scope = ReturnType<typeof createScope>;

/**
 * Mounts an anime.js scope rooted at `rootRef` and reverts it on unmount —
 * every animation/timer created inside the constructor is cleaned up
 * automatically, no manual bookkeeping.
 *
 * The scope registers a `reduced` media query: inside the constructor,
 * check `scope.matches.reduced` and skip to final state when true (the
 * constructor re-runs when the preference flips).
 */
export function useAnimeScope(
  rootRef: RefObject<HTMLElement | null>,
  build: (scope: Scope) => void,
  deps: unknown[] = []
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scope = createScope({
      root,
      mediaQueries: { reduced: '(prefers-reduced-motion: reduce)' },
    }).add((self) => {
      build((self ?? scope) as Scope);
    });

    return () => {
      scope.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
