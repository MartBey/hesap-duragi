import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Providers from "@/components/Providers";
import Script from 'next/script'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'HesapDurağı - Güvenilir Dijital Hesap Mağazası | Oyun Hesabı Satın Al',
  description: 'Güvenilir dijital ürün mağazası! LOL, Valorant, PUBG Mobile, Free Fire hesapları. Instagram takipçi, TikTok beğeni, Netflix, Spotify premium hesap satın al. Güvenilir dijital hesap alışverişi.',
  keywords: 'güvenilir dijital hesap mağazası, oyun hesabı satın al, lol hesap satın al, valorant hesap satın al, pubg mobile uc satın al, instagram takipçi satın al, netflix hesap satın al, dijital ürünler',
  authors: [{ name: 'HesapDurağı' }],
  creator: 'HesapDurağı',
  publisher: 'HesapDurağı',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://hesapduragi.com',
    siteName: 'HesapDurağı',
    title: 'HesapDurağı - Güvenilir Dijital Hesap Mağazası',
    description: 'Güvenilir dijital hesap mağazası! LOL, Valorant, PUBG Mobile hesapları. Instagram takipçi, Netflix hesap ve daha fazlası. Güvenilir dijital ürün alışverişi.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HesapDurağı - Oyun Hesabı Satın Al',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HesapDurağı - Güvenilir Dijital Hesap Mağazası',
    description: 'Güvenilir dijital hesap mağazası! LOL, Valorant, PUBG Mobile hesapları. Güvenilir dijital ürün alışverişi.',
    images: ['/images/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://hesapduragi.com',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        
        {/* Yandex Verification */}
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        {/* Bing Verification */}
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        
        {/* Yandex Metrica - Temporarily disabled */}
        {/* <Script id="yandex-metrica" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(YANDEX_COUNTER_ID, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true
            });
          `}
        </Script> */}

        {/* Tawk.to Live Chat - Temporarily disabled */}
        {/* <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/68454e05994a19190e268f11/1it7bhhmm';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script> */}
      </body>
    </html>
  );
}
