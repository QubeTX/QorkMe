import { UrlShortener } from '@/components/UrlShortener';
import { NavigationHeader } from '@/components/NavigationHeader';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { Card } from '@/components/cards/Card';
import { Toaster } from 'react-hot-toast';
import { Zap, Shield, BarChart3, Link2, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
          },
        }}
      />

      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-medium">Clean. Modern. Powerful.</span>
              </div>
              <h1 className="font-display font-bold mb-6 text-gradient">
                Shorten Links,
                <br />
                Amplify Impact
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Transform your long URLs into memorable, trackable links with our modern URL
                shortener. Built for teams that value simplicity and performance.
              </p>
            </div>

            {/* URL Shortener Card */}
            <Card
              elevated
              className="max-w-3xl mx-auto mb-24 animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            >
              <UrlShortener />
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <FeatureCard
                icon={<Zap size={24} />}
                title="Lightning Fast"
                description="Optimized for speed with edge deployment and intelligent caching for instant redirects."
              />
              <FeatureCard
                icon={<Shield size={24} />}
                title="Enterprise Secure"
                description="Built-in security features including SSL, rate limiting, and protection against malicious URLs."
              />
              <FeatureCard
                icon={<BarChart3 size={24} />}
                title="Rich Analytics"
                description="Track clicks, devices, locations, and referrers with our comprehensive analytics dashboard."
              />
              <FeatureCard
                icon={<Globe size={24} />}
                title="Global CDN"
                description="Distributed across multiple regions for low-latency access from anywhere in the world."
              />
              <FeatureCard
                icon={<Link2 size={24} />}
                title="Custom Aliases"
                description="Create memorable branded links with custom aliases that reflect your identity."
              />
              <FeatureCard
                icon={<Sparkles size={24} />}
                title="Smart Generation"
                description="AI-powered algorithm creates pronounceable, memorable short codes automatically."
              />
            </div>

            {/* Statistics Section */}
            <Card className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">200K+</div>
                  <p className="text-sm text-text-muted">URLs Shortened</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-secondary mb-2">99.9%</div>
                  <p className="text-sm text-text-muted">Uptime SLA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-accent mb-2">50ms</div>
                  <p className="text-sm text-text-muted">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">15+</div>
                  <p className="text-sm text-text-muted">Global Regions</p>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className="text-center py-16">
              <h2 className="font-display text-3xl font-bold mb-4 text-text-primary">
                Ready to get started?
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Join thousands of users who trust QorkMe for their URL shortening needs.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="#top" className="inline-block">
                  <button className="btn bg-primary text-text-inverse hover:bg-primary-hover px-8 py-3 rounded-[var(--radius-md)] font-medium shadow-medium hover:shadow-large transition-all duration-200">
                    Start Shortening
                  </button>
                </a>
                <Link href="/docs" className="inline-block">
                  <button className="btn bg-transparent border-2 border-border hover:border-primary hover:bg-surface text-text-primary px-8 py-3 rounded-[var(--radius-md)] font-medium transition-all duration-200">
                    View Documentation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-medium text-text-primary">QorkMe</span>
                <span className="text-text-muted">•</span>
                <span className="text-sm text-text-muted">Modern URL Shortener</span>
              </div>
              <p className="text-sm text-text-muted">
                Built with ZT Bros Typography • Designed in San Francisco
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
