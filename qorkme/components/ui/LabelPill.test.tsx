import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LabelPill from './LabelPill';

describe('LabelPill', () => {
  it('renders its children', () => {
    render(<LabelPill>01 // Services</LabelPill>);
    expect(screen.getByText('01 // Services')).toBeInTheDocument();
  });

  it('defaults to the pill variant', () => {
    render(<LabelPill>Label</LabelPill>);
    expect(screen.getByText('Label').className).toMatch(/pill/);
  });

  it('supports the bar variant (hero eyebrow)', () => {
    render(<LabelPill variant="bar">Eyebrow</LabelPill>);
    expect(screen.getByText('Eyebrow').className).toMatch(/bar/);
  });
});
