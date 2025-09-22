import type { NextRequest } from 'next/server';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createServerClientInstance: vi.fn(),
}));

vi.mock('@/lib/shortcode/generator', () => ({
  ShortCodeGenerator: {
    generateUniqueCode: vi.fn(),
  },
}));

vi.mock('@/lib/shortcode/reserved', () => ({
  isReservedWord: vi.fn().mockReturnValue(false),
}));

import { POST, GET } from '@/app/api/shorten/route';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ShortCodeGenerator } from '@/lib/shortcode/generator';

type QueryResult = { data: unknown; error?: unknown };
type SupabaseClientInstance = Awaited<ReturnType<typeof createServerClientInstance>>;

type MockQueryBuilder = {
  selectArg?: string;
  insertPayload?: unknown;
  eqCalls: Array<[string, unknown]>;
  select: Mock<[string?], MockQueryBuilder>;
  insert: Mock<[unknown], MockQueryBuilder>;
  eq: Mock<[string, unknown], MockQueryBuilder>;
  single: Mock<[], Promise<QueryResult>>;
};

function createQueryBuilder({
  singleResult,
  insertResult,
}: {
  singleResult?: QueryResult;
  insertResult?: QueryResult;
}): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    selectArg: undefined,
    insertPayload: undefined,
    eqCalls: [],
    select: undefined as unknown as Mock<[string?], MockQueryBuilder>,
    insert: undefined as unknown as Mock<[unknown], MockQueryBuilder>,
    eq: undefined as unknown as Mock<[string, unknown], MockQueryBuilder>,
    single: undefined as unknown as Mock<[], Promise<QueryResult>>,
  };

  builder.select = vi.fn((arg?: string) => {
    builder.selectArg = arg;
    return builder;
  }) as Mock<[string?], MockQueryBuilder>;

  builder.insert = vi.fn((payload: unknown) => {
    builder.insertPayload = payload;
    return builder;
  }) as Mock<[unknown], MockQueryBuilder>;

  builder.eq = vi.fn((column: string, value: unknown) => {
    builder.eqCalls.push([column, value]);
    return builder;
  }) as Mock<[string, unknown], MockQueryBuilder>;

  builder.single = vi.fn(async () => {
    if (builder.insertPayload !== undefined) {
      return (
        insertResult ?? {
          data: {
            ...(builder.insertPayload as Record<string, unknown>),
            id: 'generated-id',
            created_at: '2025-09-22T00:00:00.000Z',
          },
          error: undefined,
        }
      );
    }

    return singleResult ?? { data: null, error: undefined };
  }) as Mock<[], Promise<QueryResult>>;

  return builder;
}

function createSupabaseStub(
  builders: Array<ReturnType<typeof createQueryBuilder>>,
  options: {
    userId?: string | null;
  } = {}
): SupabaseClientInstance {
  let callIndex = 0;

  return {
    from: vi.fn(() => builders[callIndex++] ?? builders[builders.length - 1]),
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
      })),
    },
  } as unknown as SupabaseClientInstance;
}

const mockedCreateServerClientInstance = vi.mocked(createServerClientInstance);
const generateUniqueCodeMock = vi.mocked(ShortCodeGenerator.generateUniqueCode);

beforeEach(() => {
  vi.resetAllMocks();
  process.env.NEXT_PUBLIC_SHORT_DOMAIN = 'links.qork.me';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.test';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
});

describe('POST /api/shorten', () => {
  it('returns a 400 response when the URL uses an unsupported protocol', async () => {
    const supabase = createSupabaseStub([createQueryBuilder({ singleResult: { data: null } })]);
    mockedCreateServerClientInstance.mockResolvedValueOnce(supabase);

    const request = {
      json: async () => ({ url: 'http://localhost/internal' }),
    } as unknown as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Cannot shorten local URLs/);
    expect(mockedCreateServerClientInstance).not.toHaveBeenCalled();
  });

  it('reuses an existing short code when the URL was already shortened', async () => {
    const duplicateBuilder = createQueryBuilder({
      singleResult: { data: { short_code: 'rsvp' } },
    });

    const supabase = createSupabaseStub([duplicateBuilder]);
    mockedCreateServerClientInstance.mockResolvedValueOnce(supabase);

    const request = {
      json: async () => ({ url: 'https://scalable.example' }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      shortCode: 'rsvp',
      shortUrl: 'links.qork.me/rsvp',
      isNew: false,
    });
    expect(generateUniqueCodeMock).not.toHaveBeenCalled();
    expect(duplicateBuilder.select).toHaveBeenCalledWith('short_code');
    expect(duplicateBuilder.eq).toHaveBeenCalledWith('long_url', 'https://scalable.example');
  });

  it('creates a brand new short code and stores the URL when none exists', async () => {
    const duplicateCheckBuilder = createQueryBuilder({
      singleResult: { data: null },
    });
    const availabilityBuilder = createQueryBuilder({
      singleResult: { data: null },
    });
    const insertBuilder = createQueryBuilder({
      insertResult: {
        data: {
          id: 'url-id-123',
          short_code: 'fresh',
          long_url: 'https://amazing.example',
          custom_alias: false,
          created_at: '2025-09-22T12:00:00.000Z',
        },
      },
    });

    const supabase = createSupabaseStub(
      [duplicateCheckBuilder, availabilityBuilder, insertBuilder],
      {
        userId: 'user-42',
      }
    );

    mockedCreateServerClientInstance.mockResolvedValueOnce(supabase);

    generateUniqueCodeMock.mockImplementation(
      async (checkAvailability: (code: string) => Promise<boolean>) => {
        const available = await checkAvailability('fresh');
        expect(available).toBe(true);
        return 'fresh';
      }
    );

    const request = {
      json: async () => ({ url: 'https://amazing.example' }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'url-id-123',
      shortCode: 'fresh',
      shortUrl: 'links.qork.me/fresh',
      longUrl: 'https://amazing.example',
      isNew: true,
      domain: 'amazing.example',
    });

    expect(insertBuilder.insert).toHaveBeenCalledWith({
      short_code: 'fresh',
      long_url: 'https://amazing.example',
      custom_alias: false,
      user_id: 'user-42',
    });
  });
});

describe('GET /api/shorten', () => {
  it('requires an alias query parameter', async () => {
    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten'),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/Alias parameter is required/);
  });

  it('indicates when an alias is unavailable', async () => {
    const availabilityBuilder = createQueryBuilder({
      singleResult: { data: { id: 'existing-id' } },
    });
    const supabase = createSupabaseStub([availabilityBuilder]);
    mockedCreateServerClientInstance.mockResolvedValueOnce(supabase);

    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten?alias=reserved'),
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
    const supabase = createSupabaseStub([availabilityBuilder]);
    mockedCreateServerClientInstance.mockResolvedValueOnce(supabase);

    const request = {
      nextUrl: new URL('https://links.qork.me/api/shorten?alias=open'),
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ available: true, alias: 'open' });
  });
});
