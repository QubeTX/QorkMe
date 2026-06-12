import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the actual module, not the mock
vi.unmock('@/lib/pretext');

let subscribe: (cb: () => void) => () => void;

describe('resizeCoordinator', () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;
  let _rafSpy: ReturnType<typeof vi.spyOn>;
  let _cancelRafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Fresh module for each test
    vi.resetModules();
    const mod = await import('../resizeCoordinator');
    subscribe = mod.subscribe;

    addSpy = vi.spyOn(window, 'addEventListener');
    removeSpy = vi.spyOn(window, 'removeEventListener');
    _rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    _cancelRafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches resize listener on first subscriber', () => {
    const unsub = subscribe(() => {});
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    unsub();
  });

  it('does not add multiple listeners for multiple subscribers', () => {
    const unsub1 = subscribe(() => {});
    const unsub2 = subscribe(() => {});
    const resizeCalls = addSpy.mock.calls.filter(
      ([event]: [string, ...unknown[]]) => event === 'resize'
    );
    expect(resizeCalls).toHaveLength(1);
    unsub1();
    unsub2();
  });

  it('removes listener when last subscriber unsubscribes', () => {
    const unsub1 = subscribe(() => {});
    const unsub2 = subscribe(() => {});
    unsub1();
    expect(removeSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));
    unsub2();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('calls all subscribers on resize', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const unsub1 = subscribe(cb1);
    const unsub2 = subscribe(cb2);

    // Simulate resize
    const handler = addSpy.mock.calls.find(
      ([event]: [string, ...unknown[]]) => event === 'resize'
    )?.[1] as EventListener;
    handler(new Event('resize'));

    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
    unsub1();
    unsub2();
  });
});
