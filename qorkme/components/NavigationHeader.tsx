'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 md:px-8 py-6">
        <div
          className="flex items-center justify-between rounded-[var(--radius-xl)] border bg-surface backdrop-blur-2xl shadow-soft px-5 md:px-8 py-4 md:py-5"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-border) 75%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 88%, transparent)',
          }}
        >
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Link2 className="text-text-inverse relative z-10" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl md:text-3xl font-bold text-secondary tracking-[0.3em] uppercase leading-none group-hover:text-accent transition-colors duration-300">
                QORKME
              </span>
              <span className="hidden md:block text-xs font-semibold tracking-[0.4em] text-text-muted uppercase">
                Premium links platform
              </span>
            </div>
          </div>
          <ClientThemeToggle />
        </div>
      </div>
    </nav>
  );
}
