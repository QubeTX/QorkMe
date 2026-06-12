'use client';

import type { FC, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import { useAnchorNav } from '@/hooks/useAnchorNav';
import styles from './TextLink.module.css';

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** Trailing glyph, rendered aria-hidden (e.g. '⠿' for the services link) */
  glyph?: string;
  className?: string;
  /**
   * Internal destinations: the label click-flashes to this and auto-reverts
   * (~1.4s) — the slot roll's interaction feedback, arrival blue settling to
   * ink. Requires `children` to be a plain string. In-page hrefs also route
   * through Lenis (useAnchorNav) so the scroll is smooth, not a hash jump.
   */
  flashLabel?: string;
};

/** Mono uppercase text link with a trailing glyph ("Explore our services ⠿"). */
const TextLink: FC<TextLinkProps> = ({ href, children, glyph, className, flashLabel }) => {
  const isExternal = /^https?:\/\//.test(href);
  const resting = typeof children === 'string' ? children : '';
  const rollable = resting !== '' && flashLabel !== undefined;
  const [rollRef, roll] = useSlotRoll(resting);
  const navigate = useAnchorNav(-88);

  const onClick = (e: MouseEvent) => {
    if (!rollable) return;
    if (navigate(href)) e.preventDefault();
    roll.flash(flashLabel!);
  };

  return (
    <a
      href={href}
      className={clsx(styles.link, className)}
      data-interactive="true"
      onClick={onClick}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <span className={clsx(styles.text, rollable && styles.textStack)}>
        {rollable ? (
          <>
            <span ref={rollRef} className={styles.rollLabel}>
              {resting}
            </span>
            {/* Invisible sizers keep the link as wide as its widest label —
                a flash never shifts the trailing glyph. */}
            <span className={styles.sizer} aria-hidden="true">
              {resting}
            </span>
            <span className={styles.sizer} aria-hidden="true">
              {flashLabel}
            </span>
          </>
        ) : (
          children
        )}
      </span>
      {glyph && (
        <span className={styles.glyph} aria-hidden="true">
          {glyph}
        </span>
      )}
      {isExternal && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
};

export default TextLink;
