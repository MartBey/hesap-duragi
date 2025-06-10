'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./ModernSlider.css";

interface SlideIcon {
  type: string;
  x: number;
  y: number;
  rotation: number;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  link: string;
  backgroundColor: string;
  backgroundImage: string;
  icons: SlideIcon[];
}

const ModernSlider = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider');
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Fallback data
      setSlides([
        {
          id: 1,
          title: "OYUN HESAPLARI",
          subtitle: "Güvenli Alışveriş",
          description: "FPS, MMORPG, MOBA oyunları için güvenilir hesap platformu",
          buttonText: "Keşfet",
          link: "/products",
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundImage: "",
          icons: [
            { type: "gamepad", x: 15, y: 20, rotation: -15 },
            { type: "trophy", x: 85, y: 15, rotation: 25 },
            { type: "star", x: 20, y: 75, rotation: 45 },
            { type: "diamond", x: 80, y: 80, rotation: -30 },
            { type: "crown", x: 50, y: 25, rotation: 15 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const getSlideClass = (index: number) => {
    if (index === currentSlide) {
      return "active";
    }
    
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    const nextIndex = (currentSlide + 1) % slides.length;
    
    if (index === prevIndex) {
      return "prev";
    }
    
    if (index === nextIndex) {
      return "next";
    }
    
    // 4'ten fazla slide varsa, diğer slide'ları da göster
    if (slides.length > 3) {
      const prevPrevIndex = prevIndex === 0 ? slides.length - 1 : prevIndex - 1;
      const nextNextIndex = (nextIndex + 1) % slides.length;
      
      if (index === prevPrevIndex) {
        return "far-prev";
      }
      
      if (index === nextNextIndex) {
        return "far-next";
      }
    }
    
    return "hidden";
  };

  const handleSlideClick = (index: number) => {
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  const renderIcon = (icon: SlideIcon) => {
    const iconMap: { [key: string]: string } = {
      gamepad: "🎮",
      trophy: "🏆",
      star: "⭐",
      diamond: "💎",
      crown: "👑",
      clock: "⏰",
      shield: "🛡️",
      delivery: "🚚",
      check: "✅",
      lightning: "⚡",
      wallet: "💰",
      card: "💳",
      lock: "🔒",
      money: "💵",
      secure: "🔐"
    };

    return (
      <div
        key={`${icon.type}-${icon.x}-${icon.y}`}
        className="floating-icon"
        style={{
          left: `${icon.x}%`,
          top: `${icon.y}%`,
          transform: `rotate(${icon.rotation}deg)`,
          animationDelay: `${Math.random() * 2}s`
        }}
      >
        {iconMap[icon.type]}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="modern-slider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Yükleniyor...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="modern-slider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Slider verisi bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="modern-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`modern-slide ${getSlideClass(index)}`}
          style={{
            background: slide.backgroundImage 
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.backgroundImage})`
              : slide.backgroundColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => handleSlideClick(index)}
        >
          {/* Floating Icons */}
          <div className="icons-container">
            {slide.icons.map(renderIcon)}
          </div>

          {/* Content */}
          <div className="slide-content-modern">
            <h1 className="modern-title">{slide.title}</h1>
            <h2 className="modern-subtitle">{slide.subtitle}</h2>
            <p className="modern-description">{slide.description}</p>
            
            {getSlideClass(index) === "active" && (
              <Link href={slide.link}>
                <button className="modern-button">
                  {slide.buttonText}
                  <span className="button-arrow">→</span>
                </button>
              </Link>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="decorative-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      ))}

      {/* Side Navigation Arrows */}
      <button className="side-nav-arrow prev" onClick={prevSlide}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="side-nav-arrow next" onClick={nextSlide}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>


    </div>
  );
};

export default ModernSlider; 