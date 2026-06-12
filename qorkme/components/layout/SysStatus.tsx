'use client';

import { useEffect, useRef } from 'react';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import { useMotionPreference } from '@/lib/motion/useMotionPreference';
import styles from './SysStatus.module.css';

/**
 * Footer terminal status line — the slot roll's resident showcase surface:
 * the status word re-rolls on a slow cycle, arrival blue settling to the
 * dim mono ink. Decorative flavor (aria-hidden, like the Konami hint), so
 * it cycles ONLY while visible (continuous IO + tab visibility) and never
 * under reduced motion.
 */

const STATUSES = ['NOMINAL', 'SCANNING', 'SECURE'] as const;
const CYCLE_MS = 7000;

export default function SysStatus() {
  const reduced = useMotionPreference();
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [wordRef, word] = useSlotRoll(STATUSES[0], { direction: 'up' });

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    // Continuous in-view tracking (useInViewOnce is fire-once — wrong tool):
    // the cycle pauses offscreen and in hidden tabs, so the roll only ever
    // plays where someone can see it.
    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(root);

    let at = 0;
    const interval = window.setInterval(() => {
      if (!inView || document.visibilityState !== 'visible') return;
      at = (at + 1) % STATUSES.length;
      word.set(STATUSES[at]);
    }, CYCLE_MS);

    return () => {
      io.disconnect();
      window.clearInterval(interval);
    };
  }, [reduced, word]);

  return (
    <span ref={rootRef} className={styles.sysStatus} aria-hidden="true">
      SYS_STATUS:
      <span className={styles.stack}>
        <span ref={wordRef} className={styles.word}>
          {STATUSES[0]}
        </span>
        {/* Invisible sizers — the stack holds the widest word's width, so the
            cycle never nudges the copyright/Konami hint (zero layout shift) */}
        {STATUSES.map((s) => (
          <span key={s} className={styles.sizer}>
            {s}
          </span>
        ))}
      </span>
    </span>
  );
}
