'use client';

import { useEffect, useState } from 'react';
import { SlotRoll } from '@/lib/motion/SlotRoll';
import styles from './install.module.css';

/**
 * The hero "$ …" line cycles through the tagline and a few real example
 * commands, rolling each transition through the kit slot-roll engine. A client
 * island (it drives an interval). Under reduced motion it holds the tagline
 * still; the tagline is always exposed to assistive tech while the visual line
 * (which changes every few seconds) is aria-hidden.
 */
const PHRASES = [
  'Shorten URLs from your terminal.',
  'qork https://example.com/very/long/path',
  'qork "https://example.com/a b?x=1"',
  'qork https://example.com --alias launch',
  'qork --json https://example.com',
  'qork update',
];

const INTERVAL_MS = 3200;

export default function LedeCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Respect reduced motion — keep the tagline still, no cycling.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setIndex((n) => (n + 1) % PHRASES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={styles.lede}>
      <span className="sr-only">Shorten URLs from your terminal.</span>
      <span aria-hidden="true">
        <span className={styles.ledeAccent}>$</span>
        <SlotRoll text={PHRASES[index]} options={{ direction: 'up' }} />
      </span>
    </p>
  );
}
