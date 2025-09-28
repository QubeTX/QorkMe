import { ArrowLeft, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';

const navItems = [
  { label: 'Create', href: '/#shorten' },
  { label: 'Highlights', href: '/#features' },
  { label: 'Metrics', href: '/#insights' },
  { label: 'Support', href: '/#cta' },
];

export function ResultNavigationHeader() {
  return (
    <SiteHeader
      navItems={navItems}
      status={{
        label: 'Link ready to share',
        icon: <Sparkles size={16} aria-hidden />,
      }}
      action={{
        label: 'Start another link',
        href: '/',
        icon: <ArrowLeft size={18} aria-hidden />,
        variant: 'outline',
      }}
      brandTagline="Share-ready link"
    />
  );
}
