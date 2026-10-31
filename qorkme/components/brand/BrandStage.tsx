'use client';

import { Fragment, useRef, useEffect, useState, type RefObject } from 'react';
import { useMotionPreference } from './MotionPreference';
import { EffectCanvas } from './EffectCanvas';
import styles from './BrandStage.module.css';

function EffectText({
  text,
  region,
  paused,
  pulse,
}: {
  text: string;
  region: RefObject<HTMLDivElement | null>;
  paused: boolean;
  pulse: number;
}) {
  const mask = useRef<HTMLSpanElement>(null);
  return (
    <span ref={mask} className={styles.text}>
      {text}
      <EffectCanvas
        kind="hologram"
        region={region}
        mask={mask}
        text={text}
        paused={paused}
        pulse={pulse}
      />
    </span>
  );
}

export function BrandStage({
  compact = false,
  heading = false,
  pulse = 0,
  text = 'QORK.ME',
  expanded = false,
  variant = 'wordmark',
}: {
  compact?: boolean;
  heading?: boolean;
  pulse?: number;
  text?: string | string[];
  expanded?: boolean;
  variant?: 'wordmark' | 'headline';
}) {
  const region = useRef<HTMLDivElement>(null);
  const { paused } = useMotionPreference();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const host = region.current;
    if (!host || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  const Tag = heading ? 'h1' : 'div';
  const phrases = typeof text === 'string' ? [text] : text;
  const label = phrases.join(' ');
  return (
    <div
      ref={region}
      className={`${styles.stage} ${compact ? styles.compact : ''} ${expanded ? styles.expanded : ''} ${variant === 'headline' ? styles.headline : ''}`}
    >
      <EffectCanvas kind="dither" region={region} paused={paused || !visible} pulse={pulse} />
      <Tag className={styles.wordmark} aria-label={label === 'QORK.ME' ? 'QorkMe' : label}>
        {phrases.map((phrase, index) => (
          <Fragment key={index}>
            {index > 0 ? ' ' : null}
            <EffectText text={phrase} region={region} paused={paused || !visible} pulse={pulse} />
          </Fragment>
        ))}
      </Tag>
    </div>
  );
}
