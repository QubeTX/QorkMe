'use client';

import { cn } from '@/lib/utils';

interface GeometricDecorProps {
  className?: string;
}

export function GeometricDecor({ className }: GeometricDecorProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Large circle */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-bauhaus-yellow opacity-20 rounded-full animate-rotate-slow" />

      {/* Square */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-bauhaus-red opacity-15 rotate-45 animate-float" />

      {/* Triangle (using CSS) */}
      <div
        className="absolute bottom-20 left-1/3 w-0 h-0 opacity-20 animate-float"
        style={{
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: '70px solid var(--bauhaus-blue)',
          animationDelay: '2s',
        }}
      />

      {/* Small circles */}
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-bauhaus-blue opacity-10 rounded-full" />
      <div
        className="absolute bottom-1/3 left-20 w-16 h-16 bg-bauhaus-red opacity-15 rounded-full animate-float"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}

export function GeometricPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="bauhaus-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="25" cy="25" r="20" fill="var(--bauhaus-blue)" />
          <rect x="60" y="10" width="30" height="30" fill="var(--bauhaus-red)" />
          <polygon points="25,75 10,95 40,95" fill="var(--bauhaus-yellow)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bauhaus-pattern)" />
    </svg>
  );
}
