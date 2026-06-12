import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';
import { MockIntersectionObserver } from '@/test/setup';

describe('useActiveSection', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="services"></section>
      <section id="work"></section>
      <section id="contact"></section>
    `;
  });

  it('starts with no active section', () => {
    const { result } = renderHook(() => useActiveSection(['services', 'work', 'contact']));
    expect(result.current).toBeNull();
  });

  it('reports the section crossing the focal band', () => {
    const { result } = renderHook(() => useActiveSection(['services', 'work', 'contact']));
    const io = MockIntersectionObserver.instances.at(-1)!;
    const work = document.getElementById('work')!;

    act(() => {
      io.emit([{ target: work, isIntersecting: true }]);
    });
    expect(result.current).toBe('work');

    act(() => {
      io.emit([{ target: work, isIntersecting: false }]);
    });
    expect(result.current).toBeNull();
  });

  it('prefers the earliest section in document order when several intersect', () => {
    const { result } = renderHook(() => useActiveSection(['services', 'work', 'contact']));
    const io = MockIntersectionObserver.instances.at(-1)!;

    act(() => {
      io.emit([
        { target: document.getElementById('contact')!, isIntersecting: true },
        { target: document.getElementById('services')!, isIntersecting: true },
      ]);
    });
    expect(result.current).toBe('services');
  });
});
