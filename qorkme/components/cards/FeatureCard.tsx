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
    <Card className={cn('group hover:border-accent/50 transform hover:scale-[1.02] transition-all duration-500', className)}>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/10 to-secondary/10 border-2 border-accent/20 flex items-center justify-center text-accent group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent group-hover:border-secondary group-hover:text-text-inverse transition-all duration-500 shadow-medium group-hover:shadow-xl group-hover:animate-float">
            {icon}
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-bold text-secondary group-hover:text-accent transition-colors duration-300">{title}</CardTitle>
            <CardDescription className="leading-relaxed text-base font-medium">{description}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
