import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionHeading from './SectionHeading';

describe('SectionHeading', () => {
  it('renders the pill label, title, and subtitle', () => {
    render(<SectionHeading label="01 // Services" title="What we build" subtitle="Sub" />);
    expect(screen.getByText('01 // Services')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What we build' })).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
  });

  it('renders aside content next to the pill', () => {
    render(
      <SectionHeading label="02 // X" title="T" aside={<span data-testid="aside">$ ls</span>} />
    );
    expect(screen.getByTestId('aside')).toBeInTheDocument();
  });
});
