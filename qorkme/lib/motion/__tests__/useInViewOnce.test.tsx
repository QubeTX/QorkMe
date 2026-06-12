import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInViewOnce } from '../useInViewOnce';
import { MockIntersectionObserver } from '@/test/setup';

function Probe() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div ref={ref} data-testid="probe">
      {String(inView)}
    </div>
  );
}

describe('useInViewOnce', () => {
  it('starts out of view and flips once the observer fires', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('false');

    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    expect(screen.getByTestId('probe').textContent).toBe('true');
  });

  it('stays in view after disconnecting (fires once)', () => {
    render(<Probe />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(false));
    });
    expect(screen.getByTestId('probe').textContent).toBe('true');
  });
});
