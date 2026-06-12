'use client';

import { useEffect, useState } from 'react';

/**
 * True once the window has scrolled past `threshold` px.
 * Passive listener coalesced through a single rAF — drives the header's
 * scrolled state as a class toggle, never per-frame style writes.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf: number | null = null;

    const check = () => {
      raf = null;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(check);
    };

    onScroll(); // initial position (via rAF — no sync setState in effect)
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return scrolled;
}
