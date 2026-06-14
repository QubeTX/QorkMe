export const dynamic = 'force-dynamic';

import { SiteFooter } from '@/components/SiteFooter';
import { PageHeader } from '@/components/PageHeader';
import DotGrid from '@/components/effects/DotGrid';
import LabelPill from '@/components/ui/LabelPill';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME, ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { ClearDatabaseButton } from '@/components/admin/ClearDatabaseButton';
import { DatabaseHealthCard } from '@/components/admin/DatabaseHealthCard';
import { AdminLinksTable } from '@/components/admin/AdminLinksTable';
import { AlertTriangle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import styles from '@/components/admin/admin.module.css';

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
      className="font-makira relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Dot field backdrop — ties the console to the rest of the site */}
      <DotGrid className="fixed inset-0 z-0" />

      <PageHeader right={<span>AUTH // {ADMIN_GITHUB_USERNAME_DISPLAY}</span>} />

      <main className={styles.main} style={{ paddingTop: '112px' }}>
        <div className={styles.container}>
          {/* Heading */}
          <div className={styles.heading}>
            <LabelPill variant="bar">ADMIN CONSOLE // OPERATIONAL</LabelPill>
            <h1 className={styles.title}>Console</h1>
            <div className={styles.rule} aria-hidden="true" />
            <p className={styles.subtitle}>Aggregate metrics and link operations for qork.me.</p>
          </div>

          {/* Summary stats — machine-report grid cells */}
          <div className={styles.statGrid}>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Total links</span>
              <span className={styles.statValue}>{totalUrls.toLocaleString()}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Total clicks</span>
              <span className={styles.statValue}>{totalClicks.toLocaleString()}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Avg / link</span>
              <span className={`${styles.statValue} ${styles.accent}`}>{avgClicksPerLink}</span>
            </div>
          </div>

          {/* Database health (progressive, client) */}
          <DatabaseHealthCard />

          {/* All short links (progressive, client) */}
          <AdminLinksTable />

          {/* Danger zone */}
          <section className={styles.danger} aria-label="Danger zone">
            <div className={styles.dangerHead}>
              <AlertTriangle size={16} aria-hidden="true" />
              <span className={styles.dangerTitle}>DANGER ZONE // DESTRUCTIVE</span>
            </div>
            <div className={styles.dangerBody}>
              <p className={styles.dangerText}>
                Permanently remove every stored URL and its click analytics. The Supabase schema is
                preserved; the data is not recoverable.
              </p>
              <ClearDatabaseButton />
            </div>
          </section>

          {/* Session */}
          <div className={styles.sessionRow}>
            <div className={styles.sessionMeta}>
              <span className={styles.kvValue}>Session // {ADMIN_GITHUB_USERNAME_DISPLAY}</span>
              <span className={styles.kvLabel}>Sign out to end your admin session</span>
            </div>
            <AdminSignOutButton />
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
