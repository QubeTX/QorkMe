import { UrlShortener } from '@/components/UrlShortener';
import { NavigationHeader } from '@/components/NavigationHeader';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { Card } from '@/components/cards/Card';
import { MetricCard } from '@/components/cards/MetricCard';
import { Button } from '@/components/ui/Button';
import { Toaster } from 'react-hot-toast';
import {
  ArrowUpRight,
  BarChart3,
  Globe,
  Link2,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  const stats = [
    { value: '200K+', label: 'URLs curated', accent: 'primary' as const },
    { value: '15+', label: 'Global regions', accent: 'accent' as const },
    { value: '50ms', label: 'Average redirect', accent: 'secondary' as const },
    { value: '24/7', label: 'Monitoring', accent: 'primary' as const },
  ];

  const heroHighlights = [
    {
      title: 'Active links',
      value: '200K+',
      icon: <BarChart3 size={20} aria-hidden="true" />,
      accent: 'primary' as const,
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: <Shield size={20} aria-hidden="true" />,
      accent: 'secondary' as const,
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
        <NavigationHeader />

        <main className="flex flex-1 flex-col pt-28 md:pt-32">
          <section className="relative px-6 pb-24">
            <div className="container grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]">
                  <Sparkles size={18} aria-hidden="true" />
                  Premium link studio
                </span>
                <div className="space-y-6">
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                    Precision short links for teams that move quickly
                  </h1>
                  <p className="max-w-2xl text-lg text-text-secondary">
                    QorkMe pairs intentional spacing, friendly forms, and consistent cards with the
                    analytics and controls growing brands expect. Toggle themes, resize the window, and
                    every surface adapts gracefully.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="#shorten" className="inline-flex">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start shortening
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/docs" className="inline-flex">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explore docs
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {heroHighlights.map((highlight) => (
                    <MetricCard
                      key={highlight.title}
                      icon={highlight.icon}
                      value={highlight.value}
                      label={highlight.title}
                      accent={highlight.accent}
                    />
                  ))}
                </div>
              </div>

              <div className="relative" id="shorten">
                <div
                  className="absolute inset-0 -translate-y-6 -translate-x-4 rounded-[var(--radius-xl)] bg-[color:var(--color-primary)]/15 blur-3xl"
                  aria-hidden="true"
                />
                <Card elevated className="relative">
                  <UrlShortener />
                </Card>
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="container space-y-12">
              <Card hoverable={false} className="mx-auto max-w-4xl text-center">
                <div className="space-y-4">
                  <h2 className="font-display text-3xl md:text-4xl text-text-primary">
                    Why discerning teams choose QorkMe
                  </h2>
                  <p className="mx-auto max-w-2xl text-base md:text-lg text-text-secondary">
                    Shared components, measured spacing, and accessible interactions carry across the
                    entire experience. Cards, buttons, and inputs are reused everywhere so the interface
                    feels familiar from the homepage to analytics.
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <FeatureCard
                  icon={<Zap size={24} aria-hidden="true" />}
                  title="Lightning fast"
                  description="Edge deployments and adaptive caching deliver millisecond redirects no matter where your audience clicks."
                />
                <FeatureCard
                  icon={<Shield size={24} aria-hidden="true" />}
                  title="Enterprise secure"
                  description="Layered safeguards, from rate limiting to malicious URL scrubbing, protect every branded touchpoint."
                />
                <FeatureCard
                  icon={<BarChart3 size={24} aria-hidden="true" />}
                  title="Rich analytics"
                  description="Understand engagement with geographic, device, and referral insights presented in a clear, compact dashboard."
                />
                <FeatureCard
                  icon={<Globe size={24} aria-hidden="true" />}
                  title="Global reach"
                  description="Multi-region infrastructure keeps experiences cohesive, stable, and quick across the globe."
                />
                <FeatureCard
                  icon={<Link2 size={24} aria-hidden="true" />}
                  title="Custom aliases"
                  description="Craft pronounceable, on-brand short codes with precise validation and collision prevention."
                />
                <FeatureCard
                  icon={<Sparkles size={24} aria-hidden="true" />}
                  title="Guided creation"
                  description="A refined flow guides teams from paste to share with subtle animations, helper text, and keyboard-friendly controls."
                />
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <MetricCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  accent={stat.accent}
                  layout="vertical"
                />
              ))}
            </div>
          </section>

          <section className="px-6 pb-28">
            <div className="container max-w-4xl">
              <Card hoverable={false} className="text-center">
                <div className="space-y-6">
                  <h2 className="font-display text-3xl md:text-4xl text-text-primary">
                    Ready to elevate every link?
                  </h2>
                  <p className="mx-auto max-w-3xl text-base md:text-lg text-text-secondary">
                    From campaign launches to enterprise migrations, QorkMe keeps your audience journeys
                    considered, cohesive, and measurable. Switch the theme, resize the browser—every
                    detail stays balanced.
                  </p>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="#shorten" className="inline-flex">
                      <Button size="lg" className="w-full sm:w-auto">
                        Create a short link
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/docs" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        View documentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
