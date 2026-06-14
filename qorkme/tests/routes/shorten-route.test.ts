import type { NextRequest } from 'next/server';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createServerClientInstance: vi.fn(),
}));

vi.mock('@/lib/shortcode/generator', () => ({
  ShortCodeGenerator: {
    generateCandidates: vi.fn(),
  },
}));

import { POST, GET } from '@/app/api/shorten/route';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ShortCodeGenerator } from '@/lib/shortcode/generator';

type QueryResult = { data: unknown; error?: unknown };
type SupabaseClientInstance = Awaited<ReturnType<typeof createServerClientInstance>>;

type MockQueryBuilder = {
  selectArg?: string;
  eqCalls: Array<[string, unknown]>;
  select: Mock<(arg?: string) => MockQueryBuilder>;
  eq: Mock<(column: string, value: unknown) => MockQueryBuilder>;
  single: Mock<() => Promise<QueryResult>>;
};

function createQueryBuilder({ singleResult }: { singleResult?: QueryResult }): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    selectArg: undefined,
    eqCalls: [],
    select: undefined as unknown as Mock<(arg?: string) => MockQueryBuilder>,
    eq: undefined as unknown as Mock<(column: string, value: unknown) => MockQueryBuilder>,
    single: undefined as unknown as Mock<() => Promise<QueryResult>>,
  };

  builder.select = vi.fn((arg?: string) => {
    builder.selectArg = arg;
    return builder;
  });

  builder.eq = vi.fn((column: string, value: unknown) => {
    builder.eqCalls.push([column, value]);
    return builder;
  });

  builder.single = vi.fn(async () => {
    return singleResult ?? { data: null, error: undefined };
  });

  return builder;
}

function createSupabaseStub(
  options: {
    rpcResults?: QueryResult[];
    builders?: MockQueryBuilder[];
    userId?: string | null;
  } = {}
): { client: SupabaseClientInstance; rpc: Mock } {
  let builderIndex = 0;
  let rpcIndex = 0;
  const rpcResults = options.rpcResults ?? [{ data: [] }];

  const rpc = vi.fn(async () => {
    const result = rpcResults[rpcIndex] ?? rpcResults[rpcResults.length - 1];
    rpcIndex++;
    return result;
  });

  const client = {
    from: vi.fn(
      () =>
        options.builders?.[builderIndex++] ??
        options.builders?.[options.builders.length - 1] ??
        createQueryBuilder({})
    ),
    rpc,
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
      })),
    },
  } as unknown as SupabaseClientInstance;

  return { client, rpc };
}

const mockedCreateServerClientInstance = vi.mocked(createServerClientInstance);
const generateCandidatesMock = vi.mocked(ShortCodeGenerator.generateCandidates);

// A POST request stub. `headers` lets a test simulate a CLI User-Agent.
function postRequest(body: unknown, headers?: HeadersInit): NextRequest {
  return {
    json: async () => body,
    headers: new Headers(headers ?? {}),
  } as unknown as NextRequest;
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.NEXT_PUBLIC_SHORT_DOMAIN = 'links.qork.me';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.test';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
});

