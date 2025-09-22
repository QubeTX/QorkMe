import { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

type MetricAccent = 'primary' | 'secondary' | 'accent' | 'neutral';

type MetricLayout = 'horizontal' | 'vertical';

const accentClasses: Record<MetricAccent, string> = {
  primary: 'text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/14',
  secondary: 'text-[color:var(--color-secondary)] bg-[color:var(--color-secondary)]/10',
  accent: 'text-[color:var(--color-accent)] bg-[color:var(--color-accent)]/18',
  neutral: 'text-[color:var(--color-text-secondary)] bg-[color:var(--color-surface-muted)]/60',
};

const accentValueClasses: Record<MetricAccent, string> = {
  primary: 'text-[color:var(--color-primary)]',
  secondary: 'text-[color:var(--color-secondary)]',
  accent: 'text-[color:var(--color-accent)]',
  neutral: 'text-[color:var(--color-text-primary)]',
};

interface MetricCardProps {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  description?: string;
  accent?: MetricAccent;
  layout?: MetricLayout;
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  icon,
  value,
  label,
  description,
  accent = 'primary',
  layout = 'horizontal',
  className,
  valueClassName,
}: MetricCardProps) {
  const alignment =
    layout === 'vertical'
      ? 'flex-col items-center text-center gap-5'
      : 'flex-row items-center gap-5';

  return (
    <Card
      hoverable={false}
      className={cn(
        'h-full',
        layout === 'vertical' && 'text-center',
        className
      )}
    >
      <div className={cn('flex', alignment)}>
        {icon ? (
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300',
              accentClasses[accent]
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <div className={cn('space-y-1', layout === 'vertical' && 'space-y-2')}>
          <p
            className={cn(
              'font-display font-semibold text-text-primary',
              layout === 'vertical' ? 'text-3xl' : 'text-2xl',
              valueClassName ?? (layout === 'vertical' ? accentValueClasses[accent] : undefined)
            )}
          >
            {value}
          </p>
          <p className="text-sm text-text-muted">{label}</p>
          {description ? <p className="text-xs text-text-secondary">{description}</p> : null}
        </div>
      </div>
    </Card>
  );
}
