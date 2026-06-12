'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { prepare, layout } from '@chenglou/pretext';

type PretextContextValue = {
  isReady: boolean;
  prepare: typeof prepare;
  layout: typeof layout;
};

const PretextContext = createContext<PretextContextValue>({
  isReady: false,
  prepare,
  layout,
});

/**
 * The font CSS variables whose resolved families Pretext measures against.
 * next/font rewrites family names (e.g. "__makira_a1b2c3"), so readiness
 * checks must resolve the *computed* names at runtime — literal family
 * names can never match and would force the degradation timeout.
 */
const FONT_VARS = ['--font-display', '--font-mono', '--font-sans'];

function resolveRequiredFonts(): string[] {
  const probe = document.createElement('span');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.body.appendChild(probe);

  const families = new Set<string>();
  for (const cssVar of FONT_VARS) {
    probe.style.fontFamily = `var(${cssVar})`;
    const first = getComputedStyle(probe).fontFamily.split(',')[0]?.trim();
    const name = first?.replace(/^['"]|['"]$/g, '');
    if (name) families.add(name);
  }
  probe.remove();

  return [...families].map((name) => `16px "${name}"`);
}

export function PretextProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const requiredFonts = resolveRequiredFonts();
      const allLoaded = () => requiredFonts.every((f) => document.fonts.check(f));
      if (allLoaded()) {
        setIsReady(true);
      } else {
        // Fonts may still be loading — poll briefly
        const interval = setInterval(() => {
          if (cancelled) {
            clearInterval(interval);
            return;
          }
          if (allLoaded()) {
            setIsReady(true);
            clearInterval(interval);
          }
        }, 100);
        // Give up after 3s — graceful degradation
        setTimeout(() => {
          clearInterval(interval);
          if (!cancelled) setIsReady(true);
        }, 3000);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PretextContext value={{ isReady, prepare, layout }}>{children}</PretextContext>;
}

export function usePretextContext() {
  return useContext(PretextContext);
}
