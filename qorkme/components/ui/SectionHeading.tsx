'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import LabelPill from './LabelPill';
import { RevealText } from '@/lib/motion/RevealText';
import { useInViewOnce } from '@/lib/motion/useInViewOnce';
import { useMotionPreference } from '@/lib/motion/useMotionPreference';
import { decode } from '@/lib/motion/decode';
import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
  /** Mono label, e.g. "01 // Services" */
  label: string;
  /** The display heading */
  title: string;
  /** Optional mono subtitle line under the heading */
  subtitle?: string;
  /** Extra row content rendered beside the pill (e.g. terminal boot line) */
  aside?: ReactNode;
  align?: 'left' | 'center';
};

/**
 * The consistent section-heading system: label pill decodes (scramble →
 * resolve), heading rises word-by-word (RevealText/anime), hairline draws.
 * One IO trigger for the whole composite; reduced motion = static.
 */
export default function SectionHeading({
  label,
  title,
  subtitle,
  aside,
  align = 'left',
}: SectionHeadingProps) {
  const pillTextRef = useRef<HTMLSpanElement | null>(null);
  const decodedRef = useRef(false);
  const reduced = useMotionPreference();
  const [inViewRef, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.4 });

  useEffect(() => {
    if (!inView || decodedRef.current) return;
    decodedRef.current = true;
    if (!reduced && pillTextRef.current) decode(pillTextRef.current);
  }, [inView, reduced]);

  return (
    <div
      ref={inViewRef}
      className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}
      data-in-view={inView || undefined}
    >
      <div className={styles.labelRow}>
        <LabelPill>
          <span ref={pillTextRef}>{label}</span>
        </LabelPill>
        {aside}
      </div>
      <RevealText text={title} as="h2" mode="words" className={styles.title} threshold={0.4} />
      <span className={styles.rule} aria-hidden="true" />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
