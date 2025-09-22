'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-6">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[calc(var(--radius-xl)+6px)] border border-border/55 bg-[color:var(--color-surface)]/95 px-8 py-4 shadow-soft transition-colors">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/16 text-[color:var(--color-primary)] shadow-soft">
              <Link2 size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 leading-tight">
              <span className="font-ui text-lg font-extrabold uppercase tracking-[0.28em] text-[color:var(--color-secondary)]">
                QorkMe
              </span>
              <span className="font-body text-sm font-medium text-[color:var(--color-text-muted)]">
                Modern link studio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/55 bg-[color:var(--color-background-accent)]/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-secondary)]">
              <span
                className="inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]"
                aria-hidden="true"
              />
              Live
            </div>
            <ClientThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
