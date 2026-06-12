'use client';

import { useEffect } from 'react';
import { createTimeline, stagger, utils } from '@/lib/motion/anime';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { EASE_ANIME } from '@/lib/motion/tokens';
import { decode } from '@/lib/motion/decode';
import { firePulse } from './DotGrid';
import { BOOT_DONE_EVENT } from './BootScreen';

/**
 * The page-load timeline (single anime.js owner for header + hero entrance —
 * these elements carry data-load attributes and NO Framer Motion variants).
 *
 * FOUC guard: an inline script in layout.tsx sets html[data-loading] before
 * first paint (CSS hides [data-load] under it, 3s failsafe removal). This
 * component sets the real initial transforms, lifts the attribute, then
 * plays. Reduced motion: attribute lifted, no animation, final state.
 */
export default function LoadSequence() {
  useEffect(() => {
    const html = document.documentElement;
    const finish = () => html.removeAttribute('data-loading');

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    // While the BootScreen overlay is armed, hold the entrance — it starts
    // on boot completion so the hero plays as the overlay fades
    let cleanup: (() => void) | undefined;
    const startEntrance = () => {
      cleanup = run();
    };
    if (html.hasAttribute('data-boot')) {
      window.addEventListener(BOOT_DONE_EVENT, startEntrance, { once: true });
      return () => {
        window.removeEventListener(BOOT_DONE_EVENT, startEntrance);
        cleanup?.();
        finish();
      };
    }
    startEntrance();
    return () => {
      cleanup?.();
      finish(); // never leave content hidden, whatever unmounts us
    };

    function run(): () => void {
      const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));
      const header = q('[data-load="header"]');
      const eyebrow = q('[data-load="eyebrow"]');
      const decodeTarget = document.querySelector<HTMLElement>('[data-load-decode]');
      const lines = q('[data-load="hl"]');
      const gradient = document.querySelector<HTMLElement>('[data-load-gradient]');
      const desc = q('[data-load="desc"]');
      const ctas = q('[data-load="cta"]');
      const company = q('[data-load="company"]');

      // Real initial states (inline) before lifting the CSS guard
      if (header.length) utils.set(header, { y: -12, opacity: 0 });
      if (eyebrow.length) utils.set(eyebrow, { opacity: 0 });
      if (lines.length) utils.set(lines, { y: '112%' });
      if (gradient) utils.set(gradient, { backgroundPosition: '120% 0%' });
      if (desc.length) utils.set(desc, { opacity: 0, y: 14 });
      if (ctas.length) utils.set(ctas, { opacity: 0, y: 16 });
      if (company.length) utils.set(company, { opacity: 0 });
      finish();

      const tl = createTimeline({ defaults: { ease: EASE_ANIME } });
      if (header.length) {
        tl.add(header, { y: 0, opacity: 1, duration: 500, delay: stagger(60) }, 0);
      }
      if (eyebrow.length) tl.add(eyebrow, { opacity: 1, duration: 200 }, 250);
      tl.call(() => {
        if (decodeTarget) decode(decodeTarget);
      }, 300);
      if (lines.length) {
        tl.add(lines, { y: '0%', duration: 750, delay: stagger(90) }, 380);
      }
      if (gradient) {
        tl.add(gradient, { backgroundPosition: '0% 0%', duration: 900 }, 800);
      }
      if (desc.length) tl.add(desc, { opacity: 1, y: 0, duration: 600 }, 950);
      if (ctas.length) {
        tl.add(ctas, { opacity: 1, y: 0, duration: 500, delay: stagger(80) }, 1050);
      }
      if (company.length) tl.add(company, { opacity: 1, duration: 500 }, 1150);
      tl.call(() => {
        // "System online" beat — one ripple from the field's bright corner
        firePulse({
          x: window.innerWidth * 0.85,
          y: window.innerHeight * 0.8,
          strength: 1.8,
        });
      }, 1200);

      return () => {
        tl.pause();
      };
    }
  }, []);

  return null;
}
