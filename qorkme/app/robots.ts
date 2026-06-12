import type { MetadataRoute } from 'next';

// Metadata routes take precedence over the [shortCode] catch-all — without
// this, /robots.txt would be treated as a short code and render the 404 page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://qork.me'}/sitemap.xml`,
  };
}
