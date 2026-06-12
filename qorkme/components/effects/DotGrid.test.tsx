import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DotGrid, { firePulse, PULSE_EVENT } from './DotGrid';

describe('DotGrid', () => {
  it('renders an aria-hidden container with a canvas and survives jsdom (no 2d context)', () => {
    const { container } = render(<DotGrid className="field" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.className).toContain('field');
    expect(wrapper.querySelector('canvas')).toBeInTheDocument();
  });

  it('firePulse dispatches the qubetx:pulse CustomEvent', () => {
    let detail: unknown = null;
    const listener = (e: Event) => {
      detail = (e as CustomEvent).detail;
    };
    window.addEventListener(PULSE_EVENT, listener);
    firePulse({ x: 10, y: 20, strength: 2 });
    window.removeEventListener(PULSE_EVENT, listener);

    expect(detail).toEqual({ x: 10, y: 20, strength: 2 });
  });
});
