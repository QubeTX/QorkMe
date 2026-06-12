'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import styles from './PageHeader.module.css';

/**
 * Fixed QubeTX-register page header: QORKME wordmark home link, optional mono
 * metadata on the right. Past 24px of scroll the bar gains a blur + hairline
 * and compresses (72px → 60px).
 */
export function PageHeader({ right }: { right?: ReactNode }) {
  const scrolled = useScrolled(24);

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          QorkMe
        </Link>
        {right ? <div className={styles.right}>{right}</div> : null}
      </div>
    </header>
  );
}
