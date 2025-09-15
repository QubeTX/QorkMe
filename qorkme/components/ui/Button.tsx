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
          'btn font-display font-semibold rounded-[var(--radius-sm)] transition-all duration-300',
          'hover:transform hover:scale-[1.05] active:scale-[0.95]',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          'uppercase tracking-wider',
          {
            // Variants
            'bg-secondary text-text-inverse hover:bg-secondary-hover shadow-medium hover:shadow-large border-2 border-secondary':
              variant === 'primary',
            'bg-accent text-text-inverse hover:bg-accent-hover shadow-medium hover:shadow-large border-2 border-accent':
              variant === 'secondary',
            'bg-primary text-text-inverse hover:bg-primary-hover shadow-medium hover:shadow-large border-2 border-primary':
              variant === 'accent',
            'bg-transparent border-2 border-accent hover:border-secondary hover:bg-accent/10 text-accent hover:text-secondary':
              variant === 'outline',
            'bg-transparent hover:bg-primary/10 text-text-primary hover:text-secondary':
              variant === 'ghost',
            // Sizes
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-5 py-2.5 text-base gap-2': size === 'md',
            'px-6 py-3 text-lg gap-2.5': size === 'lg',
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
