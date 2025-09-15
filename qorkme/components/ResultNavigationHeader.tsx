'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';

export function ResultNavigationHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 md:px-8 py-5">
        <div
          className="flex items-center justify-between rounded-[var(--radius-xl)] border bg-surface backdrop-blur-2xl shadow-soft px-5 md:px-8 py-4"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-border) 75%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 88%, transparent)',
          }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Link2 className="text-text-inverse relative z-10" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold text-secondary tracking-[0.3em] uppercase leading-none">
                QORKME
              </span>
              <span className="text-xs font-semibold tracking-[0.35em] text-text-muted uppercase">
                Result overview
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-secondary hover:text-secondary transition-colors font-medium tracking-[0.25em] uppercase"
            >
              <ArrowLeft size={18} />
              Create another
            </Link>
            <ClientThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
