/**
 * Redirect Handler
 * Handles short URL redirects and analytics tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClientInstance } from '@/lib/supabase/server';
import { headers } from 'next/headers';
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
    const cached = urlCache.get(shortCode.toLowerCase());
    if (cached && cached.expires > Date.now()) {
      // Track analytics asynchronously
      trackClick(cached.id, request).catch(console.error);
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
      // Redirect to 404 page
      return NextResponse.redirect(new URL('/404', request.url));
    }

    const urlData = data[0];

    // Cache the URL
    urlCache.set(shortCode.toLowerCase(), {
      url: urlData.long_url,
      id: urlData.id,
      expires: Date.now() + CACHE_TTL,
    });

    // Clean old cache entries periodically
    if (urlCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of urlCache.entries()) {
        if (value.expires < now) {
          urlCache.delete(key);
        }
      }
    }

    // Track analytics asynchronously
    trackClick(urlData.id, request).catch(console.error);

    // Perform redirect
    return NextResponse.redirect(new URL(urlData.long_url));
  } catch (error) {
    console.error('Redirect handler error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

/**
 * Track click analytics
 * Runs asynchronously to not block the redirect
 */
async function trackClick(urlId: string, request: NextRequest) {
  try {
    const supabase = await createServerClientInstance();
    const headersList = await headers();

    // Get IP address (hashed for privacy)
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Get user agent info
    const userAgent = headersList.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgent);

    // Get referrer
    const referrer = headersList.get('referer') || null;

    // Get UTM parameters
    const searchParams = request.nextUrl.searchParams;
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    // Insert click record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('clicks').insert({
      url_id: urlId,
      ip_hash: ipHash,
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      referrer,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
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
