'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./ValorantSlider.css";

const ValorantSlider = () => {
  const slides = [
    {
      id: 1,
      title: "VALORANT",
      subtitle: "GECE PAZARI",
      dateRange: "12.12.2024 // 07.01.2025",
      ctaText: "HEMEN SATIN AL",
      eventDate: "20 ARA 2024",
      gameName: "Valorant",
      buttonText: "VP SATIN AL",
      link: "/products?game=valorant",
      backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      characterImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "PUBG MOBILE",
      subtitle: "AMERICAN TOURISTER",
      dateRange: "15.12.2024 // 31.12.2024",
      ctaText: "UC SATIN AL",
      eventDate: "25 ARA 2024",
      gameName: "PUBG Mobile",
      buttonText: "SATIN AL",
      link: "/products?game=pubg",
      backgroundImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      characterImage: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "MOBILE LEGENDS",
      subtitle: "DIAMOND YÜKLE",
      dateRange: "01.01.2025 // 15.01.2025",
      ctaText: "DIAMOND SATIN AL",
      eventDate: "05 OCA 2025",
      gameName: "Mobile Legends",
      buttonText: "SATIN AL",
      link: "/products?game=ml",
      backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      characterImage: "https://images.unsplash.com/photo-1556438064-2d7646166914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
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

  return (
    <div className="game-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`game-slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`
          }}
        >
          <div className="slide-overlay"></div>
          
          <div className="slide-container">
            <div className="slide-content">
              <div className="game-info">
                <div className="event-date">{slide.eventDate}</div>
                <div className="game-name">{slide.gameName}</div>
              </div>
              
              <h1 className="game-title">{slide.title}</h1>
              <h2 className="game-subtitle">{slide.subtitle}</h2>
              <div className="date-range">{slide.dateRange}</div>
              
              <div className="cta-section">
                <div className="vp-badge">
                  <span>✓</span>
                  <span>{slide.buttonText}</span>
                </div>
                <p className="cta-text">{slide.ctaText}</p>
                
                <div className="action-buttons">
                  <button className="social-btn facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="social-btn whatsapp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                    </svg>
                  </button>
                  <Link href={slide.link}>
                    <button className="buy-button">Satın Al</button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="character-section">
              <img 
                src={slide.characterImage} 
                alt={slide.gameName}
                className="character-image"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="slider-arrow prev" onClick={prevSlide}>
        ‹
      </button>
      <button className="slider-arrow next" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default ValorantSlider; 