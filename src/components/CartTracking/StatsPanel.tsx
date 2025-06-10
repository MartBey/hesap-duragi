import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, BellIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Stats {
  totalUsers: number;
  usersWithCart: number;
  totalCartValue: number;
  averageCartValue: number;
  abandonedCarts: number;
  completedOrders: number;
  conversionRate: number;
  timeStats: {
    last24h: {
      newCarts: number;
      abandonedCarts: number;
      completedOrders: number;
      notificationsSent: number;
    };
    last7d: {
      newCarts: number;
      abandonedCarts: number;
      completedOrders: number;
      notificationsSent: number;
    };
    last30d: {
      newCarts: number;
      abandonedCarts: number;
      completedOrders: number;
      notificationsSent: number;
    };
  };
  categoryStats: Array<{
    category: string;
    cartCount: number;
    totalValue: number;
  }>;
  gameStats: Array<{
    game: string;
    cartCount: number;
    totalValue: number;
  }>;
  notificationStats: {
    totalSent: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
}

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'last24h' | 'last7d' | 'last30d'>('last24h');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/cart-tracking/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistikler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Her 5 dakikada bir güncelle
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
        <div className="text-center py-8">
          <div className="text-gray-400">İstatistikler yüklenemedi</div>
        </div>
      </div>
    );
  }

  const periodStats = stats.timeStats[selectedPeriod];

  return (
    <div className="space-y-6">
      {/* Ana İstatistik Kartları - Sayfaya Yayılmış */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toplam Kullanıcılar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Toplam Kullanıcı</div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sepeti Olan Kullanıcılar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats.usersWithCart}</div>
              <div className="text-sm text-gray-400">Sepeti Olan</div>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <ShoppingCartIcon className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Toplam Sepet Değeri */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-500">₺{stats.totalCartValue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Toplam Değer</div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Satır İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Son 24 Saat */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Son 24 Saat</h3>
            <ArrowTrendingUpIcon className="h-6 w-6 text-orange-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{periodStats.newCarts}</div>
              <div className="text-sm text-gray-500">Yeni</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{periodStats.abandonedCarts}</div>
              <div className="text-sm text-gray-500">Terk</div>
            </div>
          </div>
        </div>

        {/* Kategoriler */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Kategoriler
          </h3>
          
          <div className="space-y-3">
            {stats.categoryStats.slice(0, 3).map((category) => (
              <div key={category.category} className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{category.category}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">{category.cartCount}</span>
                  <span className="text-sm font-medium text-orange-400">
                    ₺{(category.totalValue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bildirimler */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BellIcon className="h-6 w-6 mr-2 text-orange-500" />
              Bildirimler
            </h3>
            <span className="text-sm text-gray-400">{stats.notificationStats.totalSent}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">%{stats.notificationStats.deliveryRate}</div>
              <div className="text-sm text-gray-500">Teslimat</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">%{stats.notificationStats.openRate}</div>
              <div className="text-sm text-gray-500">Açılma</div>
            </div>
          </div>
        </div>

        {/* Dönüşüm Oranı */}
        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">%{stats.conversionRate}</div>
            <div className="text-sm text-orange-300">Dönüşüm Oranı</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 
 
 