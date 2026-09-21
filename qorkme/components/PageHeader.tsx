'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import styles from './PageHeader.module.css';

/** Shared ivory header; a hairline appears after scrolling. */
export function PageHeader({ right }: { right?: ReactNode }) {
  const scrolled = useScrolled(24);

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          QORK.ME
        </Link>
        {right ? <div className={styles.right}>{right}</div> : null}
      </div>
    </header>
  );
}
