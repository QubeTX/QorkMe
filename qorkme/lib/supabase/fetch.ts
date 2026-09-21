/** Bound backend waits so a stalled database/auth request cannot pin a worker. */
export const fetchWithTimeout: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    signal: AbortSignal.any([...(init?.signal ? [init.signal] : []), AbortSignal.timeout(8000)]),
  });
