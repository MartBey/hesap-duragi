/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // SEO ve Performance optimizasyonları
  compress: true,
  poweredByHeader: false,
  
  // Image optimizasyonu
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['hesapduragi.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers for SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/refund',
        destination: '/help',
        permanent: true,
      },
      {
        source: '/security',
        destination: '/help',
        permanent: true,
      },
    ];
  },
  
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://duragihesap:7XJNTIss1Zo0Wq9N@hdurag.qet35hk.mongodb.net/hesapduragi?retryWrites=true&w=majority',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-super-secret-nextauth-key-here-make-it-long-and-complex-123456789'
  }
};
 
module.exports = nextConfig; 