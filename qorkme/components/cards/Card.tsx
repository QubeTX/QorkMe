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

export function Card({
  children,
  className,
  elevated = false,
  hoverable = true,
  onClick,
  style,
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        elevated && 'card-elevated',
        hoverable && 'transition-transform hover:-translate-y-1 hover:shadow-medium',
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
    <div className={cn('pb-6 mb-2 border-b border-border flex flex-col gap-2', className)}>
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
    <h3 className={cn('text-2xl font-display font-semibold text-text-primary', className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn('text-base text-text-muted', className)}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('pt-6', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'pt-6 mt-6 border-t border-border flex items-center justify-between gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}
