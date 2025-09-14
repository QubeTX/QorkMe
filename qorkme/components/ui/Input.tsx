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
        'w-full px-4 py-3 text-base',
        'border-3 border-bauhaus-black',
        'bg-bauhaus-white text-bauhaus-black',
        'placeholder:text-bauhaus-gray',
        'focus:outline-none focus:ring-4 focus:ring-bauhaus-blue focus:ring-opacity-30',
        'transition-all duration-200',
        {
          'border-bauhaus-red': error,
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
