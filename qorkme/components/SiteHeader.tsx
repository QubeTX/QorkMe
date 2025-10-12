'use client';

import Link from 'next/link';
import { ReactNode, useId, useState } from 'react';
import clsx from 'clsx';
import { ClientThemeToggle } from '@/components/ClientThemeToggle';
import { Link2, Menu, X } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
};

type HeaderStatus = {
  label: string;
  icon?: ReactNode;
};

type HeaderActionVariant = 'primary' | 'outline';

type HeaderAction = {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: HeaderActionVariant;
};

export interface SiteHeaderProps {
  navItems?: NavItem[];
  status?: HeaderStatus;
  action?: HeaderAction;
}

const actionStyles: Record<HeaderActionVariant, string> = {
  primary:
    'bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] border border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] hover:border-[color:var(--color-primary-hover)]',
  outline:
    'border border-[color:var(--color-border-strong)] text-[color:var(--color-text-secondary)] bg-transparent hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10',
};

export function SiteHeader({ navItems = [], status, action }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const hasNavigation = navItems.length > 0;

  const closeMenu = () => setIsMenuOpen(false);

  const renderAction = (displayVariant: HeaderActionVariant = 'primary') => {
    if (!action) {
      return null;
    }

    const variant = action.variant ?? displayVariant;
    return (
      <Link
        href={action.href}
        onClick={closeMenu}
        className={clsx(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
          actionStyles[variant]
        )}
      >
        {action.icon}
        <span>{action.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-0 top-5 md:top-6 z-50">
      <div className="container py-4">
        <div className="rounded-[24px] border border-border/50 bg-[color:var(--color-surface)]/92 backdrop-blur-lg shadow-[0_18px_50px_-30px_rgba(31,31,29,0.65)]">
          <div className="flex h-16 items-center justify-between px-7 sm:px-10 lg:px-16">
            <Link
              href="/"
              className="flex items-center gap-3 text-[color:var(--color-text-primary)]"
            >
              <span className="flex h-11 w-11 items-center justify-center text-[color:var(--color-primary)]">
                <Link2 size={20} aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.38em] text-[color:var(--color-secondary)]">
                  QorkMe
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {hasNavigation && (
                <button
                  type="button"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isMenuOpen}
                  aria-controls={menuId}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-[color:var(--color-background-accent)]/65 text-[color:var(--color-text-secondary)] transition-colors duration-200 hover:text-[color:var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] md:hidden"
                >
                  {isMenuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
                </button>
              )}

              <div className="hidden items-center gap-6 md:flex">
                {hasNavigation && (
                  <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors duration-200 hover:text-[color:var(--color-primary)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                {status && (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-secondary)]">
                    {status.icon}
                    {status.label}
                  </span>
                )}

                <ClientThemeToggle />

                {renderAction()}
              </div>

              <div className="md:hidden">
                <ClientThemeToggle />
              </div>
            </div>
          </div>

          {hasNavigation && (
            <div
              id={menuId}
              className={clsx(
                'md:hidden px-5 pb-4 transition-[opacity,transform] duration-200 ease-out',
                isMenuOpen
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0 -translate-y-1'
              )}
            >
              <div className="rounded-[20px] border border-border/45 bg-[color:var(--color-surface)]/96 p-4 shadow-soft">
                <div className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="rounded-[14px] px-3 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors duration-200 hover:bg-[color:var(--color-background-accent)]/70 hover:text-[color:var(--color-primary)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {status && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-secondary)]">
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                )}

                {action && <div className="mt-4">{renderAction('outline')}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
