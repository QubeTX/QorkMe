'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';

export function ResultNavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-6">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-xl)+12px)] border border-border/45 bg-[color:var(--color-surface)]/90 shadow-soft transition-colors">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 scale-[1.02] bg-gradient-to-r from-[color:var(--color-primary)]/25 via-transparent to-[color:var(--color-secondary)]/30 opacity-80"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6 px-10 py-5 sm:px-16">
            <Link
              href="/"
              className="flex items-center gap-4 text-[color:var(--color-text-primary)] sm:gap-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/16 text-[color:var(--color-primary)] shadow-soft">
                <Link2 size={22} aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1 leading-tight">
                <span className="font-ui text-lg font-extrabold uppercase tracking-[0.28em]">
                  QorkMe
                </span>
                <span className="font-body text-sm font-medium text-[color:var(--color-text-muted)]">
                  Share-ready link
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border/55 bg-[color:var(--color-background-accent)]/80 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)] shadow-soft transition-colors hover:border-[color:var(--color-primary)]/60 hover:text-[color:var(--color-primary)]"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>Start another link</span>
              </Link>
              <div className="rounded-full bg-[color:var(--color-background)]/75 px-3 py-1.5 shadow-soft ring-1 ring-border/45">
                <ClientThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
