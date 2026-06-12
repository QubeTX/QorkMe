import type { FC } from 'react';
import styles from './CapabilityRows.module.css';

export type Capability = { title: string; body: string };

type CapabilityRowsProps = { items: Capability[] };

/**
 * Numbered capability rows — the product pages' "01 SYSTEM OVERVIEW …"
 * pattern in v3 tokens: mono index, display title, dim body, hairline
 * rules between rows.
 */
const CapabilityRows: FC<CapabilityRowsProps> = ({ items }) => (
  <ol className={styles.rows}>
    {items.map((item, i) => (
      <li key={item.title} className={styles.row}>
        <span className={styles.num} aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <div className={styles.content}>
          {/* h3: capability rows sit directly under a section h2 */}
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.body}>{item.body}</p>
        </div>
      </li>
    ))}
  </ol>
);

export default CapabilityRows;
