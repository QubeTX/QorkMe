import Link from 'next/link';
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
    <footer
      className={cn(
        'border-t border-border/60 bg-[color:var(--color-background-accent)]/55 py-14 md:py-16',
        className
      )}
    >
      <div className="container flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <span className="font-display text-xl font-semibold uppercase tracking-[0.16em] text-text-primary md:text-2xl">
            QorkMe
          </span>
          <span className="text-sm text-text-muted md:border-l md:border-border/60 md:pl-6 md:text-base md:leading-relaxed">
            {subtitle}
          </span>
        </div>
        <div className="flex flex-col items-start gap-4 text-sm text-text-muted sm:flex-row sm:items-center sm:gap-6">
          <p className="leading-relaxed md:text-base">
            Designed in San Francisco • Powered by Supabase &amp; Vercel
          </p>
          <Link
            href="/admin"
            className="font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
