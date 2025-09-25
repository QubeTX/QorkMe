export const dynamic = 'force-dynamic';

import { NavigationHeader } from '@/components/NavigationHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME, ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignInButton } from '@/components/admin/AdminSignInButton';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { ClearDatabaseButton } from '@/components/admin/ClearDatabaseButton';
import { Toaster } from 'react-hot-toast';
import { Activity, Database, RefreshCcw, Shield, BarChart3 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

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

  const resolvedGithubUsername = extractGithubUsername(user);
  const isAuthorized = Boolean(user) && resolvedGithubUsername === ADMIN_GITHUB_USERNAME;

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

      <div className="flex min-h-screen flex-col bg-background text-text-primary">
        <NavigationHeader />

        <main className="flex flex-1 flex-col">
          <section className="page-section pt-[calc(var(--section-spacing)+4rem)]">
            <div className="container flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <span className="font-ui text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-secondary)]">
                  Admin Console
                </span>
                <h1 className="font-display text-4xl font-semibold">
                  Workspace analytics & maintenance
                </h1>
                <p className="max-w-2xl text-text-secondary">
                  Restricted access. Sign in with GitHub as{' '}
                  <span className="font-mono">{ADMIN_GITHUB_USERNAME_DISPLAY}</span> to review
                  aggregate Supabase metrics and manage stored URLs.
                </p>
              </div>

              {!user && (
                <Card className="max-w-xl">
                  <CardHeader>
                    <CardTitle>Authentication required</CardTitle>
                    <CardDescription>
                      Start a GitHub login to prove you&apos;re the designated admin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <AdminSignInButton />
                  </CardContent>
                </Card>
              )}

              {user && !isAuthorized && (
                <Card className="max-w-xl border-red-500/40">
                  <CardHeader>
                    <CardTitle>Access denied</CardTitle>
                    <CardDescription>
                      Signed in as{' '}
                      <span className="font-mono">{resolvedGithubUsername ?? 'unknown'}</span>,
                      which does not match{' '}
                      <span className="font-mono">{ADMIN_GITHUB_USERNAME_DISPLAY}</span>. Please
                      switch accounts in Supabase.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <AdminSignOutButton />
                  </CardContent>
                </Card>
              )}

              {isAuthorized && metrics && (
                <div className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Total short links</CardTitle>
                          <CardDescription>Includes auto and custom aliases.</CardDescription>
                        </div>
                        <BarChart3
                          size={22}
                          className="text-[color:var(--color-secondary)]"
                          aria-hidden="true"
                        />
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-semibold">
                          {metrics.totalUrls.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Active redirects</CardTitle>
                          <CardDescription>Currently available short links.</CardDescription>
                        </div>
                        <Activity
                          size={22}
                          className="text-[color:var(--color-secondary)]"
                          aria-hidden="true"
                        />
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-semibold">
                          {metrics.activeUrls.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Total recorded clicks</CardTitle>
                          <CardDescription>Aggregated across every short link.</CardDescription>
                        </div>
                        <RefreshCcw
                          size={22}
                          className="text-[color:var(--color-secondary)]"
                          aria-hidden="true"
                        />
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-semibold">
                          {metrics.totalClicks.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Database health</CardTitle>
                          <CardDescription>{metrics.databaseHealth.detail}</CardDescription>
                        </div>
                        <Shield
                          size={22}
                          className="text-[color:var(--color-secondary)]"
                          aria-hidden="true"
                        />
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold">{metrics.databaseHealth.status}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Most recent URL</CardTitle>
                          <CardDescription>Timestamp of the latest entry.</CardDescription>
                        </div>
                        <Database
                          size={22}
                          className="text-[color:var(--color-secondary)]"
                          aria-hidden="true"
                        />
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold">{formatDate(metrics.lastCreatedAt)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-red-500/45 bg-red-500/5">
                    <CardHeader>
                      <CardTitle>Danger zone</CardTitle>
                      <CardDescription>
                        Permanently remove every stored URL along with associated click analytics.
                        Supabase tables remain intact.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-text-secondary">
                        Only use this when you need a clean slate. The action cannot be undone and
                        cascades to related click records.
                      </p>
                      <ClearDatabaseButton />
                    </CardContent>
                  </Card>

                  <div>
                    <AdminSignOutButton />
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <SiteFooter subtitle="Admin access • Private control room" />
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
