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
    <Card className={cn('group hover:border-secondary/30', className)}>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="w-14 h-14 rounded-sm bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent group-hover:bg-secondary group-hover:border-secondary group-hover:text-text-inverse transition-all duration-300 shadow-soft group-hover:shadow-medium">
            {icon}
          </div>
          <div>
            <CardTitle className="mb-3 text-lg font-semibold text-secondary">{title}</CardTitle>
            <CardDescription className="leading-relaxed">{description}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
