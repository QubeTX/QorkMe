import Link from 'next/link';
import { MotionToggle } from './brand/MotionPreference';
import styles from './SiteFooter.module.css';

export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <a href="https://www.qubetx.com" className={styles.attribution}>
        A QubeTX property
      </a>
      <nav aria-label="QorkMe links">
        <MotionToggle />
        <a href="https://qr.qork.me" target="_blank" rel="noopener noreferrer">
          QR generator<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link href="/install">CLI</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </footer>
  );
}
