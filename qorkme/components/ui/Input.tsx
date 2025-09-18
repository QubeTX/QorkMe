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
        'input w-full text-base placeholder:text-text-muted',
        'focus-visible:outline-none focus-visible:ring-0 font-body',
        {
          'border-[color:var(--color-error)] focus:border-[color:var(--color-error)] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.18)]':
            error,
        },
        className
      )}
      aria-invalid={error || undefined}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
