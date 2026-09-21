import { describe, expect, it, vi } from 'vitest';
import { ownAsync } from '@/components/brand/effects/lifecycle';

describe('async renderer ownership', () => {
  it('disposes a renderer whose initialization finishes after unmount', async () => {
    let resolve!: (value: { dispose: () => void }) => void;
    const promise = new Promise<{ dispose: () => void }>((done) => {
      resolve = done;
    });
    const ready = vi.fn();
    const resource = { dispose: vi.fn() };
    const unmount = ownAsync(promise, ready, vi.fn());
    unmount();
    resolve(resource);
    await promise;
    await Promise.resolve();
    expect(resource.dispose).toHaveBeenCalledOnce();
    expect(ready).not.toHaveBeenCalled();
  });
  it('disposes an active renderer only once across repeated cleanup', async () => {
    const resource = { dispose: vi.fn() };
    const promise = Promise.resolve(resource);
    const unmount = ownAsync(promise, vi.fn(), vi.fn());
    await promise;
    unmount();
    unmount();
    expect(resource.dispose).toHaveBeenCalledOnce();
  });
  it('suppresses late initialization errors from an old look', async () => {
    let reject!: (cause: Error) => void;
    const promise = new Promise<{ dispose: () => void }>((_, fail) => {
      reject = fail;
    });
    const failed = vi.fn();
    const unmount = ownAsync(promise, vi.fn(), failed);
    unmount();
    reject(new Error('old device'));
    await Promise.resolve();
    expect(failed).not.toHaveBeenCalled();
  });
});
