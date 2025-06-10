import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/cart',
          '/checkout',
          '/profile',
          '/orders',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/cart',
          '/checkout',
          '/profile',
          '/orders',
        ],
      },
    ],
    sitemap: 'https://hesapduragi.com/sitemap.xml',
  }
} 