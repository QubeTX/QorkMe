'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'bauhaus-border font-display uppercase tracking-wider transition-all duration-200',
          'hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-bauhaus-blue text-bauhaus-white hover:bg-opacity-90': variant === 'primary',
            'bg-bauhaus-red text-bauhaus-white hover:bg-opacity-90': variant === 'secondary',
            'bg-bauhaus-yellow text-bauhaus-black hover:bg-opacity-90': variant === 'accent',
            'bg-transparent text-current hover:bg-bauhaus-black hover:text-bauhaus-white':
              variant === 'outline',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
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
