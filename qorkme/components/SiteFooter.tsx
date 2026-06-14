import Link from 'next/link';
import { cn } from '@/lib/utils';
import SysStatus from '@/components/layout/SysStatus';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn(styles.footer, className)} data-load="company">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>QorkMe</span>
          <span className={styles.attribution}>A QubeTX Property</span>
        </div>

        <SysStatus />

        <div className={styles.links}>
          <a
            href="https://qr.qork.me"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            QR Gen ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/install" className={styles.link}>
            qork CLI
          </Link>
          <Link href="/admin" className={styles.link}>
            Admin
          </Link>
          <span className={styles.version} aria-hidden="true">
            v4.3.0
          </span>
        </div>
      </div>
    </footer>
  );
}
