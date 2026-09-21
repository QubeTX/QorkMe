/**
 * Redirect Handler
 * Handles short URL redirects and analytics tracking
 */

import { NextRequest, NextResponse, after } from 'next/server';
import { createAnonClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await context.params;

    if (!shortCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // One indexed, atomic lookup validates the current link state on every visit.
    const clickPayload = buildClickPayload(request);
    const supabase = await createAnonClient();

    // Use the increment_click_count function for atomic operation
    const { data, error } = await supabase.rpc('increment_click_count', {
      p_short_code: shortCode,
    });

    if (error) {
      console.error('Redirect lookup failed:', error.code);
      return unavailable();
    }
    if (!data?.length)
      return NextResponse.redirect(new URL('/link-not-found', request.url), {
        headers: { 'Cache-Control': 'no-store' },
      });
    const urlData = data[0];

    // Track analytics after the response (see note above)
    after(() => trackClick(urlData.id, clickPayload));

    // Perform redirect
    const response = NextResponse.redirect(new URL(urlData.long_url));
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Redirect handler error:', error);
    return unavailable();
  }
}

function unavailable() {
  return new NextResponse('This link is temporarily unavailable. Please try again shortly.', {
    status: 503,
    headers: {
      'Retry-After': '10',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
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
    referrer: request.headers.get('referer')?.slice(0, 2048) || null,
    utmSource: searchParams.get('utm_source')?.slice(0, 100) ?? null,
    utmMedium: searchParams.get('utm_medium')?.slice(0, 100) ?? null,
    utmCampaign: searchParams.get('utm_campaign')?.slice(0, 100) ?? null,
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

    const { error } = await supabase.from('clicks').insert({
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
    if (error) console.error('Analytics insert failed:', error.code);
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
  if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|android|iphone/i.test(ua)) {
    deviceType = 'mobile';
  }

  // Detect browser
  let browser = 'unknown';
  if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (/edg\//.test(ua)) {
    browser = 'Edge';
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
  } else if (/ios|iphone|ipad/.test(ua)) {
    os = 'iOS';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('mac')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  return { deviceType, browser, os };
}
