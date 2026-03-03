export const dynamic = 'force-dynamic';

import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME, ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { ClearDatabaseButton } from '@/components/admin/ClearDatabaseButton';
import { DatabaseHealthCard } from '@/components/admin/DatabaseHealthCard';
import { AdminLinksTable } from '@/components/admin/AdminLinksTable';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { SecureAccessMatrix } from '@/components/SecureAccessMatrix';
import { Toaster } from 'react-hot-toast';
import { Activity, AlertTriangle, BarChart3 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const resolvedGithubUsername = extractGithubUsername(user);
  const isAuthorized = Boolean(user) && resolvedGithubUsername === ADMIN_GITHUB_USERNAME;

  if (!isAuthorized) {
    redirect('/admin/login?error=unauthorized');
  }

  // Server-side summary stats (render instantly, no loading state)
  const adminClient = await createAdminClient();

  const [urlCountResponse, activeUrlResponse, clickCountResponse] = await Promise.all([
    adminClient.from('urls').select('id', { count: 'exact', head: true }),
    adminClient.from('urls').select('id', { count: 'exact', head: true }).eq('is_active', true),
    adminClient.from('clicks').select('id', { count: 'exact', head: true }),
  ]);

  const totalUrls = urlCountResponse.count ?? 0;
  const activeUrls = activeUrlResponse.count ?? 0;
  const totalClicks = clickCountResponse.count ?? 0;
  const activeRatio = totalUrls > 0 ? Math.round((activeUrls / totalUrls) * 100) : 0;

  const summaryCardStyle = {
    background: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
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
        id="admin-dashboard-wrapper"
        className="page-wrapper relative flex min-h-screen flex-col transition-colors duration-300"
      >
        <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

        <main
          id="main-content"
          className="main-content flex flex-1 flex-col items-center justify-center pt-8 pb-16 pointer-events-none"
        >
          <div
            id="content-container"
            className="content-container relative z-10 flex w-full max-w-[1200px] flex-col gap-12 mx-auto pointer-events-auto"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {/* 1. Header Section */}
            <div className="flex flex-col gap-6 animate-fadeIn-delay-200 opacity-0">
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

            <div className="flex flex-col gap-10 animate-fadeIn-delay-400 opacity-0">
              {/* 2. Summary Stats Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card style={summaryCardStyle}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Total Links</CardTitle>
                      <CardDescription>Auto and custom aliases</CardDescription>
                    </div>
                    <BarChart3
                      size={22}
                      className="text-[color:var(--color-accent)]"
                      aria-hidden="true"
                    />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                      {totalUrls.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card style={summaryCardStyle}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Total Clicks</CardTitle>
                      <CardDescription>Aggregated across all links</CardDescription>
                    </div>
                    <Activity
                      size={22}
                      className="text-[color:var(--color-accent)]"
                      aria-hidden="true"
                    />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                      {totalClicks.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card style={summaryCardStyle}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Active Ratio</CardTitle>
                      <CardDescription>
                        {activeUrls} of {totalUrls} links active
                      </CardDescription>
                    </div>
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: '36px',
                        height: '36px',
                        background: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
                      }}
                    >
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {activeRatio}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full"
                      style={{ background: 'var(--color-border)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${activeRatio}%`,
                          background: 'var(--color-success)',
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 3. Database Health (client component, loads progressively) */}
              <DatabaseHealthCard />

              {/* 4. All Short Links (client component, loads progressively) */}
              <AdminLinksTable />

              {/* 5. Danger Zone */}
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

              {/* 6. Session Management */}
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
