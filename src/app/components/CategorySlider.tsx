'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Category {
  _id: string;
  title: string;
  icon?: string;
  image?: string;
  type: 'account' | 'license';
  itemCount: number;
}

interface CategorySliderProps {
  className?: string;
}

const CategorySlider = ({ className = '' }: CategorySliderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Gerçek sonsuz slider - CSS animasyon ile sürekli akan
  useEffect(() => {
    if (categories.length > 0 && sliderRef.current) {
      const slider = sliderRef.current;
      
      // CSS animasyonu ile sürekli akış
      const totalWidth = categories.length * 174; // Her item 174px genişlik (154px + 20px gap)
      const animationDuration = categories.length * 3; // Kategori sayısına göre süre
      
      slider.style.animation = `infiniteSlide ${animationDuration}s linear infinite`;
      
      // CSS keyframes'i dinamik olarak oluştur
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes infiniteSlide {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-${totalWidth}px); }
        }
      `;
      
      // Önceki keyframes'i temizle
      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        const rule = styleSheet.cssRules[i];
        if (rule instanceof CSSKeyframesRule && rule.name === 'infiniteSlide') {
          styleSheet.deleteRule(i);
        }
      }
      
      // Yeni keyframes'i ekle
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
  }, [categories.length]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (error) {
      console.error('CategorySlider: Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri 2 kez tekrarla (sonsuz akış için yeterli)
  const infiniteCategories = [...categories, ...categories];

  if (loading) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: '#f97316',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          Kategoriler yükleniyor...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: '#9ca3af',
          fontSize: '1.1rem'
        }}>
          Henüz kategori bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2.5rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.02) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '2rem',
          color: '#ffffff',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          fontFamily: 'inherit',
          letterSpacing: '1px'
        }}>
          KATEGORİLER
        </h2>

        {/* Sonsuz Slider Container */}
        <div style={{
          overflow: 'hidden',
          width: '100%',
          borderRadius: '20px',
          padding: '1rem 0',
          position: 'relative'
        }}>
          <div 
            ref={sliderRef}
            style={{
              display: 'flex',
              width: 'fit-content',
              gap: '20px'
            }}
          >
            {infiniteCategories.map((category, index) => (
                              <div
                key={`${category._id}-${index}`}
                style={{
                  width: '154px', // %30 daha küçük (220 * 0.7)
                  flexShrink: 0,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Link
                  href={`/categories/${category._id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                >
                  {/* Image Card */}
                  <div                     style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      aspectRatio: '1.1',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(249, 115, 22, 0.1)',
                      marginBottom: '0.7rem',
                      transformStyle: 'preserve-3d'
                    }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) rotateX(5deg) rotateY(-5deg) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(249, 115, 22, 0.3)';
                    
                    // Image zoom effect
                    const imageDiv = e.currentTarget.querySelector('.category-image') as HTMLElement;
                    if (imageDiv) {
                      imageDiv.style.transform = 'scale(1.1)';
                    }
                    
                    // Glow effect
                    const glowDiv = e.currentTarget.querySelector('.hover-glow') as HTMLElement;
                    if (glowDiv) {
                      glowDiv.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(249, 115, 22, 0.1)';
                    
                    // Image reset
                    const imageDiv = e.currentTarget.querySelector('.category-image') as HTMLElement;
                    if (imageDiv) {
                      imageDiv.style.transform = 'scale(1)';
                    }
                    
                    // Glow reset
                    const glowDiv = e.currentTarget.querySelector('.hover-glow') as HTMLElement;
                    if (glowDiv) {
                      glowDiv.style.opacity = '0';
                    }
                  }}
                  >
                    {/* Full Image Background */}
                    <div 
                      className="category-image"
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: category.image 
                          ? `url(${category.image})` 
                          : 'linear-gradient(135deg, #1f2937, #374151)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transition: 'transform 0.6s ease'
                      }} 
                    />

                    {/* Fallback Icon (if no image) */}
                                            {!category.image && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '2.5rem', // %30 küçük (3.5 * 0.7)
                          color: '#f97316',
                          textShadow: '0 4px 15px rgba(249, 115, 22, 0.5)',
                          zIndex: 2
                        }}>
                          {category.icon || '🎮'}
                        </div>
                      )}

                    {/* Subtle Dark Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))',
                      zIndex: 1
                    }} />

                    {/* Type Badge - Sadece lisans kategorilerinde göster */}
                    {category.type === 'license' && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        padding: '4px 8px', // %30 küçük
                        borderRadius: '10px', // %30 küçük
                        fontSize: '0.6rem', // %30 küçük
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        zIndex: 3,
                        backdropFilter: 'blur(10px)'
                      }}>
                        LİSANS
                      </div>
                    )}

                    {/* Modern Hover Glow Effect */}
                    <div 
                      className="hover-glow"
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.2))',
                        opacity: '0',
                        transition: 'opacity 0.4s ease',
                        zIndex: 2,
                        mixBlendMode: 'overlay'
                      }}
                    />
                  </div>

                  {/* Category Info Below Image */}
                  <div style={{
                    textAlign: 'center',
                    padding: '0 0.5rem'
                  }}>
                    <h3 style={{
                      color: '#ffffff',
                      fontSize: 'clamp(0.9rem, 1.1vw, 1.2rem)',
                      margin: '0 0 0.5rem 0',
                      fontWeight: '700',
                      letterSpacing: '0.3px',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                      lineHeight: '1.3'
                    }}>
                      {category.title}
                    </h3>
                    <p style={{
                      color: '#f97316',
                      fontSize: '0.85rem',
                      margin: '0',
                      fontWeight: '600',
                      opacity: '0.9'
                    }}>
                      {category.itemCount} ürün
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider; 