import type { FC } from 'react';
import { Download } from '@/components/ui/icons';
import styles from './DownloadCard.module.css';

type DownloadCardProps = {
  /** Artifact display name ("QubeTX design-system kit"). */
  name: string;
  /** Mono meta line ("v3.2.0 · zip · tokens + fonts + source + docs"). */
  meta: string;
  href: string;
  /** Saved filename (e.g. versioned, while `href` stays a stable permalink). */
  downloadName?: string;
  /** Button label — defaults to "Download". */
  cta?: string;
  /** Short supporting line under the name. */
  description?: string;
};

/**
 * The canonical download section row for product pages: artifact identity
 * on the left, one unmistakable action on the right. Generalized from the
 * reports.qubetx.com download/initialize layouts, v3 tokens.
 */
const DownloadCard: FC<DownloadCardProps> = ({
  name,
  meta,
  href,
  downloadName,
  cta = 'Download',
  description,
}) => (
  <div className={styles.card}>
    <div className={styles.info}>
      <span className={styles.meta}>{meta}</span>
      <h3 className={styles.name}>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
    <a
      className={styles.button}
      href={href}
      download={downloadName ?? true}
      data-interactive="true"
    >
      <Download size={16} strokeWidth={2} aria-hidden="true" />
      <span>{cta}</span>
    </a>
  </div>
);

export default DownloadCard;
