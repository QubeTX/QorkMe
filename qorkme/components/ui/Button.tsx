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
          'btn font-display font-semibold rounded-[var(--radius-lg)] transition-all duration-300',
          'hover:transform hover:scale-[1.05] active:scale-[0.95]',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'uppercase tracking-wider relative overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
          {
            // Variants
            'bg-gradient-to-r from-secondary to-secondary-hover text-text-inverse shadow-xl hover:shadow-2xl border-2 border-secondary hover:from-secondary-hover hover:to-secondary':
              variant === 'primary',
            'bg-gradient-to-r from-accent to-accent-hover text-text-inverse shadow-xl hover:shadow-2xl border-2 border-accent hover:from-accent-hover hover:to-accent':
              variant === 'secondary',
            'bg-gradient-to-r from-primary to-primary-hover text-text-inverse shadow-xl hover:shadow-2xl border-2 border-primary hover:from-primary-hover hover:to-primary':
              variant === 'accent',
            'bg-transparent border-2 border-accent hover:border-secondary hover:bg-gradient-to-r hover:from-accent/10 hover:to-secondary/10 text-accent hover:text-secondary backdrop-blur-sm':
              variant === 'outline',
            'bg-transparent hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 text-text-primary hover:text-secondary backdrop-blur-sm':
              variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm gap-2': size === 'sm',
            'px-6 py-3 text-base gap-2.5': size === 'md',
            'px-8 py-4 text-lg gap-3': size === 'lg',
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
