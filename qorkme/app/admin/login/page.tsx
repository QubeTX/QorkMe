export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { AdminSignInButton } from '@/components/admin/AdminSignInButton';
import MatrixDisplay from '@/components/effects/MatrixDisplay';
import { Lock, Github } from 'lucide-react';
import { ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { createServerClientInstance } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already authenticated, redirect to admin dashboard
  if (user) {
    redirect('/admin');
  }

  const params = await searchParams;
  const error = params.error;

  const errorMessages: Record<string, string> = {
    auth_failed: 'Authentication failed. Please try again.',
    unauthorized:
      'You do not have permission to access this area. Please sign in with the authorized admin account.',
  };

  return (
    <div
      className="font-makira flex min-h-screen flex-col"
      style={{ background: 'var(--color-void)' }}
    >
      <main
        className="flex flex-1 items-center justify-center"
        style={{ padding: 'var(--space-xl) var(--container-padding-x)' }}
      >
        <div className="flex w-full flex-col" style={{ maxWidth: '440px', gap: 'var(--space-lg)' }}>
          <div className="flex flex-col items-center" style={{ gap: 'var(--space-sm)' }}>
            <span className="mono-label">ADMIN // SECURE ACCESS</span>
            <div style={{ width: 'min(100%, 320px)', height: '52px' }}>
              <MatrixDisplay words={['SECURE', 'ACCESS']} className="h-full w-full" />
            </div>
          </div>

          {error && errorMessages[error] && (
            <p
              role="alert"
              className="font-mono text-xs"
              style={{
                color: 'var(--color-error)',
                border: '1px solid var(--color-border)',
                borderLeft: '2px solid var(--color-error)',
                borderRadius: '4px',
                padding: '12px 14px',
                background: 'var(--color-surface)',
              }}
            >
              ERR // {errorMessages[error]}
            </p>
          )}

          <Card hoverable={false}>
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <Lock size={18} className="text-[color:var(--color-primary)]" aria-hidden="true" />
                <CardTitle>Authentication Required</CardTitle>
              </div>
              <CardDescription>
                Sign in with your GitHub account to verify access. Only the designated admin{' '}
                <span className="font-mono text-[color:var(--color-primary)]">
                  {ADMIN_GITHUB_USERNAME_DISPLAY}
                </span>{' '}
                can access this console.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div
                className="flex items-start gap-3"
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '16px',
                  background: '#070a14',
                }}
              >
                <Github
                  size={18}
                  className="mt-0.5 flex-shrink-0 text-[color:var(--color-info)]"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-[color:var(--color-text-primary)]">
                    GitHub OAuth
                  </p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">
                    You&apos;ll be redirected to GitHub to complete the authentication process. Make
                    sure you&apos;re signed in with the correct account.
                  </p>
                </div>
              </div>

              <AdminSignInButton />

              <div className="text-center">
                <Link
                  href="/"
                  className="font-mono text-xs uppercase tracking-[0.12em] text-[color:var(--color-text-dim)] transition-colors hover:text-[color:var(--color-primary-hover)]"
                >
                  ← Back to homepage
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