describe('POST /api/shorten', () => {
  it('returns a 400 response when the URL uses an unsupported protocol', async () => {
    const { client } = createSupabaseStub();
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(postRequest({ url: 'http://localhost/internal' }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Cannot shorten local URLs/);
    // Validation happens before any DB client is created.
    expect(mockedCreateServerClientInstance).not.toHaveBeenCalled();
  });

  it('reuses an existing short code when the URL was already shortened', async () => {
    generateCandidatesMock.mockReturnValue(['ka9m', 'pu3n']);
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        {
          data: [
            {
              id: 'existing-id',
              short_code: 'rsvp',
              long_url: 'https://scalable.example',
              created_at: '2025-09-22T00:00:00.000Z',
              is_new: false,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(postRequest({ url: 'https://scalable.example' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      shortCode: 'rsvp',
      shortUrl: 'links.qork.me/rsvp',
      href: 'https://links.qork.me/rsvp',
      isNew: false,
    });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('get_or_create_short_url', {
      p_long_url: 'https://scalable.example',
      p_candidates: ['ka9m', 'pu3n'],
      p_custom_alias: false,
      p_user_id: null,
      p_source: 'api',
    });
  });

  it('creates a brand new short code and stores the URL when none exists', async () => {
    generateCandidatesMock.mockReturnValue(['fresh']);
    const { client, rpc } = createSupabaseStub({
      userId: 'user-42',
      rpcResults: [
        {
          data: [
            {
              id: 'url-id-123',
              short_code: 'fresh',
              long_url: 'https://amazing.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(postRequest({ url: 'https://amazing.example' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'url-id-123',
      shortCode: 'fresh',
      shortUrl: 'links.qork.me/fresh',
      href: 'https://links.qork.me/fresh',
      longUrl: 'https://amazing.example',
      isNew: true,
      domain: 'amazing.example',
      createdAt: '2025-09-22T12:00:00.000Z',
    });
    expect(rpc).toHaveBeenCalledWith('get_or_create_short_url', {
      p_long_url: 'https://amazing.example',
      p_candidates: ['fresh'],
      p_custom_alias: false,
      p_user_id: 'user-42',
      p_source: 'api',
    });
  });

  it('retries with a longer candidate batch when the first batch is exhausted', async () => {
    generateCandidatesMock.mockReturnValueOnce(['ka9m']).mockReturnValueOnce(['longer']);
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        { data: [] },
        {
          data: [
            {
              id: 'url-id-456',
              short_code: 'longer',
              long_url: 'https://crowded.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(postRequest({ url: 'https://crowded.example' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.shortCode).toBe('longer');
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(generateCandidatesMock).toHaveBeenNthCalledWith(2, 12, 5);
  });

  it('returns 409 when a custom alias is already taken', async () => {
    const { client, rpc } = createSupabaseStub({
      rpcResults: [{ data: [] }],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(
      postRequest({ url: 'https://taken.example', customAlias: 'mylink' })
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toMatch(/already taken/);
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('get_or_create_short_url', {
      p_long_url: 'https://taken.example',
      p_candidates: ['mylink'],
      p_custom_alias: true,
      p_user_id: null,
      p_source: 'api',
    });
    expect(generateCandidatesMock).not.toHaveBeenCalled();
  });

  it('creates a short URL with a custom alias', async () => {
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        {
          data: [
            {
              id: 'url-id-789',
              short_code: 'mylink',
              long_url: 'https://custom.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(
      postRequest({ url: 'https://custom.example', customAlias: 'MyLink' })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      shortCode: 'mylink',
      href: 'https://links.qork.me/mylink',
      isNew: true,
    });
    expect(rpc).toHaveBeenCalledWith('get_or_create_short_url', {
      p_long_url: 'https://custom.example',
      p_candidates: ['mylink'],
      p_custom_alias: true,
      p_user_id: null,
      p_source: 'api',
    });
  });

  it('returns 500 when the RPC reports an error', async () => {
    generateCandidatesMock.mockReturnValue(['ka9m']);
    const { client } = createSupabaseStub({
      rpcResults: [{ data: null, error: { message: 'boom' } }],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const response = await POST(postRequest({ url: 'https://broken.example' }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/Failed to create short URL/);
  });

  it('records source=web when the request body says so', async () => {
    generateCandidatesMock.mockReturnValue(['webx']);
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        {
          data: [
            {
              id: 'w1',
              short_code: 'webx',
              long_url: 'https://site.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    await POST(postRequest({ url: 'https://site.example', source: 'web' }));

    expect(rpc).toHaveBeenCalledWith(
      'get_or_create_short_url',
      expect.objectContaining({ p_source: 'web' })
    );
  });

  it('records source=cli for a qork User-Agent', async () => {
    generateCandidatesMock.mockReturnValue(['clix']);
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        {
          data: [
            {
              id: 'c1',
              short_code: 'clix',
              long_url: 'https://cli.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    await POST(postRequest({ url: 'https://cli.example' }, { 'user-agent': 'qork/1.0.0' }));

    expect(rpc).toHaveBeenCalledWith(
      'get_or_create_short_url',
      expect.objectContaining({ p_source: 'cli' })
    );
  });
});

describe('GET /api/shorten', () => {
  it('errors when neither url nor alias is provided', async () => {
    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten'),
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/Provide \?url=/);
  });

  it('shortens via the GET ?url= convenience mode (source=api)', async () => {
    generateCandidatesMock.mockReturnValue(['ka9m']);
    const { client, rpc } = createSupabaseStub({
      rpcResults: [
        {
          data: [
            {
              id: 'g1',
              short_code: 'ka9m',
              long_url: 'https://agent.example',
              created_at: '2025-09-22T12:00:00.000Z',
              is_new: true,
            },
          ],
        },
      ],
    });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten?url=https%3A%2F%2Fagent.example'),
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      shortCode: 'ka9m',
      shortUrl: 'links.qork.me/ka9m',
      href: 'https://links.qork.me/ka9m',
      isNew: true,
    });
    expect(rpc).toHaveBeenCalledWith('get_or_create_short_url', {
      p_long_url: 'https://agent.example',
      p_candidates: ['ka9m'],
      p_custom_alias: false,
      p_user_id: null,
      p_source: 'api',
    });
  });

  it('indicates when an alias is unavailable', async () => {
    const availabilityBuilder = createQueryBuilder({
      singleResult: { data: { id: 'existing-id' } },
    });
    const { client } = createSupabaseStub({ builders: [availabilityBuilder] });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten?alias=reserved'),
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ available: false, alias: 'reserved' });
  });

  it('confirms when an alias is available', async () => {
    const availabilityBuilder = createQueryBuilder({
      singleResult: { data: null },
    });
    const { client } = createSupabaseStub({ builders: [availabilityBuilder] });
    mockedCreateServerClientInstance.mockResolvedValueOnce(client);

    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten?alias=open'),
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ available: true, alias: 'open' });
  });
});
