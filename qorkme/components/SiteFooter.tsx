import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SiteFooterProps {
  subtitle?: string;
  className?: string;
}

export function SiteFooter({
  subtitle = 'Thoughtful short links',
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'animate-fadeIn-delay-1200 opacity-0 pointer-events-auto relative z-10',
        className
      )}
      style={{ paddingTop: '24px', paddingBottom: '24px' }}
    >
      <div className="container" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        {/* Mobile layout: logo centered above name + admin row */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          <Image
            src="/shaughv-brandmark.svg"
            alt="SHAUGHV"
            width={28}
            height={28}
            className="text-text-muted opacity-40 transition-opacity duration-300 hover:opacity-70 dark:invert"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-normal uppercase tracking-[0.16em] text-text-primary leading-none">
                QorkMe
              </span>
              <span className="text-xs text-text-muted leading-snug">
                {subtitle}
              </span>
            </div>
            <Link
              href="/admin"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-[color:var(--color-primary)] leading-none"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Desktop layout: three-column with centered logo */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-display text-xl font-normal uppercase tracking-[0.16em] text-text-primary leading-none">
              QorkMe
            </span>
            <span className="text-sm text-text-muted leading-none">
              {subtitle}
            </span>
          </div>

          <Image
            src="/shaughv-brandmark.svg"
            alt="SHAUGHV"
            width={28}
            height={28}
            className="text-text-muted opacity-40 transition-opacity duration-300 hover:opacity-70 dark:invert"
          />

          <Link
            href="/admin"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-[color:var(--color-primary)] leading-none"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
