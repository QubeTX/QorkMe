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
        'input w-full px-4 py-3 text-base',
        'bg-surface border-2 border-border rounded-[var(--radius-md)]',
        'text-text-primary placeholder:text-text-muted',
        'font-body',
        'focus:border-primary focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(135,169,107,0.1)]',
        'transition-all duration-200',
        'hover:border-border-hover',
        {
          'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(244,67,54,0.1)]': error,
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