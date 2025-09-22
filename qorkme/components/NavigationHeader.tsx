'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-border/60 bg-[color:var(--color-surface)]/92 px-5 py-3.5 shadow-soft transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/14 text-[color:var(--color-primary)]">
              <Link2 size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-xl font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-primary)]">
                QorkMe
              </span>
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Modern link studio
              </span>
            </div>
          </div>
          <ClientThemeToggle />
        </div>
      </div>
    </nav>
  );
}
