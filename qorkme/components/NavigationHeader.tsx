'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[calc(var(--radius-xl)+4px)] border border-border/55 bg-[color:var(--color-surface)]/95 px-6 py-3.5 shadow-soft transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/16 text-[color:var(--color-primary)] shadow-soft">
              <Link2 size={20} aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-ui text-lg font-extrabold uppercase tracking-[0.28em] text-[color:var(--color-secondary)]">
                QorkMe
              </span>
              <span className="font-body text-sm font-medium text-[color:var(--color-text-muted)]">
                Modern link studio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/55 bg-[color:var(--color-background-accent)]/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-secondary)]">
              <span
                className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-primary)]"
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
