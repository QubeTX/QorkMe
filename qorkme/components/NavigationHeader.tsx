'use client';

import Link from 'next/link';
import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2, Sparkles } from 'lucide-react';

const navItems = [
  { label: 'Create', href: '#shorten' },
  { label: 'Highlights', href: '#features' },
  { label: 'Metrics', href: '#insights' },
  { label: 'Support', href: '#cta' },
];

export function NavigationHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="container py-6">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-xl)+16px)] border border-border/50 bg-[color:var(--color-surface)]/85 shadow-[0_28px_80px_-45px_rgba(8,15,35,0.75)] ring-1 ring-border/30 transition-colors">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[color:var(--color-primary)]/25 via-transparent to-[color:var(--color-secondary)]/25 opacity-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-px h-px bg-gradient-to-r from-transparent via-[color:var(--color-primary)]/45 to-transparent"
          />
          <div className="relative flex flex-col gap-5 px-6 py-5 sm:px-10 sm:py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.4rem] bg-[color:var(--color-background)]/75 text-[color:var(--color-primary)] shadow-soft ring-1 ring-border/45">
                <div
                  aria-hidden
                  className="absolute inset-[-18%] rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_65%)]"
                />
                <Link2 size={22} aria-hidden className="relative" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.55em] text-[color:var(--color-secondary)]">
                  QorkMe
                </span>
                <span className="font-body text-sm text-[color:var(--color-text-secondary)]">
                  Friendly link studio
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center rounded-full border border-transparent px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-primary)]/45 hover:text-[color:var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 md:gap-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/55 bg-[color:var(--color-background-accent)]/80 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.48em] text-[color:var(--color-secondary)] shadow-soft">
                  <Sparkles size={16} aria-hidden />
                  Beta invites open
                </span>
                <div className="rounded-full bg-[color:var(--color-background)]/75 px-3 py-1.5 shadow-soft ring-1 ring-border/45">
                  <ClientThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
