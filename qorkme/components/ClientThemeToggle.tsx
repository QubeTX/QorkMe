'use client';

import dynamic from 'next/dynamic';

export const ClientThemeToggle = dynamic(
  () => import('@/components/ThemeToggle').then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-border/60 bg-[color:var(--color-surface)]" />
    ),
  }
);
