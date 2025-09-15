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
    <Card className={cn('group', className)}>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-text-inverse transition-all duration-300">
            {icon}
          </div>
          <div>
            <CardTitle className="mb-2">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
