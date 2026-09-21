'use client';
import { useState } from 'react';
import { DatabaseHealthCard } from './DatabaseHealthCard';
import styles from './admin.module.css';

export function DatabaseDetails() {
  const [open, setOpen] = useState(false);
  return (
    <details
      className={styles.healthDisclosure}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Database details</summary>
      {open && <DatabaseHealthCard />}
    </details>
  );
}
