export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { AdminSignInButton } from '@/components/admin/AdminSignInButton';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { SecureAccessMatrix } from '@/components/SecureAccessMatrix';
import { Toaster } from 'react-hot-toast';
import { Shield, Lock, Github, AlertCircle } from 'lucide-react';
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
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
          },
        }}
      />

      <div
        id="admin-login-wrapper"
        className="page-wrapper relative flex min-h-screen flex-col transition-colors duration-300"
      >
        {/* Interactive Grid Background */}
        <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

        <main
          id="main-content"
          className="main-content flex flex-1 items-center justify-center overflow-hidden py-8 pointer-events-none"
        >
          <div
            id="content-container"
            className="content-container relative z-10 flex w-full max-w-[500px] flex-col gap-12 pointer-events-auto"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {/* Admin Badge */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div
                  className="flex items-center gap-3 rounded-full px-6 py-3"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 12px -4px rgba(38, 38, 35, 0.15)',
                  }}
                >
                  <Shield
                    size={20}
                    className="text-[color:var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span className="font-ui text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-secondary)]">
                    Admin Console
                  </span>
                </div>
              </div>

              <SecureAccessMatrix />

              <p className="text-[color:var(--color-text-secondary)] text-base mt-6">
                Authenticate with GitHub to access workspace analytics and administrative controls.
              </p>
            </div>

            {/* Error Alert */}
            {error && errorMessages[error] && (
              <div
                className="animate-fadeIn-delay-300 opacity-0"
                style={{ marginLeft: '16px', marginRight: '16px' }}
              >
                <div
                  className="rounded-lg p-4 flex items-start gap-3"
                  style={{
                    background: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
                  }}
                >
                  <AlertCircle
                    size={20}
                    className="text-[color:var(--color-error)] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-[color:var(--color-text-primary)]">
                    {errorMessages[error]}
                  </p>
                </div>
              </div>
            )}

            {/* Login Card */}
            <div
              id="login-card-wrapper"
              className="animate-fadeIn-delay-400 opacity-0"
              style={{ marginLeft: '16px', marginRight: '16px' }}
            >
              <Card
                className="overflow-hidden"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="flex items-center justify-center rounded-lg"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                      }}
                    >
                      <Lock
                        size={20}
                        className="text-[color:var(--color-primary)]"
                        aria-hidden="true"
                      />
                    </div>
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
                    className="rounded-lg flex items-start gap-3"
                    style={{
                      background: 'color-mix(in srgb, var(--color-info) 8%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-info) 20%, transparent)',
                      padding: '24px',
                    }}
                  >
                    <Github
                      size={20}
                      className="text-[color:var(--color-info)] flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-[color:var(--color-text-primary)] font-medium mb-1">
                        GitHub OAuth
                      </p>
                      <p className="text-xs text-[color:var(--color-text-muted)]">
                        You&apos;ll be redirected to GitHub to complete the authentication process.
                        Make sure you&apos;re signed in with the correct account.
                      </p>
                    </div>
                  </div>

                  <AdminSignInButton />

                  <div className="text-center">
                    <Link
                      href="/"
                      className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors duration-200"
                    >
                      ← Back to homepage
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Notice */}
            <div
              className="text-center text-xs text-[color:var(--color-text-muted)] animate-fadeIn-delay-800 opacity-0"
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
            >
              <p>
                This area is restricted. All access attempts are logged and monitored for security
                purposes.
              </p>
            </div>
          </div>
        </main>

        <SiteFooter subtitle="Secure authentication • Private access" />
      </div>
    </>
  );
}
