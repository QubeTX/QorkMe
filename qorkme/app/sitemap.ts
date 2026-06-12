import type { MetadataRoute } from 'next';

// Metadata route — takes precedence over the [shortCode] catch-all.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://qork.me';
  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
