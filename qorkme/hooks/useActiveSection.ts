'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Scroll-spy: returns the id of the section currently crossing the focal
 * band (40% from the top of the viewport). IntersectionObserver only —
 * no scroll math, no ResizeObserver.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(',');
  const stableIds = useMemo(() => key.split(',').filter(Boolean), [key]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || stableIds.length === 0) {
      return;
    }

    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        setActive(stableIds.find((id) => inBand.has(id)) ?? null);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const id of stableIds) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [stableIds]);

  return active;
}
