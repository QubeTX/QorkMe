export const dynamic = 'force-dynamic';

import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME, ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { ClearDatabaseButton } from '@/components/admin/ClearDatabaseButton';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { SecureAccessMatrix } from '@/components/SecureAccessMatrix';
import { Toaster } from 'react-hot-toast';
import { Activity, Database, RefreshCcw, Shield, BarChart3, AlertTriangle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

function formatDate(value: string | null) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default async function AdminPage() {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login page
  if (!user) {
    redirect('/admin/login');
  }

  const resolvedGithubUsername = extractGithubUsername(user);
  const isAuthorized = Boolean(user) && resolvedGithubUsername === ADMIN_GITHUB_USERNAME;

  // Redirect unauthorized users to login page with error
  if (!isAuthorized) {
    redirect('/admin/login?error=unauthorized');
  }

  let metrics: {
    totalUrls: number;
    activeUrls: number;
    totalClicks: number;
    lastCreatedAt: string | null;
    databaseHealth: {
      status: string;
      detail: string;
    };
  } | null = null;

  if (isAuthorized) {
    const adminClient = await createAdminClient();

    const [urlCountResponse, activeUrlResponse, clickCountResponse, latestUrlResponse] =
      await Promise.all([
        adminClient.from('urls').select('id', { count: 'exact', head: true }),
        adminClient.from('urls').select('id', { count: 'exact', head: true }).eq('is_active', true),
        adminClient.from('clicks').select('id', { count: 'exact', head: true }),
        adminClient
          .from('urls')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

    const { error: healthError } = await adminClient.from('urls').select('id', { head: true });

    const latestCreatedAt =
      (latestUrlResponse.data as { created_at: string } | null)?.created_at ?? null;

    metrics = {
      totalUrls: urlCountResponse.count ?? 0,
      activeUrls: activeUrlResponse.count ?? 0,
      totalClicks: clickCountResponse.count ?? 0,
      lastCreatedAt: latestCreatedAt,
      databaseHealth: healthError
        ? {
            status: 'Attention needed',
            detail: healthError.message,
          }
        : {
            status: 'Operational',
            detail: 'Supabase responded successfully to the admin health check query.',
          },
    };
  }

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
        id="admin-dashboard-wrapper"
        className="page-wrapper relative flex min-h-screen flex-col transition-colors duration-300"
      >
        {/* Interactive Grid Background */}
        <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

        <main
          id="main-content"
          className="main-content flex flex-1 flex-col justify-center overflow-hidden py-8"
        >
          <div
            id="content-container"
            className="content-container relative z-10 flex w-full max-w-[1200px] flex-col gap-12 mx-auto"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {/* Header Section */}
            <div className="flex flex-col gap-6 animate-fadeIn-delay-200 opacity-0">
              <div className="flex items-center justify-center gap-3">
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

              <div className="flex flex-col gap-4 text-center">
                <p className="max-w-2xl mx-auto text-[color:var(--color-text-secondary)] text-base">
                  Authenticated as{' '}
                  <span className="font-mono text-[color:var(--color-primary)]">
                    {ADMIN_GITHUB_USERNAME_DISPLAY}
                  </span>{' '}
                  • Review aggregate metrics and manage stored URLs
                </p>
              </div>
            </div>

            {metrics && (
              <div className="flex flex-col gap-10 animate-fadeIn-delay-400 opacity-0">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <Card
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Total short links</CardTitle>
                        <CardDescription>Includes auto and custom aliases.</CardDescription>
                      </div>
                      <BarChart3
                        size={22}
                        className="text-[color:var(--color-accent)]"
                        aria-hidden="true"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                        {metrics.totalUrls.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Active redirects</CardTitle>
                        <CardDescription>Currently available short links.</CardDescription>
                      </div>
                      <Activity
                        size={22}
                        className="text-[color:var(--color-accent)]"
                        aria-hidden="true"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                        {metrics.activeUrls.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Total recorded clicks</CardTitle>
                        <CardDescription>Aggregated across every short link.</CardDescription>
                      </div>
                      <RefreshCcw
                        size={22}
                        className="text-[color:var(--color-accent)]"
                        aria-hidden="true"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                        {metrics.totalClicks.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Database health</CardTitle>
                        <CardDescription>{metrics.databaseHealth.detail}</CardDescription>
                      </div>
                      <Shield
                        size={22}
                        className={
                          metrics.databaseHealth.status === 'Operational'
                            ? 'text-[color:var(--color-success)]'
                            : 'text-[color:var(--color-warning)]'
                        }
                        aria-hidden="true"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                        {metrics.databaseHealth.status}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Most recent URL</CardTitle>
                        <CardDescription>Timestamp of the latest entry.</CardDescription>
                      </div>
                      <Database
                        size={22}
                        className="text-[color:var(--color-accent)]"
                        aria-hidden="true"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                        {formatDate(metrics.lastCreatedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Danger Zone */}
                <Card
                  style={{
                    background: 'color-mix(in srgb, var(--color-error) 5%, var(--color-surface))',
                    borderColor: 'color-mix(in srgb, var(--color-error) 40%, transparent)',
                    boxShadow: '0 12px 30px -18px rgba(192, 77, 60, 0.25)',
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle
                        size={24}
                        className="text-[color:var(--color-error)]"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-[color:var(--color-error)]">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>
                      Permanently remove every stored URL along with associated click analytics.
                      Supabase tables remain intact.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[color:var(--color-text-secondary)]">
                      Only use this when you need a clean slate. The action cannot be undone and
                      cascades to related click records.
                    </p>
                    <ClearDatabaseButton />
                  </CardContent>
                </Card>

                {/* Sign Out Section */}
                <div className="flex flex-col gap-4 items-start">
                  <div className="w-full h-px" style={{ background: 'var(--color-border)' }} />
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        Session Management
                      </p>
                      <p className="text-xs text-[color:var(--color-text-muted)] mt-1">
                        Sign out to end your admin session
                      </p>
                    </div>
                    <AdminSignOutButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <SiteFooter subtitle="Admin dashboard • Secure workspace" />
      </div>
    </>
  );
}

function extractGithubUsername(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};
  const candidates: Array<unknown> = [
    metadata.user_name,
    metadata.preferred_username,
    metadata.nickname,
    metadata.name,
    metadata.full_name,
  ];

  const identities = Array.isArray(user.identities) ? user.identities : [];
  for (const identity of identities) {
    const data = identity?.identity_data ?? {};
    candidates.push(
      data?.user_name,
      data?.preferred_username,
      data?.nickname,
      data?.name,
      data?.full_name
    );
  }

  const candidate = candidates.find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );

  return candidate ? candidate.toLowerCase() : null;
}
