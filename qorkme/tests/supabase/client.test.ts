import { describe, expect, it, beforeEach, vi } from 'vitest';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
  createBrowserClient: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

import { createServerClient, createBrowserClient } from '@supabase/ssr';
import { createClient as createAdminClientFn } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClientInstance, createAdminClient } from '@/lib/supabase/server';
import { createClient as createBrowserClientFactory } from '@/lib/supabase/client';

const mockedCreateServerClient = vi.mocked(createServerClient);
const mockedCreateBrowserClient = vi.mocked(createBrowserClient);
const mockedCreateAdminClient = vi.mocked(createAdminClientFn);
const mockedCookies = vi.mocked(cookies);

type CookieStore = Awaited<ReturnType<typeof cookies>>;

describe('supabase client factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    process.env.SUPABASE_SERVICE_KEY = 'service-key';
  });

  it('creates a server client with cookie passthrough helpers', async () => {
    const getAllCookiesMock = vi.fn();
    const setCookieMock = vi.fn();
    mockedCookies.mockResolvedValue({
      getAll: getAllCookiesMock,
      set: setCookieMock,
    } as unknown as CookieStore);
    const serverClientStub = {} as ReturnType<typeof createServerClient>;
    mockedCreateServerClient.mockReturnValue(serverClientStub);

    const client = await createServerClientInstance();

    expect(mockedCookies).toHaveBeenCalledTimes(1);
    expect(mockedCreateServerClient).toHaveBeenCalledWith(
      'https://supabase.example',
      'anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );

    const [, , options] = mockedCreateServerClient.mock.calls[0];
    const cookieHandlers = options.cookies as {
      getAll: () => unknown;
      setAll: (
        cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>
      ) => void;
    };
    cookieHandlers.getAll();
    expect(getAllCookiesMock).toHaveBeenCalled();

    cookieHandlers.setAll([{ name: 'sb', value: 'token', options: { path: '/' } }]);
    expect(setCookieMock).toHaveBeenCalledWith('sb', 'token', { path: '/' });

    expect(client).toBe(
      serverClientStub as unknown as Awaited<ReturnType<typeof createServerClientInstance>>
    );
  });

  it('creates an admin client with the service role key', async () => {
    const adminClientStub = {} as ReturnType<typeof createAdminClientFn>;
    mockedCreateAdminClient.mockReturnValue(adminClientStub);

    const client = await createAdminClient();

    expect(mockedCreateAdminClient).toHaveBeenCalledWith(
      'https://supabase.example',
      'service-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          autoRefreshToken: false,
          persistSession: false,
        }),
      })
    );

    expect(client).toBe(
      adminClientStub as unknown as Awaited<ReturnType<typeof createAdminClient>>
    );
  });

  it('creates a browser client with public credentials', () => {
    const browserClientStub = {} as ReturnType<typeof createBrowserClient>;
    mockedCreateBrowserClient.mockReturnValue(browserClientStub);

    const client = createBrowserClientFactory();

    expect(mockedCreateBrowserClient).toHaveBeenCalledWith('https://supabase.example', 'anon-key');

    expect(client).toBe(
      browserClientStub as unknown as ReturnType<typeof createBrowserClientFactory>
    );
  });
});
