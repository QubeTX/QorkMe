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
          'btn font-body font-medium rounded-[var(--radius-md)] transition-all duration-200',
          'hover:transform hover:scale-[1.02] active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          {
            // Variants
            'bg-primary text-text-inverse hover:bg-primary-hover shadow-soft hover:shadow-medium': variant === 'primary',
            'bg-secondary text-text-inverse hover:bg-secondary-hover shadow-soft hover:shadow-medium': variant === 'secondary',
            'bg-accent text-text-inverse hover:bg-accent-hover shadow-soft hover:shadow-medium': variant === 'accent',
            'bg-transparent border-2 border-border hover:border-primary hover:bg-surface text-text-primary': variant === 'outline',
            'bg-transparent hover:bg-surface text-text-primary': variant === 'ghost',
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