'use client';

import type { FC, PointerEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowRight } from './icons';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import styles from './OutlineButton.module.css';

type OutlineButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Marks the element for the cursor's magnetic docking mode */
  magnetic?: boolean;
  /** 'sm' = compact header CTA, 'md' = default */
  size?: 'sm' | 'md';
  /**
   * External destinations: the label slot-rolls to this teaser on hover and
   * rolls back on leave (mouse only — the destination rule: leaving the site
   * announces itself on hover). Requires `children` to be a plain string.
   */
  hoverLabel?: string;
  /**
   * Internal destinations: the label click-flashes to this and auto-reverts
   * (~1.4s) — interaction feedback, per the destination rule.
   */
  flashLabel?: string;
};

/**
 * The outlined GET STARTED → CTA from the mockup: 1px brand-blue border,
 * gradient sweep fill on hover (CSS), cash.app-style squash on press (FM).
 *
 * Slot-roll labels are quiet (ink-only): the hovered face is the brand
 * gradient, where the arrival blue would vanish. A hidden sizer stack
 * reserves the wider label's width so rolls never resize the button
 * (hover-driven shifts are NOT input-exempt for CLS).
 */
const OutlineButton: FC<OutlineButtonProps> = ({
  href,
  children,
  className,
  magnetic,
  size = 'md',
  hoverLabel,
  flashLabel,
}) => {
  const isExternal = /^https?:\/\//.test(href);
  const resting = typeof children === 'string' ? children : '';
  const altLabel = hoverLabel ?? flashLabel;
  const rollable = resting !== '' && altLabel !== undefined;
  const [rollRef, roll] = useSlotRoll(resting, { color: null });

  const onPointerEnter = (e: PointerEvent) => {
    if (!rollable || !hoverLabel || e.pointerType !== 'mouse') return;
    roll.set(hoverLabel, { direction: 'up' });
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (!rollable || !hoverLabel || e.pointerType !== 'mouse') return;
    roll.set(resting, { direction: 'down' });
  };
  const onClick = () => {
    if (!rollable || !flashLabel) return;
    roll.flash(flashLabel);
  };

  return (
    <motion.a
      href={href}
      className={clsx(styles.button, size === 'sm' && styles.sm, className)}
      data-interactive="true"
      data-magnetic={magnetic ? 'true' : undefined}
      whileTap={{ scaleX: 1.04, scaleY: 0.92 }}
      transition={{ type: 'spring', stiffness: 600, damping: 18 }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {rollable ? (
        <span className={styles.labelText}>
          <span ref={rollRef} className={styles.labelRoll}>
            {resting}
          </span>
          {/* Invisible sizers: the stack is as wide as the widest label, so
              the roll never resizes the button (zero layout shift). */}
          <span className={styles.labelSizer} aria-hidden="true">
            {resting}
          </span>
          <span className={styles.labelSizer} aria-hidden="true">
            {altLabel}
          </span>
        </span>
      ) : (
        <span className={styles.labelText}>{children}</span>
      )}
      <span className={styles.arrow} aria-hidden="true">
        <ArrowRight size={16} strokeWidth={2} />
      </span>
      {isExternal && <span className="sr-only">(opens in a new tab)</span>}
    </motion.a>
  );
};

export default OutlineButton;
