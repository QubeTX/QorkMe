/**
 * URL Shortening API Endpoint
 *
 * POST /api/shorten            — JSON body { url, customAlias?, source? }
 * GET  /api/shorten?url=…      — convenience shorten for curl/agents (same envelope)
 * GET  /api/shorten?alias=…    — custom-alias availability check
 *
 * The whole shorten path is one database round trip: the get_or_create_short_url
 * RPC performs duplicate detection (an already-shortened URL returns its existing
 * code instead of a new row), reserved-word filtering, availability selection
 * across the candidate batch, and the insert atomically — concurrent-insert
 * races advance to the next candidate inside the function.
 *
 * Every created link records a `source` (web | cli | api) so the admin analytics
 * console can tell website shortens apart from CLI/API usage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ShortCodeGenerator } from '@/lib/shortcode/generator';
import { validateUrl, validateShortCode } from '@/lib/shortcode/validator';

interface ShortUrlRow {
  id: string;
  short_code: string;
  long_url: string;
  created_at: string;
  is_new: boolean;
}

type Source = 'web' | 'cli' | 'api';

/**
 * Resolve where a shorten request came from, for analytics attribution.
 * An explicit `source` (body field or query param) wins; otherwise a qork CLI
 * `User-Agent` ⇒ `cli`; otherwise `api` (curl / agents / third-party). The
 * website's own client sends `source: 'web'`.
 */
function resolveSource(request: NextRequest, explicit?: unknown): Source {
  const s = typeof explicit === 'string' ? explicit.toLowerCase() : '';
  if (s === 'web' || s === 'cli' || s === 'api') return s;
  const ua = request.headers?.get('user-agent') ?? '';
  if (/^qork\//i.test(ua)) return 'cli';
  return 'api';
}

type ShortenOutcome =
  | { ok: true; status: number; body: Record<string, unknown> }
  | { ok: false; status: number; error: string };

/**
 * The whole shorten path, shared by POST and the GET `?url=` convenience mode:
 * validate (URL + optional custom alias) BEFORE touching the database, then
 * create the client, resolve the user, run the get_or_create_short_url RPC (with
 * one retry on a crowded namespace), and shape the response envelope. Reuses
 * validateUrl / validateShortCode / ShortCodeGenerator — no logic forks between
 * the two entry points.
 */
async function createShortLink(
  rawUrl: unknown,
  customAlias: unknown,
  source: Source
): Promise<ShortenOutcome> {
  const urlValidation = validateUrl(typeof rawUrl === 'string' ? rawUrl : '');
  if (!urlValidation.valid) {
    return { ok: false, status: 400, error: urlValidation.error || 'Invalid URL provided' };
  }
  const normalizedUrl = urlValidation.normalizedUrl!;

  const aliasStr = typeof customAlias === 'string' ? customAlias.trim() : '';
  const isCustom = aliasStr.length > 0;
  let candidates: string[];

  if (isCustom) {
    const aliasValidation = validateShortCode(aliasStr);
    if (!aliasValidation.valid) {
      return { ok: false, status: 400, error: aliasValidation.error || 'Invalid alias' };
    }
    candidates = [aliasStr.toLowerCase()];
  } else {
    candidates = ShortCodeGenerator.generateCandidates();
  }

  const supabase = await createServerClientInstance();
  // Current user (if authenticated) — cookie read, no DB round trip.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const rpcArgs = (cands: string[], custom: boolean) => ({
    p_long_url: normalizedUrl,
    p_candidates: cands,
    p_custom_alias: custom,
    p_user_id: userId,
    p_source: source,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb.rpc('get_or_create_short_url', rpcArgs(candidates, isCustom));
  let row: ShortUrlRow | undefined = data?.[0];

  // Auto-generated batch fully taken (crowded namespace) — retry once with a
  // longer batch before giving up.
  if (!error && !row && !isCustom) {
    const retryCandidates = ShortCodeGenerator.generateCandidates(12, 5);
    const retry = await sb.rpc('get_or_create_short_url', rpcArgs(retryCandidates, false));
    row = retry.data?.[0];
    if (retry.error) console.error('Shorten retry error:', retry.error);
  }

  if (error) {
    console.error('Shorten RPC error:', error);
    return { ok: false, status: 500, error: 'Failed to create short URL' };
  }
  if (!row) {
    if (isCustom) return { ok: false, status: 409, error: 'This custom alias is already taken' };
    return { ok: false, status: 500, error: 'Failed to create short URL' };
  }

  const shortDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me';
  const shortUrl = `${shortDomain}/${row.short_code}`;
  const href = `https://${shortUrl}`;

  if (!row.is_new) {
    // URL was already shortened — return the existing link, no new row.
    return {
      ok: true,
      status: 200,
      body: { shortCode: row.short_code, shortUrl, href, isNew: false },
    };
  }

  const domain = new URL(normalizedUrl).hostname;
  return {
    ok: true,
    status: 200,
    body: {
      id: row.id,
      shortCode: row.short_code,
      shortUrl,
      href,
      longUrl: row.long_url,
      isNew: true,
      domain,
      createdAt: row.created_at,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customAlias, source } = body ?? {};
    const outcome = await createShortLink(url, customAlias, resolveSource(request, source));
    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    }
    return NextResponse.json(outcome.body, { status: outcome.status });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const alias = searchParams.get('alias');

    // Convenience shorten mode for curl / agents: ?url=<encoded>[&alias=].
    // Returns the same envelope as POST. (source defaults to `api` here.)
    if (url) {
      const outcome = await createShortLink(
        url,
        alias,
        resolveSource(request, searchParams.get('source'))
      );
      if (!outcome.ok) {
        return NextResponse.json({ error: outcome.error }, { status: outcome.status });
      }
      return NextResponse.json(outcome.body, { status: outcome.status });
    }

    // Otherwise: custom-alias availability check.
    if (!alias) {
      return NextResponse.json(
        { error: 'Provide ?url= to shorten a link, or ?alias= to check availability' },
        { status: 400 }
      );
    }

    const validation = validateShortCode(alias);
    if (!validation.valid) {
      return NextResponse.json({ available: false, error: validation.error });
    }

    const supabase = await createServerClientInstance();
    const { data } = await supabase
      .from('urls')
      .select('id')
      .eq('short_code_lower', alias.toLowerCase())
      .single();

    return NextResponse.json({ available: !data, alias: alias.toLowerCase() });
  } catch (error) {
    console.error('Alias check error:', error);
    return NextResponse.json({ error: 'Failed to check alias availability' }, { status: 500 });
  }
}
