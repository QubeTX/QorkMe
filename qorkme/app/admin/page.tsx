export const dynamic = 'force-dynamic';

import { SiteFooter } from '@/components/SiteFooter';
import { PageHeader } from '@/components/PageHeader';
import { BrandStage } from '@/components/brand/BrandStage';
import { isAdminUser } from '@/lib/admin/identity';
import { createAdminClient, createServerClientInstance } from '@/lib/supabase/server';
import { ADMIN_GITHUB_USERNAME_DISPLAY } from '@/lib/config/admin';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { DatabaseDetails } from '@/components/admin/DatabaseDetails';
import { TrafficDetails } from '@/components/admin/TrafficDetails';
import type { Database } from '@/lib/supabase/types';
import { AdminLinksTable } from '@/components/admin/AdminLinksTable';
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

  if (!isAdminUser(user)) {
    redirect('/admin/login?error=unauthorized');
  }

  // Server-side summary stats — one round trip via the consolidated RPC
  let stats: Database['public']['Functions']['admin_health_stats']['Returns'] | null = null;
  let statsError = false;
  try {
    const adminClient = await createAdminClient();
    const response = await adminClient.rpc('admin_health_stats');
    stats = response.data;
    statsError = !!response.error;
  } catch {
    statsError = true;
  }

  // total_click_count = sum of per-link lifetime counters (matches Top Links
  // and the per-row Clicks); click_count is the clicks-table row count.
  const totalUrls: number | null = statsError ? null : (stats?.url_count ?? null);
  const totalClicks: number | null = statsError ? null : (stats?.total_click_count ?? null);
  const avgClicksPerLink =
    totalUrls === null || totalClicks === null
      ? '—'
      : totalUrls > 0
        ? (totalClicks / totalUrls).toFixed(1)
        : '0.0';

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--color-void)' }}
    >
      <PageHeader right={<span>{ADMIN_GITHUB_USERNAME_DISPLAY}</span>} />

      <main id="main-content" className={styles.main} style={{ paddingTop: '88px' }}>
        <div className={styles.container}>
          <BrandStage compact />
          {/* Heading */}
          <div className={styles.heading}>
            <h1 className={styles.title}>Your links.</h1>
            <p className={styles.subtitle}>Find, check, and manage your short links.</p>
          </div>

          {statsError && (
            <p role="alert" className={styles.error}>
              Summary unavailable. Refresh to try again.
            </p>
          )}
          {/* Summary stats — machine-report grid cells */}
          <div className={styles.statGrid}>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Total links</span>
              <span className={styles.statValue}>{totalUrls?.toLocaleString() ?? '—'}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Total clicks</span>
              <span className={styles.statValue}>{totalClicks?.toLocaleString() ?? '—'}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statLabel}>Avg / link</span>
              <span className={`${styles.statValue} ${styles.accent}`}>{avgClicksPerLink}</span>
            </div>
          </div>

          {/* All short links — search, filter, sort, bulk clear (progressive, client) */}
          <AdminLinksTable />

          <TrafficDetails />
          <DatabaseDetails />

          {/* Session */}
          <div className={styles.sessionRow}>
            <div className={styles.sessionMeta}>
              <span className={styles.kvValue}>Signed in as {ADMIN_GITHUB_USERNAME_DISPLAY}</span>
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
