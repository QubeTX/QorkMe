'use client';

import { useRef, useEffect, useState } from 'react';
import { useMotionPreference } from './MotionPreference';
import { EffectCanvas } from './EffectCanvas';
import styles from './BrandStage.module.css';

export function BrandStage({
  compact = false,
  heading = false,
  pulse = 0,
  text = 'QORK.ME',
  expanded = false,
}: {
  compact?: boolean;
  heading?: boolean;
  pulse?: number;
  text?: string;
  expanded?: boolean;
}) {
  const region = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLSpanElement>(null);
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
  return (
    <div
      ref={region}
      className={`${styles.stage} ${compact ? styles.compact : ''} ${expanded ? styles.expanded : ''}`}
    >
      <EffectCanvas kind="dither" region={region} paused={paused || !visible} pulse={pulse} />
      <Tag className={styles.wordmark} aria-label={text === 'QORK.ME' ? 'QorkMe' : text}>
        <span ref={wordmark} className={styles.text}>
          {text}
          <EffectCanvas
            kind="hologram"
            region={region}
            mask={wordmark}
            text={text}
            paused={paused || !visible}
            pulse={pulse}
          />
        </span>
      </Tag>
    </div>
  );
}
