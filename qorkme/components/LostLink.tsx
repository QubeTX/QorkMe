'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandStage } from './brand/BrandStage';
import { PageHeader } from './PageHeader';
import { SiteFooter } from './SiteFooter';
import styles from './LostLink.module.css';

export function LostLink() {
  const [pulse, setPulse] = useState(0);
  return (
    <div className={styles.page}>
      <PageHeader />
      <main id="main-content" className={styles.main}>
        <button
          className={styles.art}
          type="button"
          onClick={() => setPulse((value) => value + 1)}
          aria-label="Ripple the 404 pixels"
        >
          <BrandStage text="404" expanded pulse={pulse} />
        </button>
        <div className={styles.copy}>
          <h1>This link went off-script.</h1>
          <p>
            Expired, removed, or a typo.
            <br />
            Either way, the pixels are still here.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.home}>
              Make a fresh link <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className={styles.back}
              onClick={() => {
                if (history.length > 1) history.back();
                else location.assign('/');
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Go back
            </button>
          </div>
          <span className={styles.hint}>
            {pulse ? 'Good ripple. Still no link.' : 'Go on. Poke the pixels.'}
          </span>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
