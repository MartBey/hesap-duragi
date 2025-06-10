'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TopBar from '@/components/TopBar';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  orderId: string;
  account: {
    _id: string;
    title: string;
    game: string;
    price: number;
  };
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    isAnonymous: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Debug state'leri
  console.log('showReviewModal:', showReviewModal);
  console.log('selectedOrder:', selectedOrder);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      _id: '1',
      orderId: 'ORD-2024-001',
      account: {
        _id: 'acc1',
        title: 'CS2 Global Elite Hesabı',
        game: 'Counter-Strike 2',
        price: 1500
      },
      amount: 1500,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      _id: '2',
      orderId: 'ORD-2024-002',
      account: {
        _id: 'acc2',
        title: 'Valorant Immortal Hesabı',
        game: 'Valorant',
        price: 800
      },
      amount: 800,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      _id: '3',
      orderId: 'ORD-2024-003',
      account: {
        _id: 'acc3',
        title: 'League of Legends Diamond Hesabı',
        game: 'League of Legends',
        price: 600
      },
      amount: 600,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T10:00:00Z'
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('Token kontrol:', token ? 'Token var' : 'Token yok');
    
    if (!token) {
      console.log('Token yok, mock data kullanılacak');
      // Token yoksa da mock data kullan (test için)
      setOrders(mockOrders);
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('fetchOrders: Token yok');
      return;
    }

    console.log('fetchOrders: API çağrısı yapılıyor...');
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('fetchOrders: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('fetchOrders: API data:', data);
        if (data.success && data.orders && data.orders.length > 0) {
          console.log('fetchOrders: API data kullanılıyor');
          setOrders(data.orders);
        } else {
          console.log('fetchOrders: API boş, mock data kullanılıyor');
          setOrders(mockOrders);
        }
      } else {
        console.log('fetchOrders: API başarısız, mock data kullanılıyor');
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('fetchOrders: Hata:', error);
      console.log('fetchOrders: Hata durumunda mock data kullanılıyor');
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (filterStatus === 'all') return true;
      return order.status === filterStatus;
    });
  };

  const openReviewModal = (order: Order) => {
    console.log('openReviewModal: Çağrıldı');
    console.log('order:', order);
    setSelectedOrder(order);
    setReviewData({
      rating: 0,
      comment: '',
      isAnonymous: false
    });
    setShowReviewModal(true);
    console.log('openReviewModal: Modal açıldı');
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviewData({
      rating: 0,
      comment: '',
      isAnonymous: false
    });
  };

  const handleSubmitReview = async () => {
    console.log('handleSubmitReview: Başlatıldı');
    console.log('selectedOrder:', selectedOrder);
    console.log('reviewData:', reviewData);
    
    if (!selectedOrder || reviewData.rating === 0) {
      console.log('handleSubmitReview: Gerekli veriler eksik');
      alert('Lütfen bir puan verin');
      return;
    }

    setSubmitLoading(true);
    console.log('handleSubmitReview: Loading başlatıldı');
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('handleSubmitReview: Token kontrol:', token ? 'Token var' : 'Token yok');
      
      if (!token) {
        console.log('handleSubmitReview: Token yok');
        alert('Değerlendirme yapabilmek için giriş yapmanız gerekiyor.');
        setSubmitLoading(false);
        return;
      }

      console.log('handleSubmitReview: API çağrısı yapılıyor...');
      const requestBody = {
        accountId: selectedOrder.account._id,
        orderId: selectedOrder._id,
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
        isAnonymous: reviewData.isAnonymous
      };
      console.log('handleSubmitReview: Request body:', requestBody);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('handleSubmitReview: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('handleSubmitReview: Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('handleSubmitReview: Response data:', data);

      if (data.success) {
        alert('Değerlendirmeniz başarıyla gönderildi! Admin onayından sonra yayınlanacak.');
        closeReviewModal();
      } else {
        alert('Değerlendirme gönderilirken hata oluştu: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error: any) {
      console.error('handleSubmitReview: Hata:', error);
      
      let errorMessage = 'Değerlendirme gönderilirken hata oluştu';
      if (error.message) {
        if (error.message.includes('401')) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Gönderilen veriler geçersiz. Lütfen kontrol edin.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setSubmitLoading(false);
      console.log('handleSubmitReview: Loading tamamlandı');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => setReviewData({...reviewData, rating: star}) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <StarIcon 
              className={`h-6 w-6 ${
                star <= rating 
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredOrdersList = getFilteredOrders();

  const orderStats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0)
  };



  if (loading) {
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
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
          <TopBar />
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="bg-gray-800/50 rounded-lg h-32 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg h-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative z-10">
        <TopBar />
        <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Siparişlerim</h1>
          <p className="text-gray-400 mt-2">Tüm sipariş geçmişinizi görüntüleyin</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-white">{orderStats.total}</p>
              </div>
              <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-400">{orderStats.completed}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Beklemede</p>
                <p className="text-2xl font-bold text-yellow-400">{orderStats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">İptal Edilen</p>
                <p className="text-2xl font-bold text-red-400">{orderStats.cancelled}</p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Toplam Harcama</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(orderStats.totalSpent)}</p>
              </div>
              <CreditCardIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tümü ({orderStats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Beklemede ({orderStats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tamamlanan ({orderStats.completed})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            İptal Edilen ({orderStats.cancelled})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrdersList.length > 0 ? (
            filteredOrdersList.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500 rounded-lg p-3">
                      <ShoppingBagIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{order.account.title}</h3>
                      <p className="text-gray-400">{order.account.game}</p>
                      <p className="text-sm text-gray-500">Sipariş No: {order.orderId}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{formatCurrency(order.amount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Sipariş Tarihi</p>
                      <p className="text-white">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Ödeme Durumu</p>
                      <p className={`${
                        order.paymentStatus === 'paid' ? 'text-green-400' :
                        order.paymentStatus === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Ödendi' :
                         order.paymentStatus === 'pending' ? 'Beklemede' : 'İade Edildi'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => router.push(`/products/${order.account._id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>Detayları Gör</span>
                  </button>
                  
                  {order.status === 'completed' && (
                    <button
                      onClick={(e) => {
                        console.log('Değerlendirme butonu tıklandı!');
                        console.log('Event:', e);
                        console.log('Order:', order);
                        e.preventDefault();
                        e.stopPropagation();
                        openReviewModal(order);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                      style={{ cursor: 'pointer' }}
                    >
                      <StarIcon className="h-4 w-4" />
                      <span>Değerlendirme Yap</span>
                    </button>
                  )}
                  
                  {order.status === 'pending' && (
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      İptal Et
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              {/* Custom Empty Orders Image */}
              <div className="mb-8">
                <img 
                  src="/images/emptyCartPage.png" 
                  alt="Boş Sipariş Listesi" 
                  className="w-80 h-80 mx-auto opacity-90 mb-6"
                />
              </div>
              
              {/* Content Below Image */}
              <div className="max-w-lg mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {filterStatus === 'all' ? '🛒 Henüz Bir Siparişiniz Yok' : `${getStatusText(filterStatus)} Sipariş Bulunamadı`}
                </h3>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {filterStatus === 'all' 
                    ? 'Sipariş geçmişiniz boş görünüyor. İlk siparişinizi vermek için harika oyun hesaplarımızı keşfedin!'
                    : 'Bu durumda sipariş bulunmuyor. Diğer filtreleri deneyebilir veya yeni sipariş verebilirsiniz.'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/products')}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🛒 Alışverişe Başla
                  </button>
                  <button
                    onClick={() => router.push('/categories')}
                    className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl hover:border-orange-500 hover:text-white hover:bg-orange-500/10 transition-all duration-300 font-semibold text-lg"
                  >
                    🎮 Kategorileri Keşfet
                  </button>
                </div>
                
                {filterStatus !== 'all' && (
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="mt-4 px-6 py-2 text-orange-400 hover:text-orange-300 transition-colors underline"
                  >
                    Tüm Siparişleri Göster
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Değerlendirme Yap</h3>
              <button
                onClick={closeReviewModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Product Info */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-1">{selectedOrder.account.title}</h4>
              <p className="text-gray-400 text-sm">{selectedOrder.account.game}</p>
              <p className="text-orange-400 font-semibold">{formatCurrency(selectedOrder.amount)}</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Puanınız *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(reviewData.rating, true)}
                <span className="text-gray-400 ml-2">
                  {reviewData.rating > 0 ? `${reviewData.rating}/5` : 'Puan verin'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yorumunuz
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Hesap hakkındaki deneyiminizi paylaşın..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewData.comment.length}/500 karakter
              </p>
            </div>

            {/* Anonymous Option */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewData.isAnonymous}
                  onChange={(e) => setReviewData({...reviewData, isAnonymous: e.target.checked})}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-sm text-gray-300">Anonim olarak değerlendir</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={closeReviewModal}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={submitLoading}
              >
                İptal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitLoading || reviewData.rating === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <StarIcon className="h-4 w-4" />
                    <span>Değerlendirmeyi Gönder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 