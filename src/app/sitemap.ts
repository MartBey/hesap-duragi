import { MetadataRoute } from 'next'

// Blog yazıları - gerçek uygulamada veritabanından gelecek
const blogPosts = [
  {
    slug: 'e-ticaret-seo-stratejileri-2024',
    date: '2024-01-15'
  },
  {
    slug: 'sosyal-medya-pazarlama-trendleri',
    date: '2024-01-12'
  },
  {
    slug: 'google-ads-satis-artirma',
    date: '2024-01-10'
  },
  {
    slug: 'e-ticaret-hiz-optimizasyonu',
    date: '2024-01-08'
  },
  {
    slug: 'icerik-pazarlama-marka-bilinirlik',
    date: '2024-01-05'
  },
  {
    slug: 'email-pazarlama-kampanyalari',
    date: '2024-01-03'
  }
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hesapduragi.com'
  
  // Ana sayfalar
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Blog yazıları
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Kategori sayfaları
  const categoryPages = [
    'lol-hesap-satin-al',
    'valorant-hesap-satin-al',
    'pubg-mobile-uc-satin-al',
    'free-fire-elmas-satin-al',
    'instagram-takipci-satin-al',
    'tiktok-begeni-satin-al',
    'netflix-hesap-satin-al',
    'spotify-premium-hesap',
    'steam-hesap-satin-al',
    'roblox-robux-satin-al',
  ].map(category => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Ürün sayfaları (dinamik olarak oluşturulacak)
  // Bu kısım gerçek ürün ID'leri ile doldurulacak
  const productPages: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }> = [
    // Örnek ürün sayfaları
  ]

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
  ]
} 