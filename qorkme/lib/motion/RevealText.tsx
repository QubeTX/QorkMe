'use client';

import { useCallback, useEffect, useRef, type ElementType } from 'react';
import { animate, stagger, utils } from './anime';
import { splitText, type SplitMode } from './splitText';
import { useInViewOnce } from './useInViewOnce';
import { useMotionPreference } from './useMotionPreference';
import { EASE_ANIME, MS, STAGGER_MS } from './tokens';

type RevealTextProps = {
  text: string;
  as?: ElementType;
  mode?: SplitMode;
  className?: string;
  /** Extra delay (ms) once in view. */
  delay?: number;
  /** Per-item stagger (ms); defaults from STAGGER_MS by mode. */
  staggerMs?: number;
  threshold?: number;
};

/**
 * Masked-rise text reveal (anime.js owns the inner spans — never give this
 * element Framer Motion animations on the same nodes).
 *
 * Server renders visible text via splitText; on mount the targets are hidden
 * (y 110%) and rise when scrolled into view. Reduced motion: text stays
 * visible, no animation. Hero load-sequence text does NOT use this — that
 * choreography belongs to LoadSequence.
 */
export function RevealText({
  text,
  as: Tag = 'span',
  mode = 'words',
  className,
  delay = 0,
  staggerMs,
  threshold = 0.5,
}: RevealTextProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const revealedRef = useRef(false);
  const reduced = useMotionPreference();
  const [inViewRef, inView] = useInViewOnce<HTMLElement>({ threshold });

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      elRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  // Hide targets client-side before first reveal (server HTML stays visible).
  useEffect(() => {
    if (reduced || revealedRef.current || inView) return;
    const targets = elRef.current?.querySelectorAll('[data-reveal]');
    if (targets?.length) utils.set(targets, { y: '110%' });
  }, [reduced, inView]);

  useEffect(() => {
    if (!inView || revealedRef.current) return;
    const targets = elRef.current?.querySelectorAll('[data-reveal]');
    if (!targets?.length) return;
    revealedRef.current = true;

    if (reduced) {
      utils.set(targets, { y: '0%' });
      return;
    }

    animate(targets, {
      y: ['110%', '0%'],
      duration: MS.base,
      ease: EASE_ANIME,
      delay: stagger(staggerMs ?? STAGGER_MS[mode], { start: delay }),
    });
  }, [inView, reduced, mode, delay, staggerMs]);

  return (
    <Tag ref={setRefs} className={className} aria-label={text}>
      {splitText(text, mode)}
    </Tag>
  );
}
