'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor-proximity glow: one passive pointermove listener on a grid
 * container writes --mx/--my custom properties on each [data-glow] child,
 * which a CSS ::before radial-gradient reads. Cards react to the pointer
 * BEFORE hover (proximity, not entry) — pure CSS paints, rAF-gated writes.
 */
export function useProximityGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let raf: number | null = null;
    const point = { x: 0, y: 0 };

    const apply = () => {
      raf = null;
      const cards = container.querySelectorAll<HTMLElement>('[data-glow]');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${point.x - rect.left}px`);
        card.style.setProperty('--my', `${point.y - rect.top}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      point.x = e.clientX;
      point.y = e.clientY;
      if (raf == null) raf = requestAnimationFrame(apply);
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      container.removeEventListener('pointermove', onMove);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
