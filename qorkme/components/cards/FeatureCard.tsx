import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './Card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      hoverable={false}
      className={cn(
        'group relative overflow-hidden border bg-surface shadow-soft transition-transform duration-500 hover:-translate-y-1',
        className
      )}
      style={{
        borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
      }}
    >
      <CardContent className="relative">
        <div
          className="absolute inset-x-0 -top-20 h-40 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
        />
        <div className="flex flex-col gap-6 relative">
          <div
            className="w-16 h-16 rounded-[var(--radius-md)] border flex items-center justify-center transition-all duration-500"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-border) 60%, transparent)',
              background: 'color-mix(in srgb, var(--color-surface-muted) 60%, transparent)',
            }}
          >
            <span className="text-accent group-hover:animate-float group-hover:text-secondary transition-colors duration-500">
              {icon}
            </span>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-bold text-secondary">
              {title}
            </CardTitle>
            <CardDescription className="leading-relaxed text-base font-medium">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
