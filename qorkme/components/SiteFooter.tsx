import Link from 'next/link';
import styles from './SiteFooter.module.css';

export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <a href="https://www.qubetx.com" className={styles.attribution}>
        A QubeTX property
      </a>
      <nav aria-label="QorkMe links">
        <a href="https://qr.qork.me" target="_blank" rel="noopener noreferrer">
          QR generator<span className="sr-only"> (opens in a new tab)</span>
        </a>
        {/* Blume serves a standalone HTML document outside the Next.js router. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/install">CLI</a>
        <Link href="/admin">Admin</Link>
      </nav>
    </footer>
  );
}
