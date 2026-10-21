'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

type Disposable = { destroy(): void };

declare global {
  interface Window {
    ShaughvCursor?: { mount(options: { color: string }): Disposable };
    ShaughvDropdown?: { mount(): Disposable };
  }
}

/** One shared page cursor; the CDN owns motion, control geometry and native fallbacks. */
export function SiteCursor() {
  const [cursorReady, setCursorReady] = useState(false);
  const [dropdownReady, setDropdownReady] = useState(false);

  useEffect(() => {
    if (!cursorReady || !window.ShaughvCursor) return;
    try {
      const cursor = window.ShaughvCursor.mount({ color: 'var(--color-primary)' });
      return () => cursor.destroy();
    } catch {
      // A failed optional decoration leaves the browser's native cursor available.
      console.warn('The optional site cursor could not start.');
    }
  }, [cursorReady]);

  useEffect(() => {
    if (!dropdownReady || !window.ShaughvDropdown) return;
    try {
      const dropdowns = window.ShaughvDropdown.mount();
      return () => dropdowns.destroy();
    } catch {
      console.warn('The optional dropdown enhancement could not start.');
    }
  }, [dropdownReady]);

  return (
    <>
      <Script
        id="qorkme-shared-cursor"
        src="https://cdn.shaughv.com/js/shaughv-cursor.js?v=2026-10-21.3"
        strategy="afterInteractive"
        onReady={() => setCursorReady(true)}
      />
      <Script
        id="qorkme-shared-dropdowns"
        src="https://cdn.shaughv.com/js/shaughv-dropdown.js?v=2026-10-21.2"
        strategy="afterInteractive"
        onReady={() => setDropdownReady(true)}
      />
    </>
  );
}
