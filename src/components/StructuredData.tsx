'use client';

interface StructuredDataProps {
  type: 'website' | 'product' | 'organization' | 'breadcrumb';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "HesapDurağı",
          "url": "https://hesapduragi.com",
          "description": "Güvenilir dijital hesap mağazası! LOL, Valorant, PUBG Mobile hesapları. Instagram takipçi, Netflix hesap satın al. Güvenilir dijital ürün alışverişi.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://hesapduragi.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "HesapDurağı",
            "url": "https://hesapduragi.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://hesapduragi.com/images/logo.png"
            }
          }
        };

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "HesapDurağı",
          "url": "https://hesapduragi.com",
          "logo": "https://hesapduragi.com/images/logo.png",
          "description": "Güvenilir dijital hesap mağazası! Güvenilir dijital ürün alışverişi.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-XXX-XXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": "Turkish"
          },
          "sameAs": [
            "https://twitter.com/hesapduragi",
            "https://instagram.com/hesapduragi",
            "https://facebook.com/hesapduragi"
          ]
        };

      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.title,
          "description": data.description,
          "image": data.images || [],
          "brand": {
            "@type": "Brand",
            "name": "HesapDurağı"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "TRY",
            "availability": data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "HesapDurağı"
            }
          },
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "ratingCount": data.reviewCount || 1
          } : undefined
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchema())
      }}
    />
  );
} 