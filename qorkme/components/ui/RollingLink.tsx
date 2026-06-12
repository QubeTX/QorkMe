'use client';

import { useRef, type FC } from 'react';
import { animate, stagger, utils } from '@/lib/motion/anime';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { STAGGER_MS } from '@/lib/motion/tokens';
import styles from './RollingLink.module.css';

type RollingLabelProps = {
  text: string;
};

/**
 * Letter-roll hover label (cash.app typography physicality): each character
 * is two stacked copies in an overflow-hidden mask; on hover the stack
 * rolls up 100%, staggered left → right; rolls back on leave. anime.js
 * owns the inner spans — attach inside any link/button.
 *
 * Mono/letter-spaced text is fine here (no Pretext involvement).
 */
const RollingLabel: FC<RollingLabelProps> = ({ text }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const roll = (toTop: boolean) => {
    if (prefersReducedMotion()) return;
    const targets = ref.current?.querySelectorAll('[data-roll]');
    if (!targets?.length) return;
    utils.remove(targets);
    animate(targets, {
      y: toTop ? '-100%' : '0%',
      duration: 420,
      ease: 'out(4)',
      delay: stagger(STAGGER_MS.chars),
    });
  };

  return (
    <span
      ref={ref}
      className={styles.label}
      aria-label={text}
      onPointerEnter={(e) => e.pointerType === 'mouse' && roll(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && roll(false)}
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.mask} aria-hidden="true">
          <span data-roll className={styles.stack}>
            <span className={styles.char}>{ch === ' ' ? ' ' : ch}</span>
            <span className={styles.char}>{ch === ' ' ? ' ' : ch}</span>
          </span>
        </span>
      ))}
    </span>
  );
};

export default RollingLabel;
