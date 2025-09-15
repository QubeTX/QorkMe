'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-2xl border-b border-border/50 shadow-2xl">
      <div className="container mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Link2 className="text-text-inverse relative z-10" size={24} />
          </div>
          <span className="font-display text-3xl font-bold text-secondary tracking-wider uppercase group-hover:text-accent transition-colors duration-300">
            QorkMe
          </span>
        </div>
        <ClientThemeToggle />
      </div>
    </nav>
  );
}