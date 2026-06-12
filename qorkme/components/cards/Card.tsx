import { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

// `hoverable` is accepted for API compatibility but unused — QubeTX cards
// elevate via border brighten (.card:hover), never lift
export function Card({ children, className, elevated = false, onClick, style }: CardProps) {
  return (
    <div
      className={cn(
        'card flex flex-col gap-6',
        elevated && 'card-elevated',
        // QubeTX register: elevation via border brighten (.card:hover), no lift
        onClick && 'cursor-pointer',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2 border-b border-border/60 pb-5', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'font-display text-base font-bold uppercase tracking-[0.06em] text-text-primary',
        className
      )}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn('text-sm text-text-muted', className)}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('flex flex-col gap-5 pt-6', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-6 flex items-center justify-between gap-4 border-t border-border/60 pt-6',
        className
      )}
    >
      {children}
    </div>
  );
}
