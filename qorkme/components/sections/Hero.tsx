'use client';
import { useState } from 'react';
import { BrandStage } from '@/components/brand/BrandStage';
import { UrlShortener } from '@/components/UrlShortener';
import styles from './Hero.module.css';

export default function Hero() {
  const [pulse, setPulse] = useState(0);
  return (
    <main id="main-content" className={styles.hero}>
      <div className={styles.content}>
        <BrandStage heading pulse={pulse} />
        <UrlShortener onSuccess={() => setPulse((value) => value + 1)} />
      </div>
    </main>
  );
}
