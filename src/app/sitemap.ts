import type { MetadataRoute } from 'next'
import { getAllArticleSlugs } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllArticleSlugs()

  const articles = slugs.map((slug) => ({
    url: `https://longcut.ink/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: 'https://longcut.ink',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...articles,
  ]
}
