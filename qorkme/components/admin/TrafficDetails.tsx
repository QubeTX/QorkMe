'use client';
import { useState } from 'react';
import { AdminAnalytics } from './AdminAnalytics';
import styles from './admin.module.css';

export function TrafficDetails() {
  const [open, setOpen] = useState(false);
  return (
    <details
      className={styles.healthDisclosure}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Traffic &amp; activity</summary>
      {open && <AdminAnalytics />}
    </details>
  );
}
