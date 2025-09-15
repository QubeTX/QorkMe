/**
 * URL Shortening API Endpoint
 * POST /api/shorten
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase/server';
import { ShortCodeGenerator } from '@/lib/shortcode/generator';
import { validateUrl, validateShortCode } from '@/lib/shortcode/validator';
import { isReservedWord } from '@/lib/shortcode/reserved';

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

    let shortCode: string;
    let isCustom = false;

    // Handle custom alias if provided
    if (customAlias && customAlias.trim()) {
      const aliasValidation = validateShortCode(customAlias);
      if (!aliasValidation.valid) {
        return NextResponse.json({ error: aliasValidation.error }, { status: 400 });
      }

      shortCode = customAlias.toLowerCase();
      isCustom = true;

      // Check if custom alias is available
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code_lower', shortCode)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'This custom alias is already taken' }, { status: 409 });
      }
    } else {
      // Check if URL already exists (for non-custom aliases)
      // const urlHash = btoa(normalizedUrl).substring(0, 50); // Simple hash for duplicate detection

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('urls')
        .select('short_code')
        .eq('long_url', normalizedUrl)
        .eq('custom_alias', false)
        .eq('is_active', true)
        .single();

      if (existing) {
        // Return existing short code
        return NextResponse.json({
          shortCode: existing.short_code,
          shortUrl: `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${existing.short_code}`,
          isNew: false,
        });
      }

      // Generate new short code
      shortCode = await ShortCodeGenerator.generateUniqueCode(
        async (code) => {
          // Check if code is reserved
          if (isReservedWord(code)) {
            return false;
          }

          // Check database
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase as any)
            .from('urls')
            .select('id')
            .eq('short_code_lower', code.toLowerCase())
            .single();

          return !data;
        },
        true // Prefer memorable patterns
      );
    }

    // Get current user (if authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert new URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newUrl, error: insertError } = await (supabase as any)
      .from('urls')
      .insert({
        short_code: shortCode,
        long_url: normalizedUrl,
        custom_alias: isCustom,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
    }

    // Extract domain for metadata (can be enhanced later)
    const domain = new URL(normalizedUrl).hostname;

    return NextResponse.json({
      id: newUrl.id,
      shortCode: newUrl.short_code,
      shortUrl: `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${newUrl.short_code}`,
      longUrl: newUrl.long_url,
      isNew: true,
      domain,
      createdAt: newUrl.created_at,
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
