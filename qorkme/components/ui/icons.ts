import {
  Code2,
  Wrench,
  Network,
  Cloud,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  type LucideIcon,
} from 'lucide-react';
// QorkMe divergence from the upstream kit: IconKey lives here instead of
// @/data/content (QorkMe has no site-content module)
export type IconKey = 'code' | 'wrench' | 'network' | 'cloud' | 'shield';

/**
 * String-keyed icon registry so content.ts stays serializable.
 * Render at 20px with strokeWidth 1.5 and aria-hidden — the stroke style
 * matches the outlined QubeTXLogo cube.
 */
export const SERVICE_ICONS: Record<IconKey, LucideIcon> = {
  code: Code2,
  wrench: Wrench,
  network: Network,
  cloud: Cloud,
  shield: ShieldCheck,
};

export { ChevronDown, Menu, X, ArrowRight, ArrowUpRight, Download, Copy, Check };
export type { LucideIcon };
