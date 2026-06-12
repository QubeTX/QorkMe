import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextLink from './TextLink';

describe('TextLink', () => {
  it('renders an anchor with the given label and href', () => {
    render(<TextLink href="#services">Explore Our Services</TextLink>);
    const link = screen.getByRole('link', { name: /explore our services/i });
    expect(link).toHaveAttribute('href', '#services');
  });

  it('renders the glyph as decorative', () => {
    render(
      <TextLink href="#services" glyph="⠿">
        Explore
      </TextLink>
    );
    const glyph = screen.getByText('⠿');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });

  it('adds new-tab attributes for external links', () => {
    render(<TextLink href="https://example.com">Out</TextLink>);
    const link = screen.getByRole('link', { name: /out/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  describe('slot-roll click flash', () => {
    afterEach(() => vi.useRealTimers());

    it('flashes the label on click and auto-reverts', () => {
      vi.useFakeTimers();
      render(
        <TextLink href="#services" flashLabel="Navigating…">
          Explore Our Services
        </TextLink>
      );
      const link = screen.getByRole('link', { name: /explore our services/i });
      fireEvent.click(link);
      expect(screen.getByRole('link', { name: /navigating/i })).toBe(link);
      vi.runAllTimers();
      expect(screen.getByRole('link', { name: /explore our services/i })).toBe(link);
    });

    it('keeps a plain label without flashLabel', () => {
      render(<TextLink href="#services">Explore</TextLink>);
      const link = screen.getByRole('link', { name: /explore/i });
      fireEvent.click(link);
      // The non-rollable path never builds roll cells — label is a plain string
      expect(link.querySelector('[data-slot-cell]')).toBeNull();
    });
  });
});
