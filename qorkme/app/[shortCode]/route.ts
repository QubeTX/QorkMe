/**
 * Redirect Handler
 * Handles short URL redirects and analytics tracking
 */

import { NextRequest, NextResponse, after } from 'next/server';
import { notFound } from 'next/navigation';
import { createServerClientInstance, createAnonClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Cache for frequently accessed URLs (in production, use Redis)
const urlCache = new Map<string, { url: string; id: string; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await context.params;

    if (!shortCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check cache first
    // Click payload must be captured before the response — request-bound APIs
    // are unavailable inside after()
    const clickPayload = buildClickPayload(request);

    const cached = urlCache.get(shortCode.toLowerCase());
    if (cached && cached.expires > Date.now()) {
      // Track analytics after the response — after() keeps the function alive
      // until the insert lands (fire-and-forget loses clicks on Vercel)
      after(() => trackClick(cached.id, clickPayload));
      return NextResponse.redirect(new URL(cached.url));
    }

    const supabase = await createServerClientInstance();

    // Use the increment_click_count function for atomic operation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('increment_click_count', {
      p_short_code: shortCode,
    });

    if (error || !data || data.length === 0) {
      console.error('Redirect error:', error);
      // Render the 404 page (redirecting to /404 would loop back into this
      // dynamic route)
      notFound();
    }

    const urlData = data[0];

    // Cache the URL
    urlCache.set(shortCode.toLowerCase(), {
      url: urlData.long_url,
      id: urlData.id,
      expires: Date.now() + CACHE_TTL,
    });

    // Bound cache size to prevent unbounded memory growth
    const MAX_CACHE_SIZE = 1000;
    if (urlCache.size > MAX_CACHE_SIZE) {
      // Evict oldest entry (first key in Map insertion order)
      const oldestKey = urlCache.keys().next().value;
      if (oldestKey !== undefined) urlCache.delete(oldestKey);
    }

    // Track analytics after the response (see note above)
    after(() => trackClick(urlData.id, clickPayload));

    // Perform redirect
    return NextResponse.redirect(new URL(urlData.long_url));
  } catch (error) {
    // notFound() signals via a thrown control-flow error — let Next handle it
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      ((error as { digest: string }).digest === 'NEXT_NOT_FOUND' ||
        (error as { digest: string }).digest.startsWith('NEXT_HTTP_ERROR_FALLBACK'))
    ) {
      throw error;
    }
    console.error('Redirect handler error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

interface ClickPayload {
  ipHash: string;
  deviceType: string;
  browser: string;
  os: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

/**
 * Capture everything the analytics insert needs from the live request.
 * Must run before the response is returned — after() callbacks cannot touch
 * request-bound APIs.
 */
function buildClickPayload(request: NextRequest): ClickPayload {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

  const userAgent = request.headers.get('user-agent') || '';
  const deviceInfo = parseUserAgent(userAgent);

  const searchParams = request.nextUrl.searchParams;

  return {
    ipHash,
    ...deviceInfo,
    referrer: request.headers.get('referer') || null,
    utmSource: searchParams.get('utm_source'),
    utmMedium: searchParams.get('utm_medium'),
    utmCampaign: searchParams.get('utm_campaign'),
  };
}

/**
 * Track click analytics
 * Runs after the response via after() so it never blocks the redirect but
 * still completes before the serverless function is suspended
 */
async function trackClick(urlId: string, payload: ClickPayload) {
  try {
    // Cookie-free client — after() runs outside the request context, where
    // cookies()/headers() throw
    const supabase = await createAnonClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('clicks').insert({
      url_id: urlId,
      ip_hash: payload.ipHash,
      device_type: payload.deviceType,
      browser: payload.browser,
      os: payload.os,
      referrer: payload.referrer,
      utm_source: payload.utmSource,
      utm_medium: payload.utmMedium,
      utm_campaign: payload.utmCampaign,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't throw - analytics failure shouldn't break redirects
  }
}

/**
 * Simple user agent parser
 */
function parseUserAgent(userAgent: string): {
  deviceType: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();

  // Detect device type
  let deviceType = 'desktop';
  if (/mobile|android|iphone/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet';
  }

  // Detect browser
  let browser = 'unknown';
  if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('chrome')) {
    browser = 'Chrome';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
  }

  // Detect OS
  let os = 'unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }

  return { deviceType, browser, os };
}
