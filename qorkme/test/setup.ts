import '@testing-library/jest-dom/vitest';
// Explicit imports (QorkMe runs tsc over test files without vitest/globals types)
import { vi, beforeEach } from 'vitest';

// Auto-mock @/lib/pretext for all component tests (uses Canvas which jsdom doesn't support)
vi.mock('@/lib/pretext', async () => {
  const mocks = await import('@/test/mocks/pretext');
  return mocks;
});

// Auto-mock the raw pretext package too (canvas measureText doesn't exist in
// jsdom) — consumers degrade to their unrouted/unmeasured fallbacks
vi.mock('@chenglou/pretext', () => ({
  prepare: vi.fn(() => ({})),
  layout: vi.fn(() => ({ height: 0, lineCount: 0 })),
  prepareWithSegments: vi.fn(() => ({ segments: [] })),
  layoutWithLines: vi.fn(() => ({ height: 0, lineCount: 0, lines: [] })),
  layoutNextLine: vi.fn(() => null),
  walkLineRanges: vi.fn(() => 0),
}));

// Auto-mock framer-motion (promoted from per-file mocks; those remain harmless duplicates)
vi.mock('framer-motion', async () => {
  const mocks = await import('@/test/mocks/framer-motion');
  return mocks;
});

// Auto-mock anime.js — no rAF engine in jsdom; components must render
// correct final-state DOM with animations stubbed out
vi.mock('animejs', async () => {
  const mocks = await import('@/test/mocks/animejs');
  return mocks;
});

// Auto-mock lenis/react — jsdom has no smooth-scroll engine; useLenis
// consumers must handle undefined (native fallback path)
vi.mock('lenis/react', () => ({
  ReactLenis: ({ children }: { children?: unknown }) => children,
  useLenis: () => undefined,
}));

/**
 * IntersectionObserver stub (jsdom lacks it). Tests can reach registered
 * instances via MockIntersectionObserver.instances and call .trigger()
 * (all elements) or .emit() (specific entries).
 */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  elements = new Set<Element>();
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = (el: Element) => {
    this.elements.add(el);
  };
  unobserve = (el: Element) => {
    this.elements.delete(el);
  };
  disconnect = () => {
    this.elements.clear();
  };
  takeRecords = (): IntersectionObserverEntry[] => [];

  trigger(isIntersecting = true) {
    const entries = [...this.elements].map(
      (el) => ({ isIntersecting, target: el }) as IntersectionObserverEntry
    );
    this.callback(entries, this);
  }

  emit(entries: Array<{ target: Element; isIntersecting: boolean }>) {
    this.callback(entries as IntersectionObserverEntry[], this);
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

beforeEach(() => {
  MockIntersectionObserver.instances = [];
});

// matchMedia stub (jsdom lacks it) — defaults to non-matching
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }))
  );
}
