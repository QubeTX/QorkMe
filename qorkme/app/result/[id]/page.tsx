import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { ResultNavigationHeader } from '@/components/ResultNavigationHeader';
import { Card, CardContent } from '@/components/cards/Card';
import { MetricCard } from '@/components/cards/MetricCard';
import { Button } from '@/components/ui/Button';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Link2, BarChart3, Shield } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { SiteFooter } from '@/components/SiteFooter';

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  // const { code } = await searchParams;

  // Fetch URL data from database
  const supabase = await createServerClientInstance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: url, error } = await (supabase as any)
    .from('urls')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !url) {
    notFound();
  }

  const detailCards = [
    {
      title: 'Total clicks',
      value: url.click_count || 0,
      icon: <BarChart3 size={20} aria-hidden="true" />,
      accent: 'accent' as const,
    },
    {
      title: 'Alias type',
      value: url.custom_alias ? 'Custom' : 'Auto',
      icon: <Link2 size={20} aria-hidden="true" />,
      accent: 'secondary' as const,
    },
    {
      title: 'Status',
      value: url.is_active ? 'Active' : 'Inactive',
      icon: <Shield size={20} aria-hidden="true" />,
      accent: 'primary' as const,
    },
  ];

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
            boxShadow: '0 12px 30px -18px rgba(15, 23, 42, 0.35)',
          },
        }}
      />

      <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <ResultNavigationHeader />

        <main className="flex flex-1 flex-col space-y-24 px-4 pb-32 pt-[var(--nav-offset-mobile)] sm:px-6 md:space-y-28 md:pt-[var(--nav-offset-desktop)]">
          <div className="container mx-auto max-w-5xl space-y-16 px-4 sm:px-6 sm:space-y-20 md:space-y-24">
            <ShortUrlDisplay
              shortCode={url.short_code}
              longUrl={url.long_url}
              domain={new URL(url.long_url).hostname}
              createdAt={url.created_at}
            />

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
              {detailCards.map((stat) => (
                <MetricCard
                  key={stat.title}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.title}
                  accent={stat.accent}
                />
              ))}
            </div>

            <Card hoverable={false} className="text-center">
              <CardContent className="space-y-10 py-14">
                <h3 className="font-display text-2xl md:text-3xl text-text-primary">
                  Need deeper analytics?
                </h3>
                <p className="mx-auto max-w-2xl text-text-secondary">
                  Unlock campaign tagging, multi-user collaboration, and full clickstream history
                  inside the QorkMe dashboard. The same calm interface extends across desktop,
                  tablet, and mobile.
                </p>
                <Link href="/">
                  <Button size="lg" className="justify-center px-8">
                    Shorten another URL
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>

        <SiteFooter subtitle="Precision link studio" />
      </div>
    </>
  );
}
