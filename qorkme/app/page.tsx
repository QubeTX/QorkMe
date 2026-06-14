import { SiteFooter } from '@/components/SiteFooter';
import DotGrid from '@/components/effects/DotGrid';
import LoadSequence from '@/components/effects/LoadSequence';
import Hero from '@/components/sections/Hero';

export default function Home() {
  return (
    <div className="font-makira relative flex min-h-screen flex-col overflow-hidden">
      {/* The dot field — listens on window, never blocks clicks */}
      <DotGrid className="fixed inset-0 z-0" />
      <LoadSequence />

      <Hero />

      <SiteFooter />
    </div>
  );
}
