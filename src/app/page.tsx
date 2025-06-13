'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import ModernSlider from '@/components/ModernSlider';
import CategorySlider from '@/app/components/CategorySlider';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import PopularCategoriesSection from '@/components/PopularCategoriesSection';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import { 
  ShieldCheckIcon, 
  CreditCardIcon, 
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { useCart } from '@/contexts/CartContext';

interface Account {
  _id: string;
  title: string;
  description: string;
  game: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isOnSale: boolean;
  isFeatured: boolean;
  category: string;
  features: string[];
  emoji: string;
  images: string[];
  status: string;
  level: number;
  rank: string;
  rating: number;
  reviews: number;
  stock: number;
  isWeeklyDeal: boolean;
}

export default function Home() {
  const { addToCart } = useCart();
  const [featuredAccounts, setFeaturedAccounts] = useState<Account[]>([]);
  const [onSaleAccounts, setOnSaleAccounts] = useState<Account[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  useEffect(() => {
    fetchAllData();
    
    // Responsive items per slide
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(2); // Mobile: 2 items
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(3); // Small tablet: 3 items
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(4); // Tablet: 4 items
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(5); // Desktop: 5 items
      } else {
        setItemsPerSlide(6); // Large desktop: 6 items
      }
      setCurrentSlide(0); // Reset slide position on resize
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || featuredAccounts.length <= itemsPerSlide) return;

    const maxSlides = Math.ceil(featuredAccounts.length / itemsPerSlide);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === maxSlides - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredAccounts.length, isAutoPlaying, itemsPerSlide]);

  const fetchAllData = async () => {
    try {
      // Paralel olarak tüm verileri çek
      const [featuredResponse, onSaleResponse, allResponse] = await Promise.all([
        fetch('/api/accounts/featured?limit=8'),
        fetch('/api/accounts/on-sale?limit=8'),
        fetch('/api/accounts?page=1&limit=12')
      ]);

      const [featuredData, onSaleData, allData] = await Promise.all([
        featuredResponse.json(),
        onSaleResponse.json(),
        allResponse.json()
      ]);

      if (featuredData.success) {
        setFeaturedAccounts(featuredData.data.accounts);
      }

      if (onSaleData.success) {
        setOnSaleAccounts(onSaleData.data.accounts);
      }

      if (allData.success) {
        setAllAccounts(allData.data.accounts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    const maxSlides = Math.ceil(featuredAccounts.length / itemsPerSlide);
    setCurrentSlide((prev) => 
      prev === maxSlides - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    const maxSlides = Math.ceil(featuredAccounts.length / itemsPerSlide);
    setCurrentSlide((prev) => 
      prev === 0 ? maxSlides - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const handleAddToCart = (account: Account) => {
    addToCart({
      _id: account._id,
      title: account.title,
      price: account.price,
      emoji: account.emoji || '🎮',
      images: account.images || [],
      category: account.category,
      game: account.game || 'Oyun'
    });
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
        {/* TopBar and Navbar */}
        <TopBar />
        <Navbar />
      
      {/* Hero Section - ModernSlider */}
      <section className="relative py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
                     <ModernSlider />
        </div>
      </section>

      {/* On Sale Products Section */}
      {onSaleAccounts.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-3">
                🔥 İNDİRİMLİ ÜRÜNLER 🔥
              </h3>
              <p className="text-gray-400 text-lg">
                Sınırlı süre özel indirim fırsatları
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {onSaleAccounts.slice(0, 8).map((account) => (
                <div 
                  key={account._id} 
                  className="bg-gradient-to-br from-red-800 to-gray-900 rounded-lg p-3 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 group relative h-[380px] flex flex-col"
                >
                  {/* Sale Badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      %{account.discountPercentage} İNDİRİM
                    </span>
                  </div>

                  {/* Product Image - Fixed Height */}
                  <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center mb-2 relative overflow-hidden flex-shrink-0">
                    {account.images && account.images.length > 0 ? (
                      <img 
                        src={account.images[0]} 
                        alt={account.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl">{account.emoji || '🎮'}</span>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-1 right-1">
                      <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                        account.status === 'available' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {account.status === 'available' ? 'Mevcut' : 'Satıldı'}
                      </span>
                    </div>
                  </div>

                  {/* Content Area - Flexible */}
                  <div className="flex-1 flex flex-col">
                    {/* Title - Fixed Height */}
                    <div className="h-9 mb-1">
                      <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
                        {account.title}
                      </h4>
                    </div>
                    
                    {/* Game - Fixed Height */}
                    <div className="h-4 mb-1">
                      <p className="text-gray-300 text-xs truncate">{account.game}</p>
                    </div>
                    
                    {/* Rating - Fixed Height */}
                    <div className="h-4 mb-1 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-2.5 w-2.5 ${
                              i < Math.floor(account.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">
                        ({account.rating})
                      </span>
                    </div>

                    {/* Level/Rank Badges - Fixed Height */}
                    <div className="h-5 mb-1 flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {account.level}
                      </span>
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        {account.rank}
                      </span>
                    </div>

                    {/* Price Section - Flexible */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-500">
                              ₺{account.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₺{account.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                            %{account.discountPercentage} İndirim
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Stok: {account.stock} adet
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Fixed at Bottom */}
                  <div className="flex space-x-2 mt-auto">
                    {account.isOnSale && account.discountPercentage > 0 ? (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    ) : account.isFeatured ? (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    )}
                    <Link 
                      href={`/products/${account._id}`}
                      className="flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      title="Detayları Gör"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link 
                href="/products?sale=true"
                className="inline-flex items-center px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Tüm İndirimli Ürünleri Gör
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Slider */}
      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CategorySlider />
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredAccounts.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-3">
                ⭐ ÖNE ÇIKAN ÜRÜNLER ⭐
              </h3>
              <p className="text-gray-400 text-lg">
                Özel olarak seçilmiş en kaliteli hesaplar
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {featuredAccounts.slice(0, 8).map((account) => (
                <div 
                  key={account._id} 
                  className="bg-gradient-to-br from-yellow-800 to-gray-900 rounded-lg p-3 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 group relative h-[380px] flex flex-col"
                >
                  {/* Tüm rozetler ve mevcut etiketi tek satırda */}
                  <div className="absolute top-2 left-2 z-20 flex flex-row gap-1 flex-wrap">
                    {account.isOnSale && account.discountPercentage > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        %{account.discountPercentage} İNDİRİM
                      </span>
                    )}
                    {account.isFeatured && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="text-sm">★</span> ÖNE ÇIKAN
                      </span>
                    )}
                    {account.isWeeklyDeal && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                        <span className="text-sm">🔥</span> Haftanın Fırsatı
                      </span>
                    )}
                    {account.status === 'available' && (
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Mevcut
                      </span>
                    )}
                  </div>

                  {/* Product Image - Fixed Height */}
                  <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center mb-2 relative overflow-hidden flex-shrink-0">
                    {account.images && account.images.length > 0 ? (
                      <img 
                        src={account.images[0]} 
                        alt={account.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl">{account.emoji || '🎮'}</span>
                    )}
                  </div>

                  {/* Content Area - Flexible */}
                  <div className="flex-1 flex flex-col">
                    {/* Title - Fixed Height */}
                    <div className="h-9 mb-1">
                      <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
                        {account.title}
                      </h4>
                    </div>
                    
                    {/* Game - Fixed Height */}
                    <div className="h-4 mb-1">
                      <p className="text-gray-300 text-xs truncate">{account.game}</p>
                    </div>
                    
                    {/* Rating - Fixed Height */}
                    <div className="h-4 mb-1 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-2.5 w-2.5 ${
                              i < Math.floor(account.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">
                        ({account.rating})
                      </span>
                    </div>

                    {/* Level/Rank Badges - Fixed Height */}
                    <div className="h-5 mb-1 flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {account.level}
                      </span>
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        {account.rank}
                      </span>
                    </div>

                    {/* Price Section - Flexible */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="mb-2">
                        {account.isOnSale && account.discountPercentage > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-yellow-500">
                                ₺{account.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₺{account.originalPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                              %{account.discountPercentage} İndirim
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-yellow-500">
                            ₺{account.price.toLocaleString()}
                          </span>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Stok: {account.stock} adet
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Fixed at Bottom */}
                  <div className="flex space-x-2 mt-auto">
                    {account.isOnSale && account.discountPercentage > 0 ? (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    ) : account.isFeatured ? (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(account)}
                        disabled={account.status !== 'available' || account.stock === 0}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                      >
                        <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        <span className="text-xs lg:text-sm">Sepete Ekle</span>
                      </button>
                    )}
                    <Link 
                      href={`/products/${account._id}`}
                      className="flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      title="Detayları Gör"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link 
                href="/products?featured=true"
                className="inline-flex items-center px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                Tüm Öne Çıkan Ürünleri Gör
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      {allAccounts.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-3">
                TÜM ÜRÜNLER
              </h3>
              <p className="text-gray-400 text-lg">
                En popüler ve kaliteli hesapları keşfedin
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {allAccounts.slice(0, 8).map((account) => (
                <div
                  key={account._id}
                  className={
                    `rounded-lg p-3 lg:p-4 transition-all duration-300 hover:scale-105 group h-[420px] flex flex-col relative ` +
                    (account.isWeeklyDeal
                      ? 'bg-gradient-to-br from-orange-500 to-yellow-400 border-2 border-orange-500 shadow-lg animate-pulse'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/20 hover:border-orange-500/40')
                  }
                >
                  {/* Tüm rozetler ve mevcut etiketi tek satırda */}
                  <div className="absolute top-2 left-2 z-20 flex flex-row gap-1 flex-wrap">
                    {account.isOnSale && account.discountPercentage > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        %{account.discountPercentage} İNDİRİM
                      </span>
                    )}
                    {account.isFeatured && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="text-sm">★</span> ÖNE ÇIKAN
                      </span>
                    )}
                    {account.isWeeklyDeal && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                        <span className="text-sm">🔥</span> Haftanın Fırsatı
                      </span>
                    )}
                    {account.status === 'available' && (
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Mevcut
                      </span>
                    )}
                  </div>

                  {/* Product Image - Fixed Height */}
                  <div className="bg-gray-700 rounded-lg h-32 lg:h-40 flex items-center justify-center mb-3 relative overflow-hidden flex-shrink-0">
                    {account.images && account.images.length > 0 ? (
                      <img 
                        src={account.images[0]} 
                        alt={account.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl lg:text-4xl">{account.emoji || '🎮'}</span>
                    )}
                  </div>

                  {/* Content Area - Flexible */}
                  <div className="flex-1 flex flex-col">
                    {/* Title - Fixed Height */}
                    <div className="h-12 mb-2">
                      <h4 className="text-sm lg:text-base font-bold text-white line-clamp-2 group-hover:text-orange-400 transition-colors leading-tight">
                        {account.title}
                      </h4>
                    </div>
                    
                    {/* Game - Fixed Height */}
                    <div className="h-5 mb-2">
                      <p className="text-gray-400 text-xs lg:text-sm truncate">{account.game}</p>
                    </div>
                    
                    {/* Rating - Fixed Height */}
                    <div className="h-6 mb-2 flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-3 w-3 lg:h-4 lg:w-4 ${
                              i < Math.floor(account.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs">({account.reviews})</span>
                    </div>

                    {/* Price Section - Flexible */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-orange-500 font-bold text-sm lg:text-lg">
                            ₺{account.price.toLocaleString()}
                          </span>
                          {account.isOnSale && account.originalPrice > account.price && (
                            <span className="text-gray-500 line-through text-xs">
                              ₺{account.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Stok: {account.stock} adet
                          </div>
                        </div>
                        
                        {/* Level/Rank Badge */}
                        <div className="text-right">
                          <div className="text-xs text-gray-400">{account.level}</div>
                          <div className="text-xs text-orange-400 font-medium">{account.rank}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Fixed at Bottom */}
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => handleAddToCart(account)}
                      disabled={account.status !== 'available' || account.stock === 0}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                    >
                      <ShoppingCartIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                      <span className="text-xs lg:text-sm">Sepete Ekle</span>
                    </button>
                    <Link 
                      href={`/products/${account._id}`}
                      className="flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      title="Detayları Gör"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link 
                href="/products"
                className="inline-flex items-center px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Tüm Ürünleri Gör
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-4 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-4">
            Neden HesapDurağı?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-black/30 rounded-lg border border-orange-500/20">
              <ShieldCheckIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Güvenli İşlem</h4>
              <p className="text-gray-300">
                Tüm işlemler platform üzerinden güvenle gerçekleşir
              </p>
            </div>
            <div className="text-center p-6 bg-black/30 rounded-lg border border-orange-500/20">
              <CreditCardIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Bakiye Sistemi</h4>
              <p className="text-gray-300">
                Güvenli bakiye yükleme ve ödeme sistemi
              </p>
            </div>
            <div className="text-center p-6 bg-black/30 rounded-lg border border-orange-500/20">
              <ClockIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Hızlı Teslimat</h4>
              <p className="text-gray-300">
                24 saat içinde hesap teslim garantisi
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Popular Categories */}
      <PopularCategoriesSection />

      {/* Blog Section */}
      <BlogSection />

      {/* SEO Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Güvenilir Dijital Hesap Mağazası - Oyun Hesabı Satın Al
            </h2>
                          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                HesapDurağı&apos;nda güvenilir dijital hesap alışverişi yapın! LOL hesap satın al, Valorant hesap satın al, 
                PUBG Mobile UC satın al ve daha fazlası. Instagram takipçi satın al, Netflix hesap satın al gibi 
                dijital ürünler için güvenilir dijital ürün mağazanız.
              </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold text-orange-400 mb-4">🎮 Dijital Oyun Hesapları</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>LOL hesap satın al</strong> - League of Legends</li>
                <li>• <strong>Valorant hesap satın al</strong> - Riot Games</li>
                <li>• <strong>PUBG Mobile UC satın al</strong></li>
                <li>• <strong>Free Fire elmas satın al</strong></li>
                <li>• Steam hesap satın al</li>
                <li>• Roblox Robux satın al</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold text-orange-400 mb-4">📱 Sosyal Medya</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Instagram takipçi satın al</strong></li>
                <li>• <strong>TikTok beğeni satın al</strong></li>
                <li>• YouTube abone satın al</li>
                <li>• Twitch takipçi satın al</li>
                <li>• Instagram beğeni satın al</li>
                <li>• TikTok jeton hilesi</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold text-orange-400 mb-4">🎬 Premium Hesaplar</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Netflix hesap satın al</strong></li>
                <li>• <strong>Spotify premium hesap</strong></li>
                <li>• Discord Nitro satın al</li>
                <li>• Xbox Game Pass satın al</li>
                <li>• PlayStation Plus kod satın al</li>
                <li>• YouTube Premium hesap</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-8 border border-orange-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Neden HesapDurağı&apos;nı Tercih Etmelisiniz?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-2">✅ Güvenilir ve Ucuz</h4>
                <p className="text-gray-300">
                  <strong>Güvenilir dijital hesap mağazası</strong> olarak en uygun fiyatlarla hizmet veriyoruz. 
                  Tüm işlemler platform üzerinden güvenle gerçekleşir.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-2">⚡ Hızlı Teslimat</h4>
                <p className="text-gray-300">
                  24 saat içinde teslimat garantisi. <strong>Dijital ürünler satın al</strong> 
                  ve anında kullanmaya başla.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-2">🛡️ Güvenli Ödeme</h4>
                <p className="text-gray-300">
                  Güvenli bakiye sistemi ve çoklu ödeme seçenekleri. 
                  <strong>Dijital hesap ve bakiye yükleme</strong> işlemleri güvenle.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-2">🎯 Geniş Ürün Yelpazesi</h4>
                <p className="text-gray-300">
                  Steam cüzdan kodu, Google Play bakiye, iTunes kart ve daha fazlası. 
                  Aradığınız tüm dijital ürünler burada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Structured Data */}
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
      </div>
    </div>
  );
}
