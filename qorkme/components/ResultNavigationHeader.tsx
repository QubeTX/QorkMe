'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';

export function ResultNavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container px-4 sm:px-6 pb-5 pt-[calc(var(--safe-area-top)+1.25rem)]">
        <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-border bg-[color:var(--color-surface)]/90 px-5 md:px-6 py-3.5 shadow-soft transition-colors">
          <Link href="/" className="flex items-center gap-3 text-[color:var(--color-text-primary)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
              <Link2 size={20} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-xl font-semibold uppercase tracking-[0.14em]">
                QorkMe
              </span>
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Result overview
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Create another</span>
            </Link>
            <ClientThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
