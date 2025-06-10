'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon, 
  ClockIcon,
  FireIcon,
  TagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  _id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  images: string[];
  emoji: string;
  category: string;
  game: string;
  rating: number;
  reviews: number;
  stock: number;
}

const HaftaninFirsatlari = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Bir sonraki pazartesi gününü hesapla
  const getNextMonday = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
    const daysUntilMonday = currentDay === 0 ? 1 : (8 - currentDay); // Pazar ise 1 gün, diğer günler için hesapla
    
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0); // Pazartesi günü saat 00:00
    
    return nextMonday;
  };

  // Kalan süreyi hesapla
  const calculateTimeLeft = () => {
    const now = new Date();
    const nextMonday = getNextMonday();
    const difference = nextMonday.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  // Geri sayım timer'ı
  useEffect(() => {
    // İlk yüklemede kalan süreyi hesapla
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Eğer süre bittiyse timer'ı durdur
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        // Yeni hafta başladığında sayfayı yenile (opsiyonel)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fırsat ürünlerini getir
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      console.log('Fetching weekly deals...');
      // Haftanın fırsatlarını getir
      const response = await fetch('/api/admin/weekly-deals');
      const data = await response.json();
      console.log('Weekly deals response:', data);
      
      if (data.success) {
        console.log('Weekly deals found:', data.data.deals?.length || 0);
        setProducts(data.data.deals || []);
      } else {
        console.error('Weekly deals fetch failed:', data.error);
      }
    } catch (error) {
      console.error('Fırsat ürünleri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      emoji: product.emoji || '🎮',
      images: product.images || [],
      category: product.category,
      game: product.game || 'Oyun'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + '₺';
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative"
      style={{
        backgroundImage: 'url("/public/arka plan 2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <TopBar />
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <FireIcon className="h-12 w-12 text-orange-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                HAFTANIN FIRSATLARI
              </h1>
              <FireIcon className="h-12 w-12 text-orange-500 ml-4" />
            </div>
            
            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-500/30 p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-orange-400 mr-2" />
                <span className="text-orange-400 font-semibold text-lg">Kalan Süre</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-white">
                <div className="text-center">
                  <div className="bg-orange-500 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{timeLeft.days}</span>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">Gün</span>
                </div>
                <span className="text-2xl text-orange-400">:</span>
                <div className="text-center">
                  <div className="bg-orange-500 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">Saat</span>
                </div>
                <span className="text-2xl text-orange-400">:</span>
                <div className="text-center">
                  <div className="bg-orange-500 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">Dakika</span>
                </div>
                <span className="text-2xl text-orange-400">:</span>
                <div className="text-center">
                  <div className="bg-orange-500 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">Saniye</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-6 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 group relative"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <TagIcon className="h-4 w-4" />
                      <span>-%{product.discountPercentage}</span>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-500/20 to-purple-600/20 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-50">{product.emoji || '🎮'}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="text-orange-400 text-sm font-semibold mb-2">
                      {product.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 4.5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({product.reviews || 0})</span>
                    </div>

                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          -%{product.discountPercentage}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-orange-400">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Stok:</span>
                        <span className={`font-semibold ${
                          product.stock > 10 ? 'text-green-400' : 
                          product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {product.stock > 0 ? `${product.stock} adet` : 'Tükendi'}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        product.stock > 0
                          ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>{product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FireIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Henüz Fırsat Yok</h3>
              <p className="text-gray-400">Yakında harika fırsatlar burada olacak!</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HaftaninFirsatlari; 