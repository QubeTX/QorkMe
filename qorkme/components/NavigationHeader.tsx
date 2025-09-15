'use client';

import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2 } from 'lucide-react';

export function NavigationHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b-2 border-border shadow-lg">
      <div className="container mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-medium">
            <Link2 className="text-text-inverse" size={22} />
          </div>
          <span className="font-display text-3xl font-bold text-secondary tracking-wider uppercase">QorkMe</span>
        </div>
        <ClientThemeToggle />
      </div>
    </nav>
  );
}
