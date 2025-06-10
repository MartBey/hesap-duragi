import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import CartDisplay from './CartDisplay';
import NotificationPanel from './NotificationPanel';
import StatsPanel from './StatsPanel';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastActivity: Date;
  cartItemCount: number;
  cartValue: number;
  registeredAt: Date;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: string;
  addedAt: Date;
  category: string;
  game: string;
  rank: string;
  level: number;
}

interface CartStats {
  totalItems: number;
  totalValue: number;
  oldestItem: number | null;
  categories: string[];
  games: string[];
}

const CartTrackingSystem: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartStats, setCartStats] = useState<CartStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    hasCart: false,
    sortBy: 'lastActivity',
    order: 'desc'
  });

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Kullanıcılar getiriliyor...', new Date().toLocaleTimeString());
      
      const params = new URLSearchParams();
      if (filters.hasCart) params.append('hasCart', 'true');
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.order);

      const response = await fetch(`/api/admin/cart-tracking/users?${params}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Kullanıcılar alındı:', data.total, 'kullanıcı', data.timestamp);
        setUsers(data.data.map((user: any) => ({
          ...user,
          lastActivity: new Date(user.lastActivity),
          registeredAt: new Date(user.registeredAt)
        })));
      } else {
        console.error('❌ Kullanıcı verisi alınamadı:', data.error);
      }
    } catch (error) {
      console.error('❌ Kullanıcılar alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı sepetini getir
  const fetchUserCart = async (userId: number) => {
    try {
      setLoading(true);
      console.log('🛒 Sepet getiriliyor, Kullanıcı ID:', userId, new Date().toLocaleTimeString());
      
      const response = await fetch(`/api/admin/cart-tracking/cart/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Sepet alındı:', data.data.items.length, 'ürün', data.timestamp);
        const items = data.data.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          total: (item.price * item.quantity).toFixed(2)
        }));
        
        setCartItems(items);
        setCartStats(data.data.stats);
        setSelectedUserId(userId);
      } else {
        console.error('❌ Sepet verisi alınamadı:', data.error);
      }
    } catch (error) {
      console.error('❌ Sepet verileri alınamadı:', error);
      setCartItems([]);
      setCartStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Bildirim gönder
  const sendNotification = async (title: string, message: string): Promise<void> => {
    if (!selectedUserId) throw new Error('Kullanıcı seçilmedi');
    
    const response = await fetch('/api/admin/cart-tracking/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUserId,
        title,
        message,
        type: 'cart_reminder'
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Bildirim gönderilemedi');
    }
  };

  // Sepetten ürün kaldır
  const removeFromCart = async (productId: number) => {
    if (!selectedUserId) return;
    
    try {
      const response = await fetch(
        `/api/admin/cart-tracking/cart/${selectedUserId}?productId=${productId}`,
        { method: 'DELETE' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setCartItems(cartItems.filter(item => item.productId !== productId));
        // Kullanıcı listesini güncelle
        fetchUsers();
      }
    } catch (error) {
      console.error('Ürün kaldırılamadı:', error);
    }
  };

  // Sayfa yüklendiğinde kullanıcıları getir
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Auto-refresh her 10 saniyede - daha sık güncelleme
  useEffect(() => {
    console.log('⏰ Auto-refresh başlatıldı (10 saniye)');
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh tetiklendi:', new Date().toLocaleTimeString());
      fetchUsers();
      if (selectedUserId) {
        fetchUserCart(selectedUserId);
      }
    }, 10000); // 30 saniye → 10 saniye

    return () => {
      console.log('⏹️ Auto-refresh durduruldu');
      clearInterval(interval);
    };
  }, [selectedUserId, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛒 Sepet Takip Sistemi
          </h1>
          <p className="text-gray-400 text-lg">
            Müşterilerin sepetlerini takip edin ve hatırlatma bildirimleri gönderin
          </p>
        </div>

        {/* Filtreler */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={filters.hasCart}
                onChange={(e) => setFilters(prev => ({ ...prev, hasCart: e.target.checked }))}
                className="mr-2 rounded"
              />
              Sadece sepeti olanlar
            </label>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="bg-gray-700 text-white rounded px-3 py-1"
            >
              <option value="lastActivity">Son Aktivite</option>
              <option value="cartValue">Sepet Değeri</option>
              <option value="cartItemCount">Ürün Sayısı</option>
              <option value="name">İsim</option>
            </select>
            
            <select
              value={filters.order}
              onChange={(e) => setFilters(prev => ({ ...prev, order: e.target.value }))}
              className="bg-gray-700 text-white rounded px-3 py-1"
            >
              <option value="desc">Azalan</option>
              <option value="asc">Artan</option>
            </select>
            
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Yükleniyor...' : 'Yenile'}
            </button>
          </div>
        </div>
        
        {/* Ana Grid - 3 Kolon Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sol Panel - Kullanıcı Listesi */}
          <div className="lg:col-span-1">
            <UserList 
              users={users}
              selectedUserId={selectedUserId}
              onUserSelect={fetchUserCart}
              loading={loading}
            />
          </div>
          
          {/* Orta Panel - Sepet İçeriği */}
          <div className="lg:col-span-1">
            <CartDisplay 
              cartItems={cartItems}
              selectedUserId={selectedUserId}
              onRemoveItem={removeFromCart}
              cartStats={cartStats}
              loading={loading}
            />
          </div>
          
          {/* Sağ Panel - Bildirim Paneli */}
          <div className="lg:col-span-1">
            <NotificationPanel 
              selectedUserId={selectedUserId}
              onSendNotification={sendNotification}
              selectedUser={users.find(u => u.id === selectedUserId)}
            />
          </div>
        </div>

        {/* İstatistikler Paneli - Alt Kısımda */}
        <div>
          <StatsPanel />
        </div>
      </div>
    </div>
  );
};
  
  export default CartTrackingSystem; 