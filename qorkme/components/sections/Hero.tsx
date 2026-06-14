import type { FC } from 'react';
import { UrlShortener } from '@/components/UrlShortener';
import LabelPill from '@/components/ui/LabelPill';
import MatrixClock from '@/components/effects/MatrixClock';
import styles from './Hero.module.css';

/**
 * The home hero — full QubeTX register, "terminal" composition. A command-line
 * prompt ($ qork --shorten) leads into QORK.ME rendered as a Makira Black
 * blue→violet gradient wordmark (the landing's masked-line pattern), a gradient
 * hairline, the shortener card, and the live LED clock as a machine detail.
 *
 * Entrance is owned entirely by LoadSequence (anime.js) via the data-load
 * attributes — no Framer Motion here (one owner per element).
 */
const Hero: FC = () => (
  <main id="main-content" className={styles.hero}>
    <div className={`${styles.content} ${styles.center}`}>
      <div data-load="eyebrow">
        <LabelPill variant="bar">
          <span data-load-decode>URL Shortener // A QubeTX Property</span>
        </LabelPill>
      </div>

      <p data-load="desc" className={styles.term}>
        <span className={styles.termAccent}>$</span>qork{' '}
        <span className={styles.termArg}>&quot;url&quot;</span>
        <span className={styles.cursor} aria-hidden="true">
          ▮
        </span>
      </p>

      <h1 className={styles.headline} aria-label="Qork.Me — URL shortener">
        <span className={styles.lineMask}>
          <span
            data-load="hl"
            data-load-gradient
            className={`${styles.line} ${styles.gradientLine}`}
          >
            QORK.ME
          </span>
        </span>
      </h1>

      <div className={styles.rule} aria-hidden="true" />

      <div data-load="cta" className={styles.card}>
        <UrlShortener />
      </div>

      <div data-load="company" className={styles.clock}>
        <div className="hidden md:block" style={{ width: 'min(100%, 360px)', height: '40px' }}>
          <MatrixClock seconds className="h-full w-full" />
        </div>
        <div className="md:hidden" style={{ width: 'min(100%, 240px)', height: '32px' }}>
          <MatrixClock className="h-full w-full" />
        </div>
      </div>
    </div>
  </main>
);

export default Hero;
