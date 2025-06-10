'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  PuzzlePieceIcon, 
  StarIcon,
  ShieldCheckIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/CartContext';
import CartIcon from '@/components/CartIcon';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import StructuredData from '@/components/StructuredData';

interface Account {
  _id: string;
  title: string;
  description: string;
  game: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isOnSale: boolean;
  category: string;
  features: string[];
  level: string;
  rank: string;
  rating: number;
  status: string;
  stock: number;
  createdAt: string;
  emoji?: string;
  images?: string[];
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
  isAnonymous: boolean;
}

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchAccount(params.id as string);
      fetchReviews(params.id as string);
    }
  }, [params.id]);

  const fetchAccount = async (id: string) => {
    try {
      const response = await fetch(`/api/accounts/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setAccount(data.account);
      } else {
        setError(data.error || 'Hesap bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (accountId: string) => {
    try {
      setReviewsLoading(true);
      console.log('Reviews çekiliyor, accountId:', accountId);
      
      const response = await fetch(`/api/reviews?accountId=${accountId}&page=1&limit=10`);
      const data = await response.json();
      
      console.log('Reviews API response:', data);
      
      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setReviewCount(data.reviewCount || 0);
        console.log('Reviews yüklendi:', data.reviews?.length || 0, 'adet');
      } else {
        console.log('Reviews yüklenemedi:', data.error);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!account) return;

    setIsPurchasing(true);
    try {
      // Kullanıcı giriş kontrolü
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/accounts/${account._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Satın alma işlemi başarılı!');
        router.push('/dashboard/orders');
      } else {
        alert(data.error || 'Satın alma işlemi başarısız');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleAddToCart = () => {
    if (!account) return;
    
    addToCart({
      _id: account._id,
      title: account.title,
      price: account.price,
      emoji: account.emoji || '🎮',
      images: account.images || [],
      category: account.category || 'Oyun',
      game: account.game || 'Oyun'
    });
    
    // Başarı mesajı göster
    alert('Ürün sepete eklendi!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <PuzzlePieceIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Hesap Bulunamadı</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            href="/products"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Hesaplara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* TopBar and Navbar */}
      <TopBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-orange-500">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-orange-500">Ürünler</Link>
          <span>/</span>
          <span className="text-white">{account.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Geri Dön
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center mb-6 overflow-hidden">
              {account.images && account.images.length > 0 ? (
                <img 
                  src={account.images[0]} 
                  alt={account.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-9xl">{account.emoji || '🎮'}</span>
              )}
            </div>
            
            {/* Product Description */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Açıklama</h3>
              <p className="text-gray-300 leading-relaxed">
                {account.description || 'Bu hesap için detaylı açıklama bulunmamaktadır.'}
              </p>
            </div>

            {/* Features */}
            {account.features && account.features.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mt-6">
                <h3 className="text-xl font-bold text-white mb-4">Özellikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {account.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Değerlendirmeler</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(averageRating) 
                            ? 'text-yellow-400' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {averageRating.toFixed(1)}/5 ({reviewCount} değerlendirme)
                  </span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-600 rounded-full p-2">
                            <UserIcon className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{review.userName}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIconSolid 
                                    key={i} 
                                    className={`h-3 w-3 ${
                                      i < review.rating 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-600'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400 text-xs">
                                {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <div className="flex items-start space-x-2 mt-3">
                          <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Henüz değerlendirme yapılmamış</p>
                  <p className="text-gray-500 text-sm mt-1">İlk değerlendirmeyi siz yapın!</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info & Purchase */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-medium">
                  {account.category}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  account.status === 'available' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {account.status === 'available' ? 'Mevcut' : 'Satıldı'}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">{account.title}</h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <TagIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Platform:</span>
                  <span className="ml-2">{account.game}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <StarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Seviye/Değer:</span>
                  <span className="ml-2">{account.level}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Durum/Özellik:</span>
                  <span className="ml-2">{account.rank}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <CubeIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Stok:</span>
                  <span className={`ml-2 ${account.stock === 0 ? 'text-red-400' : account.stock <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {account.stock} adet {account.stock === 0 ? '(Tükendi)' : account.stock <= 5 ? '(Az kaldı)' : ''}
                  </span>
                </div>

                <div className="flex items-center text-gray-300">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Eklenme:</span>
                  <span className="ml-2">
                    {new Date(account.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm ml-2">
                  ({averageRating.toFixed(1)}/5 - {reviewCount} değerlendirme)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-orange-500 mr-2" />
                  {account.isOnSale && account.discountPercentage > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-orange-500">
                          ₺{account.price.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ₺{account.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-red-500 text-white text-sm rounded-full font-medium">
                        %{account.discountPercentage} İndirim
                      </div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-orange-500">
                      ₺{account.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={account.status !== 'available' || account.stock === 0}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {account.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                </button>
                
                <button
                  onClick={handlePurchase}
                  disabled={account.status !== 'available' || account.stock === 0 || isPurchasing}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Satın Alınıyor...
                    </div>
                  ) : account.stock === 0 ? (
                    'Stokta Yok'
                  ) : account.status === 'available' ? (
                    'Hemen Satın Al'
                  ) : (
                    'Satıldı'
                  )}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Güvenli Alışveriş</h4>
                  <p className="text-blue-300 text-sm">
                    Tüm işlemler platform üzerinden güvenle gerçekleşir. 
                    Hesap bilgileri satın alma sonrası teslim edilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <StructuredData 
        type="product" 
        data={{
          title: account.title,
          description: account.description,
          price: account.price,
          images: account.images || [],
          stock: account.stock,
          rating: averageRating,
          reviewCount: reviewCount
        }} 
      />
      
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: 'Ana Sayfa', url: 'https://hesapduragi.com' },
          { name: 'Ürünler', url: 'https://hesapduragi.com/products' },
          { name: account.title, url: `https://hesapduragi.com/products/${account._id}` }
        ]} 
      />
    </div>
  );
} 