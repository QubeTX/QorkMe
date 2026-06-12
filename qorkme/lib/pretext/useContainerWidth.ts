'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { subscribe } from './resizeCoordinator';

/**
 * Measures container width synchronously via clientWidth.
 * Uses window.resize + RAF gate (via resizeCoordinator) — NEVER ResizeObserver.
 *
 * For shrinkwrap elements: temporarily clears max-width before reading
 * to get the unconstrained width. No visual flash because the browser
 * doesn't paint mid-JS execution.
 */
export function useContainerWidth(
  shrinkwrap?: boolean
): [refCallback: (node: HTMLElement | null) => void, width: number] {
  const [width, setWidth] = useState(0);
  const nodeRef = useRef<HTMLElement | null>(null);

  const measure = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return;

    if (shrinkwrap) {
      const prev = el.style.maxWidth;
      el.style.maxWidth = 'none';
      const w = el.clientWidth;
      el.style.maxWidth = prev;
      setWidth(w);
    } else {
      setWidth(el.clientWidth);
    }
  }, [shrinkwrap]);

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;
      if (node) {
        // Measure immediately on mount
        if (shrinkwrap) {
          const prev = node.style.maxWidth;
          node.style.maxWidth = 'none';
          const w = node.clientWidth;
          node.style.maxWidth = prev;
          setWidth(w);
        } else {
          setWidth(node.clientWidth);
        }
      }
    },
    [shrinkwrap]
  );

  useEffect(() => {
    return subscribe(measure);
  }, [measure]);

  return [refCallback, width];
}
