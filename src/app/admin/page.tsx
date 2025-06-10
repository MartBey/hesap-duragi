'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  PuzzlePieceIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  TagIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  activeListings: number;
  openSupportTickets: number;
  urgentSupportTickets: number;
}

interface SupportNotification {
  _id: string;
  ticketId: string;
  userName: string;
  subject: string;
  priority: string;
  createdAt: string;
}

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAccounts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeListings: 0,
    openSupportTickets: 0,
    urgentSupportTickets: 0
  });
  const [supportNotifications, setSupportNotifications] = useState<SupportNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);
  const [isNotificationAnimating, setIsNotificationAnimating] = useState(false);

  useEffect(() => {
    // localStorage'dan son kontrol zamanını oku
    const saved = localStorage.getItem('lastNotificationCheck');
    if (saved) {
      setLastNotificationCheck(new Date(saved));
    }
    
    fetchDashboardData();
    fetchSupportNotifications();
    requestNotificationPermission();
    
    // Destek bildirimleri için polling (her 15 saniyede bir kontrol et)
    const interval = setInterval(() => {
      fetchSupportNotifications();
    }, 15000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSupportNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNotificationCheck]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotificationDropdown && !target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Gerçek istatistikleri al
      const [usersResponse, supportResponse] = await Promise.all([
        fetch('/api/admin/users?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/support?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const usersData = await usersResponse.json();
      const supportData = await supportResponse.json();

      if (usersData.success && supportData.success) {
        setStats({
          totalUsers: usersData.data.stats?.total || 0,
          totalAccounts: 856, // Bu değer accounts API'sinden gelecek
          totalSales: 342, // Bu değer orders API'sinden gelecek
          totalRevenue: 125600, // Bu değer orders API'sinden gelecek
          pendingOrders: 23, // Bu değer orders API'sinden gelecek
          activeListings: 634, // Bu değer accounts API'sinden gelecek
          openSupportTickets: supportData.stats?.total || 0,
          urgentSupportTickets: supportData.stats?.byPriority?.find((p: any) => p._id === 'urgent')?.count || 0
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error);
      setLoading(false);
    }
  }, []);

  const fetchSupportNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/support?limit=10&status=open', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const notifications = data.tickets.slice(0, 10);
        
        // Yeni bildirimleri kontrol et
        const newNotifications = notifications.filter((notification: any) => 
          new Date(notification.createdAt) > lastNotificationCheck
        );
        
        if (newNotifications.length > 0) {
          setNewNotificationCount(prev => prev + newNotifications.length);
          
          // Bildirim animasyonu başlat
          setIsNotificationAnimating(true);
          setTimeout(() => setIsNotificationAnimating(false), 1000);
          
          // Ses çal
          playNotificationSound();
          
          // Toast bildirim göster
          showToast({
            id: Date.now().toString(),
            title: 'Yeni Destek Bileti!',
            message: `${newNotifications.length} yeni destek bileti var`,
            type: 'info',
            duration: 5000
          });
          
          // Browser notification göster
          if (Notification.permission === 'granted') {
            new Notification('Yeni Destek Bileti', {
              body: `${newNotifications.length} yeni destek bileti var`,
              icon: '/hd.gif',
              tag: 'support-notification'
            });
          }
        }
        
        setSupportNotifications(notifications);
        
        // Stats'ı güncelle
        setStats(prev => ({
          ...prev,
          openSupportTickets: data.stats.total,
          urgentSupportTickets: notifications.filter((n: any) => n.priority === 'urgent').length
        }));
      }
    } catch (error) {
      console.error('Destek bildirimleri yüklenirken hata:', error);
    }
  }, [lastNotificationCheck]);

  const markNotificationsAsRead = () => {
    const now = new Date();
    setLastNotificationCheck(now);
    localStorage.setItem('lastNotificationCheck', now.toISOString());
    setNewNotificationCount(0);
    setShowNotificationDropdown(false);
    
    // Başarı toast'ı göster
    showToast({
      id: Date.now().toString(),
      title: 'Bildirimler Okundu',
      message: 'Tüm bildirimler okundu olarak işaretlendi',
      type: 'success',
      duration: 3000
    });
  };

  const requestNotificationPermission = useCallback(async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast({
          id: Date.now().toString(),
          title: 'Bildirimler Aktif',
          message: 'Tarayıcı bildirimleri başarıyla etkinleştirildi',
          type: 'success',
          duration: 3000
        });
      }
    }
  }, []);

  const showToast = (toast: ToastNotification) => {
    setToastNotifications(prev => [...prev, toast]);
    
    // Otomatik kaldırma
    if (toast.duration) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }
  };

  const removeToast = (id: string) => {
    // Önce çıkış animasyonu ekle
    setToastNotifications(prev => 
      prev.map(toast => 
        toast.id === id 
          ? { ...toast, isRemoving: true } as ToastNotification & { isRemoving?: boolean }
          : toast
      )
    );
    
    // Animasyon tamamlandıktan sonra kaldır
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-100';
      case 'high': return 'text-orange-500 bg-orange-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Acil';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckIcon;
      case 'error': return XMarkIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'info': return BellIcon;
      default: return BellIcon;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const quickActions = [
    {
      title: 'Hesap Yönetimi',
      description: 'Hesapları görüntüle ve yönet',
      href: '/admin/accounts',
      icon: PuzzlePieceIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları görüntüle ve yönet',
      href: '/admin/users',
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Kategori Yönetimi',
      description: 'Hesap ve lisans kategorilerini yönet',
      href: '/admin/categories',
      icon: TagIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Değerlendirme Yönetimi',
      description: 'Kullanıcı değerlendirmelerini onayla ve yönet',
      href: '/admin/reviews',
      icon: StarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Blog Yönetimi',
      description: 'Blog yazılarını oluştur ve yönet',
      href: '/admin/blog',
      icon: NewspaperIcon,
      color: 'bg-emerald-500'
    },
    {
      title: 'Destek Yönetimi',
      description: 'Destek biletlerini görüntüle ve yanıtla',
      href: '/admin/support',
      icon: QuestionMarkCircleIcon,
      color: 'bg-cyan-500',
      badge: stats.openSupportTickets > 0 ? stats.openSupportTickets : undefined
    },
    {
      title: 'Yardım İçerik Yönetimi',
      description: 'Help sayfası içeriklerini düzenle',
      href: '/admin/help-content',
      icon: QuestionMarkCircleIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Sepet Takip',
      description: 'Kullanıcı sepetlerini takip et ve bildirim gönder',
      href: '/admin/cart-tracking',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
        </svg>
      ),
      color: 'bg-pink-500'
    },
    {
      title: 'Sipariş Yönetimi',
      description: 'Siparişleri takip et ve yönet',
      href: '/admin/orders',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Raporlar',
      description: 'Satış ve analitik raporları',
      href: '/admin/reports',
      icon: ChartBarIcon,
      color: 'bg-orange-500'
    },
    {
      title: 'Ayarlar',
      description: 'Sistem ayarları ve konfigürasyon',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      color: 'bg-gray-500'
    },
    {
      title: 'Loglar',
      description: 'Sistem logları ve aktiviteler',
      href: '/admin/logs',
      icon: DocumentTextIcon,
      color: 'bg-red-500'
    }
  ];

  const playNotificationSound = () => {
    try {
      // Web Audio API ile basit bildirim sesi oluştur
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Bildirim sesi parametreleri
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Toast Notifications Container */}
      <div className="toast-container">
        {toastNotifications.map((toast, index) => {
          const IconComponent = getToastIcon(toast.type);
          const toastWithRemoving = toast as ToastNotification & { isRemoving?: boolean };
          return (
            <div
              key={toast.id}
              className={`toast-item flex items-center p-4 rounded-lg shadow-2xl backdrop-blur-sm border border-white/20 transform transition-all duration-300 ease-in-out max-w-sm ${
                toastWithRemoving.isRemoving ? 'animate-slide-out-right' : 'animate-slide-in-right'
              }`}
              style={{
                background: 'rgba(17, 24, 39, 0.98)',
                zIndex: 99998 - index,
              }}
            >
              <div className={`p-2 rounded-full ${getToastColor(toast.type)} mr-3 flex-shrink-0`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{toast.title}</h4>
                <p className="text-gray-300 text-xs mt-1 line-clamp-2">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10 rounded"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* AdminNavbar */}
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-300">HesapDurağı yönetim paneline hoş geldiniz</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <PuzzlePieceIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Hesap</p>
                <p className="text-2xl font-bold text-white">{stats.totalAccounts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <ShoppingBagIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Satış</p>
                <p className="text-2xl font-bold text-white">{stats.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-500/20">
                <CurrencyDollarIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Gelir</p>
                <p className="text-2xl font-bold text-white">₺{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Notifications */}
        {stats.urgentSupportTickets > 0 && (
          <div className="mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400">Acil Destek Bildirimleri</h3>
                  <p className="text-red-300 text-sm">
                    {stats.urgentSupportTickets} adet acil destek bileti bekliyor!
                  </p>
                </div>
                <Link 
                  href="/admin/support?priority=urgent" 
                  className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Hemen İncele
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Support Tickets */}
        {supportNotifications.length > 0 && (
          <div className="mb-8">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Son Destek Bildirimleri</h3>
                <Link href="/admin/support" className="text-orange-500 hover:text-orange-400 text-sm">
                  Tümünü Gör
                </Link>
              </div>
              <div className="space-y-3">
                {supportNotifications.map((notification) => (
                  <div key={notification._id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-cyan-500" />
                      <div>
                        <p className="text-white text-sm font-medium">{notification.subject}</p>
                        <p className="text-gray-400 text-xs">
                          {notification.userName} • #{notification.ticketId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {getPriorityText(notification.priority)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(notification.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="group">
              <div className="card hover:border-orange-500/50 transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  {action.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .btn-secondary {
          background: rgba(75, 85, 99, 0.8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 1px solid rgba(156, 163, 175, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(107, 114, 128, 0.8);
          border-color: rgba(156, 163, 175, 0.5);
        }

        /* Toast Animation */
        @keyframes slide-in-right {
          from {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        /* Dropdown specific animation */
        @keyframes dropdown-slide-in {
          from {
            transform: translateX(20px) translateY(-10px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-dropdown-slide-in {
          animation: dropdown-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slide-out-right {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-out-right {
          animation: slide-out-right 0.3s ease-in;
        }

        /* Toast Container Stacking */
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 99998;
          pointer-events: none;
        }

        .toast-item {
          pointer-events: auto;
          margin-bottom: 0.75rem;
          position: relative;
        }

        /* Notification Bell Animations */
        @keyframes notification-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        .animate-notification-shake {
          animation: notification-shake 0.5s ease-in-out;
        }

        /* Pulse Ring Animation */
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Notification Dropdown Animation */
        .notification-dropdown .dropdown-enter {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }

        .notification-dropdown .dropdown-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: all 0.2s ease-out;
        }

        /* Notification Dropdown Overlay */
        .notification-dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          z-index: 999998;
          backdrop-filter: blur(2px);
        }

        /* Glow Effect for New Notifications */
        .notification-glow {
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
        }

        /* Dropdown Enhanced Styling */
        .notification-dropdown-content {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.99) 0%, rgba(31, 41, 55, 0.99) 100%);
          backdrop-filter: blur(25px);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.9),
            0 10px 25px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(249, 115, 22, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          position: fixed;
          z-index: 999999;
          transform-origin: top right;
        }

        /* Responsive positioning for dropdown */
        @media (max-width: 640px) {
          .notification-dropdown-content {
            top: 4rem !important;
            right: 0.5rem !important;
            left: 0.5rem !important;
            width: auto !important;
          }
        }

        /* Ensure dropdown is always on top */
        .notification-dropdown {
          position: relative;
          z-index: 999999 !important;
        }

        .notification-dropdown-content {
          z-index: 999999 !important;
          position: fixed !important;
          top: 4rem !important;
          right: 1rem !important;
        }

        .notification-dropdown-overlay {
          z-index: 999998 !important;
        }
      `}</style>
    </div>
  );
} 