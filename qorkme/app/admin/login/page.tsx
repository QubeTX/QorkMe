export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { BrandStage } from '@/components/brand/BrandStage';
import { AdminSignInButton } from '@/components/admin/AdminSignInButton';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';
import { createServerClientInstance } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin/identity';
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
  if (isAdminUser(user)) redirect('/admin');
  const { error } = await searchParams;
  return (
    <div className="flex min-h-dvh flex-col">
      <main id="main-content" className="page-content" style={{ maxWidth: 640 }}>
        <BrandStage compact />
        <div className="message-panel">
          <h1>Welcome back.</h1>
          <p>Sign in with GitHub to manage your links.</p>
          {(user || error === 'unauthorized') && (
            <p role="alert" style={{ color: 'var(--color-error)' }}>
              This account does not have admin access. Sign out to use the authorized account.
            </p>
          )}
          {error === 'auth_failed' && (
            <p role="alert" style={{ color: 'var(--color-error)' }}>
              Sign-in did not finish. Please try again.
            </p>
          )}
          {user ? <AdminSignOutButton /> : <AdminSignInButton />}
          <div className="mt-6">
            <Link className="inline-flex min-h-11 items-center text-primary" href="/">
              ← Back to shortening
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
