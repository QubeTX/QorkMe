'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMotionPreference } from './MotionPreference';
import { EffectCanvas } from './EffectCanvas';
import styles from './BrandStage.module.css';

function Backdrop({ home }: { home: boolean }) {
  const region = useRef<HTMLDivElement>(null);
  const { paused } = useMotionPreference();
  return (
    <div
      ref={region}
      className={`${styles.pageBackdrop} ${home ? styles.homeBackdrop : ''}`}
      aria-hidden="true"
    >
      <EffectCanvas kind="dither" layout="page" region={region} paused={paused} pulse={0} />
    </div>
  );
}

export function PageDither() {
  const pathname = usePathname();
  const home = pathname === '/';
  const enabled =
    home || pathname === '/install' || pathname === '/admin' || pathname.startsWith('/admin/');
  return enabled ? <Backdrop key={pathname} home={home} /> : null;
}
