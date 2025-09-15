'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      className={cn(
        'input w-full px-5 py-3.5 text-base',
        'bg-surface border-2 border-border rounded-[var(--radius-sm)]',
        'text-text-primary placeholder:text-text-muted',
        'font-body font-normal',
        'focus:border-secondary focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(62,39,35,0.08)] focus:bg-background',
        'transition-all duration-300',
        'hover:border-accent hover:bg-background/50',
        {
          'border-error focus:border-error focus:shadow-[0_0_0_4px_rgba(198,40,40,0.1)]': error,
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
