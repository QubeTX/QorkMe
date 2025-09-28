import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';

const navItems = [
  { label: 'Create', href: '#shorten' },
  { label: 'Highlights', href: '#features' },
  { label: 'Metrics', href: '#insights' },
  { label: 'Support', href: '#cta' },
];

export function NavigationHeader() {
  return (
    <SiteHeader
      navItems={navItems}
      status={{
        label: 'Beta invites open',
        icon: <Sparkles size={16} aria-hidden />,
      }}
      action={{
        label: 'Start shortening',
        href: '#shorten',
        icon: <ArrowUpRight size={18} aria-hidden />,
      }}
      brandTagline="Friendly link studio"
    />
  );
}
