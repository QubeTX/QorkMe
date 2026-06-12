import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('framer-motion', async () => {
  const mocks = await import('@/test/mocks/framer-motion');
  return mocks;
});

import OutlineButton from './OutlineButton';

describe('OutlineButton', () => {
  it('renders an anchor with the given label', () => {
    render(<OutlineButton href="#contact">Get Started</OutlineButton>);
    const link = screen.getByRole('link', { name: /get started/i });
    expect(link).toHaveAttribute('href', '#contact');
  });

  it('adds new-tab attributes and an sr-only note for external links', () => {
    render(<OutlineButton href="https://example.com">Go</OutlineButton>);
    const link = screen.getByRole('link', { name: /go/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('(opens in a new tab)')).toBeInTheDocument();
  });

  it('does not add new-tab attributes for anchor links', () => {
    render(<OutlineButton href="#services">Explore</OutlineButton>);
    const link = screen.getByRole('link', { name: /explore/i });
    expect(link).not.toHaveAttribute('target');
  });

  it('marks itself for cursor interaction, and magnetic when requested', () => {
    render(
      <OutlineButton href="#contact" magnetic>
        CTA
      </OutlineButton>
    );
    const link = screen.getByRole('link', { name: /cta/i });
    expect(link).toHaveAttribute('data-interactive', 'true');
    expect(link).toHaveAttribute('data-magnetic', 'true');
  });
});

describe('OutlineButton slot-roll labels', () => {
  afterEach(() => vi.useRealTimers());

  it('hover-rolls to the teaser label and back (mouse only)', () => {
    vi.useFakeTimers();
    render(
      <OutlineButton href="https://example.com" hoverLabel="Open the form">
        Get Started
      </OutlineButton>
    );
    // onPointerEnter fires via pointerOver in jsdom/React 19
    const link = screen.getByRole('link', { name: /get started/i });
    fireEvent.pointerOver(link, { pointerType: 'mouse' });
    expect(screen.getByRole('link', { name: /open the form/i })).toBe(link);
    fireEvent.pointerOut(link, { pointerType: 'mouse' });
    expect(screen.getByRole('link', { name: /get started/i })).toBe(link);
    vi.runAllTimers();
    expect(screen.getByRole('link', { name: /get started/i })).toBe(link);
  });

  it('ignores hover from coarse pointers', () => {
    vi.useFakeTimers();
    render(
      <OutlineButton href="https://example.com" hoverLabel="Open the form">
        Get Started
      </OutlineButton>
    );
    const link = screen.getByRole('link', { name: /get started/i });
    fireEvent.pointerOver(link, { pointerType: 'touch' });
    expect(screen.getByRole('link', { name: /get started/i })).toBe(link);
    expect(screen.queryByRole('link', { name: /open the form/i })).toBeNull();
  });

  it('click-flashes the label for internal destinations and auto-reverts', () => {
    vi.useFakeTimers();
    render(
      <OutlineButton href="#contact" flashLabel="Navigating…">
        Go There
      </OutlineButton>
    );
    const link = screen.getByRole('link', { name: /go there/i });
    fireEvent.click(link);
    expect(screen.getByRole('link', { name: /navigating/i })).toBe(link);
    vi.runAllTimers(); // flash roll + revert + settle
    expect(screen.getByRole('link', { name: /go there/i })).toBe(link);
  });

  it('spammed flashes coalesce into a single revert', () => {
    vi.useFakeTimers();
    render(
      <OutlineButton href="#contact" flashLabel="Navigating…">
        Go There
      </OutlineButton>
    );
    const link = screen.getByRole('link', { name: /go there/i });
    fireEvent.click(link);
    vi.advanceTimersByTime(200);
    fireEvent.click(link);
    fireEvent.click(link);
    vi.runAllTimers();
    expect(screen.getByRole('link', { name: /go there/i })).toBe(link);
  });

  it('stays inert with no hover/flash label', () => {
    render(<OutlineButton href="#contact">Plain</OutlineButton>);
    const link = screen.getByRole('link', { name: /plain/i });
    fireEvent.pointerOver(link, { pointerType: 'mouse' });
    fireEvent.click(link);
    // The non-rollable path never builds roll cells — label is a plain string
    expect(link.querySelector('[data-slot-cell]')).toBeNull();
    expect(screen.getByRole('link', { name: /plain/i })).toBe(link);
  });
});
