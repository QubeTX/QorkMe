'use client';

import dynamic from 'next/dynamic';

export const ClientThemeToggle = dynamic(
  () => import('@/components/ThemeToggle').then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div className="w-10 h-10 rounded-full bg-surface border-2 border-border animate-pulse" />
    ),
  }
);