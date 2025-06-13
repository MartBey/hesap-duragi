/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Docker için gerekli
  output: 'standalone',
  
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  
  // SEO ve Performance optimizasyonları
  compress: true,
  poweredByHeader: false,
  
  // Image optimizasyonu
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'localhost',
      'hesapduragi.com',
      'www.hesapduragi.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    unoptimized: true // Docker için geçici olarak
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
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://hesapduragi.com',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-super-secret-nextauth-key-here-make-it-long-and-complex-123456789',
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // MongoDB için
    if (isServer) {
      config.externals.push('mongodb');
    }
    
    return config;
  },
  
  // Production optimizasyonları
  swcMinify: true,
};
 
module.exports = nextConfig; 