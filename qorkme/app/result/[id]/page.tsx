import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { BrandStage } from '@/components/brand/BrandStage';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createServerClientInstance();
  const { data: url, error } = await supabase
    .from('urls')
    .select('short_code, is_active, expires_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('Link lookup unavailable');
  if (!url || !url.is_active || (url.expires_at && new Date(url.expires_at) <= new Date()))
    notFound();
  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader />
      <main id="main-content" className="page-content" style={{ maxWidth: 800 }}>
        <BrandStage compact />
        <h1 className="sr-only">Your short link</h1>
        <ShortUrlDisplay shortCode={url.short_code} />
        <div className="mt-8 text-center">
          <Link href="/" className="btn bg-primary text-white">
            Shorten another →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
