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
        'group h-full border border-border bg-surface transition-transform duration-300 hover:-translate-y-1 hover:border-border-strong',
        className
      )}
    >
      <CardContent className="relative flex h-full flex-col gap-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-105">
          {icon}
        </span>
        <div className="space-y-3">
          <CardTitle className="text-xl font-semibold text-text-primary">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
