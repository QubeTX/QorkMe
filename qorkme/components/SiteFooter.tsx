import { cn } from '@/lib/utils';

interface SiteFooterProps {
  subtitle?: string;
  className?: string;
}

export function SiteFooter({
  subtitle = 'Thoughtful short links for modern teams',
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn('border-t border-border py-12', className)}>
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-display text-xl font-semibold text-text-primary uppercase tracking-[0.12em]">
            QorkMe
          </span>
          <span className="text-sm text-text-muted">{subtitle}</span>
        </div>
        <p className="text-sm text-text-muted">
          Designed in San Francisco • Powered by Supabase &amp; Vercel
        </p>
      </div>
    </footer>
  );
}
