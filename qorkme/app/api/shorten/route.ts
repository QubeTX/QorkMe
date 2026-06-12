/**
 * URL Shortening API Endpoint
 * POST /api/shorten
 *
 * The whole shorten path is one database round trip: the
 * get_or_create_short_url RPC performs duplicate detection (an already
 * shortened URL returns its existing code instead of a new row), reserved
 * word filtering, availability selection across the candidate batch, and the
 * insert atomically — concurrent-insert races advance to the next candidate
 * inside the function.
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customAlias } = body;

    // Validate URL
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    const normalizedUrl = urlValidation.normalizedUrl!;
    const supabase = await createServerClientInstance();

    // Get current user (if authenticated) — cookie read, no DB round trip
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isCustom = Boolean(customAlias && customAlias.trim());
    let candidates: string[];

    if (isCustom) {
      const aliasValidation = validateShortCode(customAlias);
      if (!aliasValidation.valid) {
        return NextResponse.json({ error: aliasValidation.error }, { status: 400 });
      }
      candidates = [customAlias.toLowerCase()];
    } else {
      candidates = ShortCodeGenerator.generateCandidates();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('get_or_create_short_url', {
      p_long_url: normalizedUrl,
      p_candidates: candidates,
      p_custom_alias: isCustom,
      p_user_id: user?.id || null,
    });

    let row: ShortUrlRow | undefined = data?.[0];

    // Auto-generated batch fully taken (crowded namespace) — retry once with
    // a longer batch before giving up
    if (!error && !row && !isCustom) {
      const retryCandidates = ShortCodeGenerator.generateCandidates(12, 5);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const retry = await (supabase as any).rpc('get_or_create_short_url', {
        p_long_url: normalizedUrl,
        p_candidates: retryCandidates,
        p_custom_alias: false,
        p_user_id: user?.id || null,
      });
      row = retry.data?.[0];
      if (retry.error) {
        console.error('Shorten retry error:', retry.error);
      }
    }

    if (error) {
      console.error('Shorten RPC error:', error);
      return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
    }

    if (!row) {
      if (isCustom) {
        return NextResponse.json({ error: 'This custom alias is already taken' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
    }

    const shortDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me';

    if (!row.is_new) {
      // URL was already shortened — return the existing link, no new row
      return NextResponse.json({
        shortCode: row.short_code,
        shortUrl: `${shortDomain}/${row.short_code}`,
        isNew: false,
      });
    }

    const domain = new URL(normalizedUrl).hostname;

    return NextResponse.json({
      id: row.id,
      shortCode: row.short_code,
      shortUrl: `${shortDomain}/${row.short_code}`,
      longUrl: row.long_url,
      isNew: true,
      domain,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// GET endpoint to check if a custom alias is available
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const alias = searchParams.get('alias');

    if (!alias) {
      return NextResponse.json({ error: 'Alias parameter is required' }, { status: 400 });
    }

    // Validate the alias
    const validation = validateShortCode(alias);
    if (!validation.valid) {
      return NextResponse.json({
        available: false,
        error: validation.error,
      });
    }

    const supabase = await createServerClientInstance();

    // Check if alias exists
    const { data } = await supabase
      .from('urls')
      .select('id')
      .eq('short_code_lower', alias.toLowerCase())
      .single();

    return NextResponse.json({
      available: !data,
      alias: alias.toLowerCase(),
    });
  } catch (error) {
    console.error('Alias check error:', error);
    return NextResponse.json({ error: 'Failed to check alias availability' }, { status: 500 });
  }
}
