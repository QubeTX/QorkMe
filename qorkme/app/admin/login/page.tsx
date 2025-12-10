export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { AdminSignInButton } from '@/components/admin/AdminSignInButton';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { SecureAccessMatrix } from '@/components/SecureAccessMatrix';
import { Toaster } from 'react-hot-toast';
import { Lock, Github, AlertCircle } from 'lucide-react';
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
          className="main-content flex flex-1 items-center justify-center pointer-events-none"
          style={{ paddingTop: '24px', paddingBottom: '24px' }}
        >
          <div
            id="content-container"
            className="content-container relative z-10 flex w-full max-w-[900px] flex-col md:flex-row items-center justify-center gap-8 md:gap-12 pointer-events-auto"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {/* Secure Access Matrix - Left side on desktop */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <SecureAccessMatrix />
            </div>

            {/* Right side - Error Alert + Login Card */}
            <div className="flex flex-col gap-6 w-full max-w-[400px]">
              {/* Error Alert */}
              {error && errorMessages[error] && (
                <div className="animate-fadeIn-delay-300 opacity-0">
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
              <div id="login-card-wrapper" className="animate-fadeIn-delay-400 opacity-0">
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
                          You&apos;ll be redirected to GitHub to complete the authentication
                          process. Make sure you&apos;re signed in with the correct account.
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
            </div>
          </div>
        </main>

        <SiteFooter subtitle="Secure authentication • Private access" />
      </div>
    </>
  );
}
