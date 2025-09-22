'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';

export function ResultNavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[calc(var(--radius-xl)+4px)] border border-border/55 bg-[color:var(--color-surface)]/95 px-6 py-3.5 shadow-soft transition-colors">
          <Link href="/" className="flex items-center gap-4 text-[color:var(--color-text-primary)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/16 text-[color:var(--color-primary)] shadow-soft">
              <Link2 size={20} aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-ui text-lg font-extrabold uppercase tracking-[0.28em]">
                QorkMe
              </span>
              <span className="font-body text-sm font-medium text-[color:var(--color-text-muted)]">
                Result overview
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/55 bg-[color:var(--color-background-accent)]/75 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-secondary)] transition-colors hover:border-[color:var(--color-primary)]/60 hover:text-[color:var(--color-primary)]"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span>New link</span>
            </Link>
            <ClientThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
