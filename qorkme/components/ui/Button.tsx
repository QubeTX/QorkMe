'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'btn relative overflow-hidden font-semibold tracking-tight transition-colors duration-200',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'focus-visible:outline-none',
          {
            // Variants
            'bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] border border-[color:var(--color-primary)] shadow-soft hover:bg-[color:var(--color-primary-hover)] hover:border-[color:var(--color-primary-hover)]':
              variant === 'primary',
            'bg-[color:var(--color-secondary)] text-[color:var(--color-text-inverse)] border border-[color:var(--color-secondary)] shadow-soft hover:bg-[color:var(--color-secondary-hover)] hover:border-[color:var(--color-secondary-hover)]':
              variant === 'secondary',
            'bg-[color:var(--color-accent)] text-[color:var(--color-text-inverse)] border border-[color:var(--color-accent)] shadow-soft hover:bg-[color:var(--color-accent-hover)] hover:border-[color:var(--color-accent-hover)]':
              variant === 'accent',
            'bg-transparent text-[color:var(--color-text-secondary)] border border-[color:var(--color-border-strong)] hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10':
              variant === 'outline',
            'bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]/55 border border-transparent':
              variant === 'ghost',
            // Sizes
            'min-h-[42px] px-4 text-sm gap-2': size === 'sm',
            'min-h-[46px] px-5 text-sm gap-2.5': size === 'md',
            'min-h-[52px] px-6 text-base gap-3': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
