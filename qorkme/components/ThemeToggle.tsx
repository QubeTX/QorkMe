'use client';

import { useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-pressed={theme === 'dark'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-[color:var(--color-surface)] shadow-soft transition-all duration-200 hover:border-[color:var(--color-primary)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative h-6 w-6">
        <Sun
          className={`absolute inset-0 transition-all duration-300 text-[color:var(--color-secondary)] ${
            theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
          size={22}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-300 text-[color:var(--color-accent)] ${
            theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          size={22}
        />
      </div>
    </button>
  );
}
