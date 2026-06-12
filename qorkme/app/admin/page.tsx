export const dynamic = 'force-dynamic';

import { SiteFooter } from '@/components/SiteFooter';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME, ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { ClearDatabaseButton } from '@/components/admin/ClearDatabaseButton';
import { DatabaseHealthCard } from '@/components/admin/DatabaseHealthCard';
import { AdminLinksTable } from '@/components/admin/AdminLinksTable';
import StatValue from '@/components/ui/StatValue';
import { AlertTriangle } from 'lucide-react';
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

  // Server-side summary stats — one round trip via the consolidated RPC
  const adminClient = await createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats } = await (adminClient as any).rpc('admin_health_stats');

  const totalUrls: number = stats?.url_count ?? 0;
  const totalClicks: number = stats?.click_count ?? 0;
  const avgClicksPerLink = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : '0.0';

  return (
    <div
      className="font-makira flex min-h-screen flex-col"
      style={{ background: 'var(--color-void)' }}
    >
      <PageHeader right={<span>AUTH // {ADMIN_GITHUB_USERNAME_DISPLAY}</span>} />

      <main className="flex flex-1 flex-col" style={{ paddingTop: '112px' }}>
        <div
          className="mx-auto flex w-full flex-col"
          style={{
            maxWidth: '1200px',
            paddingInline: 'var(--container-padding-x)',
            paddingBottom: 'var(--section-spacing)',
            gap: 'var(--space-xl)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
            <span className="mono-label">ADMIN CONSOLE // OPERATIONAL</span>
            <h1 style={{ fontSize: 'var(--text-h2)' }}>Console</h1>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Review aggregate metrics and manage stored URLs.
            </p>
          </div>

          {/* Summary stats — Makira Black numerals count up on entrance */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card hoverable={false}>
              <StatValue value={totalUrls.toLocaleString()} label="Total links" />
            </Card>
            <Card hoverable={false}>
              <StatValue value={totalClicks.toLocaleString()} label="Total clicks" />
            </Card>
            <Card hoverable={false}>
              <StatValue value={avgClicksPerLink} label="Avg clicks / link" />
            </Card>
          </div>

          {/* Database health (client component, loads progressively) */}
          <DatabaseHealthCard />

          {/* All short links (client component, loads progressively) */}
          <AdminLinksTable />

          {/* Danger zone */}
          <Card
            hoverable={false}
            style={{
              borderColor: 'color-mix(in srgb, var(--color-error) 45%, var(--color-border))',
            }}
          >
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <AlertTriangle
                  size={20}
                  className="text-[color:var(--color-error)]"
                  aria-hidden="true"
                />
                <CardTitle className="text-[color:var(--color-error)]">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Permanently remove every stored URL along with associated click analytics. Supabase
                tables remain intact.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[color:var(--color-text-secondary)]">
                Only use this when you need a clean slate. The action cannot be undone and cascades
                to related click records.
              </p>
              <ClearDatabaseButton />
            </CardContent>
          </Card>

          {/* Session management */}
          <div className="flex flex-col items-start gap-4">
            <div className="h-px w-full" style={{ background: 'var(--color-border)' }} />
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                  Session Management
                </p>
                <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                  Sign out to end your admin session
                </p>
              </div>
              <AdminSignOutButton />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
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
