import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// Unmock for this test file — we want to test the real provider
vi.unmock('@/lib/pretext');

// Mock @chenglou/pretext since canvas isn't available in jsdom
vi.mock('@chenglou/pretext', () => ({
  prepare: vi.fn(() => ({})),
  layout: vi.fn(() => ({ height: 0, lineCount: 0 })),
}));

import { PretextProvider, usePretextContext } from '../PretextProvider';

function Consumer() {
  const { isReady } = usePretextContext();
  return <div data-testid="ready">{String(isReady)}</div>;
}

describe('PretextProvider', () => {
  beforeEach(() => {
    // Mock document.fonts
    Object.defineProperty(document, 'fonts', {
      value: {
        ready: Promise.resolve(),
        check: vi.fn(() => true),
      },
      writable: true,
      configurable: true,
    });
  });

  it('starts with isReady false', () => {
    render(
      <PretextProvider>
        <Consumer />
      </PretextProvider>
    );
    expect(screen.getByTestId('ready').textContent).toBe('false');
  });

  it('sets isReady to true after fonts load', async () => {
    render(
      <PretextProvider>
        <Consumer />
      </PretextProvider>
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(screen.getByTestId('ready').textContent).toBe('true');
  });

  it('checks readiness against computed font names, not literals', async () => {
    // Simulate a next/font rewritten family name being resolved from the CSS vars
    const spy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ fontFamily: '"__makira_a1b2c3", sans-serif' } as CSSStyleDeclaration);

    render(
      <PretextProvider>
        <Consumer />
      </PretextProvider>
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const check = document.fonts.check as ReturnType<typeof vi.fn>;
    expect(check).toHaveBeenCalledWith('16px "__makira_a1b2c3"');
    expect(check).not.toHaveBeenCalledWith(expect.stringContaining('Unbounded'));
    expect(screen.getByTestId('ready').textContent).toBe('true');
    spy.mockRestore();
  });

  it('falls back to ready when no font families resolve (jsdom path)', async () => {
    // jsdom does not resolve CSS variables — resolveRequiredFonts yields no
    // families, which must mean "nothing to wait for", never a hang
    render(
      <PretextProvider>
        <Consumer />
      </PretextProvider>
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(screen.getByTestId('ready').textContent).toBe('true');
  });

  it('renders children without extra wrapper', () => {
    const { container } = render(
      <PretextProvider>
        <span data-testid="child">hello</span>
      </PretextProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(container.firstChild).toBe(screen.getByTestId('child'));
  });
});
