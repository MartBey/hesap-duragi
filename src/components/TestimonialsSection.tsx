'use client';

import { useState, useEffect } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  id: number | string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  game: string;
  date: string;
  verified: boolean;
}

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    
    // Her 30 saniyede bir yenile (yeni yorumlar için)
    const interval = setInterval(() => {
      fetchTestimonials();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Gerçek yorumları da dahil et
      const response = await fetch('/api/testimonials?includeRealReviews=true');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Hata durumunda sadece statik testimonials'ları al
      try {
        const fallbackResponse = await fetch('/api/testimonials');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success) {
          setTestimonials(fallbackData.data);
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback testimonials:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const itemsPerSlide = 3;
  const maxSlides = Math.ceil(testimonials.length / itemsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying || maxSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));
  };

  const getCurrentTestimonials = () => {
    const start = currentSlide * itemsPerSlide;
    return testimonials.slice(start, start + itemsPerSlide);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">👨‍💼</div>
            <div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(5)}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Müşteri Değerlendirmeleri
              </h2>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            HesapDurağı ekibi olarak, müşterilerimizin geri bildirimlerini her zaman en yüksek değerde tutuyoruz. 
            Sizlerin deneyimleri ve düşünceleri, hizmetlerimizi şekillendiren en önemli rehberdir.
          </p>
          <div className="mt-6">
            <span className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold">
              {testimonials.length} değerlendirme
            </span>
          </div>
        </div>

        {/* Testimonials Slider */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                  <div className="h-3 bg-gray-700 rounded w-32 mb-1"></div>
                  <div className="h-2 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentTestimonials().map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-orange-500/50 transition-all duration-300"
                >
                  {/* User Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓ Doğrulanmış
                          </div>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-orange-400 text-sm font-medium">{testimonial.game}</p>
                    <p className="text-gray-400 text-xs">{testimonial.date}</p>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-300 text-sm leading-relaxed">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>

          {/* Navigation Arrows */}
            {maxSlides > 1 && (
              <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
              </>
            )}
        </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Henüz değerlendirme bulunmuyor.</p>
          </div>
        )}

        {/* Dots Indicator */}
        {!loading && testimonials.length > 0 && maxSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">{testimonials.length}</div>
            <div className="text-gray-300">Toplam Değerlendirme</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9</div>
            <div className="text-gray-300">Ortalama Puan</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">%98</div>
            <div className="text-gray-300">Memnuniyet Oranı</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
            <div className="text-gray-300">Müşteri Desteği</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 