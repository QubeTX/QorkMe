import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { GeometricDecor } from '@/components/bauhaus/GeometricDecor';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  const { id } = await params;
  const { code } = await searchParams;

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

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bauhaus-white)',
            color: 'var(--bauhaus-black)',
            border: '3px solid var(--bauhaus-black)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
          },
        }}
      />

      <div className="relative min-h-screen bg-bauhaus-white overflow-hidden">
        {/* Geometric Background Decorations */}
        <GeometricDecor />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <main className="w-full max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Back Link */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-bauhaus-gray hover:text-bauhaus-black transition-colors mb-8"
              >
                <ArrowLeft size={20} />
                <span className="font-display uppercase">Create Another</span>
              </Link>

              {/* Geometric Logo */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-bauhaus-red rounded-full animate-float" />
                <div className="w-12 h-12 bg-bauhaus-blue rotate-45 animate-rotate-slow" />
                <div
                  className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[42px] border-b-bauhaus-yellow animate-float"
                  style={{ animationDelay: '1s' }}
                />
              </div>

              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wider">
                QORK.ME
              </h1>
            </div>

            {/* Result Display */}
            <ShortUrlDisplay
              shortCode={url.short_code}
              longUrl={url.long_url}
              domain={new URL(url.long_url).hostname}
              createdAt={url.created_at}
            />

            {/* Stats Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-4 border-bauhaus-black p-4 text-center">
                <div className="font-display text-3xl text-bauhaus-blue">
                  {url.click_count || 0}
                </div>
                <p className="font-display uppercase text-sm text-bauhaus-gray">Total Clicks</p>
              </div>

              <div className="border-4 border-bauhaus-black p-4 text-center">
                <div className="font-display text-3xl text-bauhaus-red">
                  {url.custom_alias ? 'Custom' : 'Auto'}
                </div>
                <p className="font-display uppercase text-sm text-bauhaus-gray">Alias Type</p>
              </div>

              <div className="border-4 border-bauhaus-black p-4 text-center">
                <div className="font-display text-3xl text-bauhaus-yellow">
                  {url.is_active ? 'Active' : 'Inactive'}
                </div>
                <p className="font-display uppercase text-sm text-bauhaus-gray">Status</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
