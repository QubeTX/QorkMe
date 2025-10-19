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
      <div className="container flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12 md:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <span className="font-display text-xl font-normal uppercase tracking-[0.16em] text-text-primary md:text-2xl md:leading-none">
            QorkMe
          </span>
          <span className="text-sm text-text-muted leading-relaxed md:border-l md:border-border/60 md:pl-6 md:text-base md:leading-none">
            {subtitle}
          </span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-text-muted md:flex-row md:items-center md:gap-6">
          <span className="leading-relaxed md:leading-none md:text-base">
            Powered by Supabase &amp; Vercel
          </span>
          <Link
            href="/admin"
            className="font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)] md:leading-none"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
