import { SiteHeader } from '@/components/SiteHeader';

const navItems = [
  { label: 'Create', href: '#shorten' },
  { label: 'Highlights', href: '#features' },
  { label: 'Metrics', href: '#insights' },
  { label: 'Support', href: '#cta' },
];

export function NavigationHeader() {
  return <SiteHeader navItems={navItems} />;
}
