'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  orderNumber: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  account: {
    _id: string;
    title: string;
    game: string;
    price: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'crypto' | 'wallet';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  notes?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [createOrderData, setCreateOrderData] = useState({
    buyerId: '',
    accountId: '',
    amount: '',
    paymentMethod: 'manual',
    status: 'pending',
    paymentStatus: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filterStatus, filterPayment, searchTerm]);

  useEffect(() => {
    if (showCreateModal) {
      fetchUsers();
      fetchAccounts();
    }
  }, [showCreateModal]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Admin token bulunamadı');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterPayment !== 'all' && { paymentStatus: filterPayment }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders.map((order: any) => ({
            _id: order._id,
            orderNumber: order.orderId,
            buyer: order.buyer,
            seller: order.seller,
            account: {
              _id: order.account._id,
              title: order.account.title,
              game: order.account.game,
              price: order.amount
            },
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            totalAmount: order.amount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            notes: order.notes
          })));
        }
      } else {
        console.error('Siparişler getirilemedi:', response.statusText);
        // Hata durumunda mock data kullan
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Hata durumunda mock data kullan
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Admin token bulunamadı');
        return;
      }

      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Başarılı güncelleme - local state'i güncelle
          setOrders(orders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString().split('T')[0] }
              : order
          ));
        }
      } else {
        console.error('Sipariş durumu güncellenemedi:', response.statusText);
        alert('Sipariş durumu güncellenemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Sipariş durumu güncellenemedi. Lütfen tekrar deneyin.');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token bulunamadı, kullanıcılar yüklenemedi');
        return;
      }

      console.log('Kullanıcılar yükleniyor...');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Users API yanıtı:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Users API verisi:', data);
        if (data.success) {
          setUsers(data.data.users);
          console.log('Kullanıcılar yüklendi:', data.data.users.length, 'adet');
        }
      } else {
        console.error('Users API hatası:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token bulunamadı, hesaplar yüklenemedi');
        return;
      }

      console.log('Hesaplar yükleniyor...');
      const response = await fetch('/api/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Accounts API yanıtı:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Accounts API verisi:', data);
        if (data.success) {
          setAccounts(data.data.accounts);
          console.log('Hesaplar yüklendi:', data.data.accounts.length, 'adet');
        }
      } else {
        console.error('Accounts API hatası:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleCreateOrder = async () => {
    console.log('Sipariş oluşturma başlatıldı:', createOrderData);
    
    if (!createOrderData.buyerId || !createOrderData.accountId || !createOrderData.amount) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setCreateLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Oturum süresi dolmuş');
        return;
      }

      const requestBody = {
        buyerId: createOrderData.buyerId,
        accountId: createOrderData.accountId,
        amount: parseFloat(createOrderData.amount),
        paymentMethod: createOrderData.paymentMethod,
        status: createOrderData.status,
        paymentStatus: createOrderData.paymentStatus,
        notes: createOrderData.notes
      };

      console.log('API isteği gönderiliyor:', requestBody);

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API yanıtı alındı:', response.status, response.statusText);

      const data = await response.json();
      console.log('API yanıt verisi:', data);

      if (data.success) {
        alert('Sipariş başarıyla oluşturuldu');
        setShowCreateModal(false);
        setCreateOrderData({
          buyerId: '',
          accountId: '',
          amount: '',
          paymentMethod: 'manual',
          status: 'pending',
          paymentStatus: 'pending',
          notes: ''
        });
        fetchOrders(); // Listeyi yenile
      } else {
        console.error('API hatası:', data.error);
        alert('Sipariş oluşturulurken hata oluştu: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken hata oluştu: ' + (error?.message || 'Bilinmeyen hata'));
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'refunded': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      case 'refunded': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'processing': return 'İşleniyor';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      case 'refunded': return 'İade Edildi';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Ödendi';
      case 'pending': return 'Beklemede';
      case 'failed': return 'Başarısız';
      case 'refunded': return 'İade Edildi';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.account.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // İstatistikler
  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Sipariş Yönetimi</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Yeni Sipariş</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Tamamlanan</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Beklemede</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Gelir</p>
                <p className="text-2xl font-bold text-white">₺{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>


        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="processing">İşleniyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
              <option value="refunded">İade Edildi</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Ödemeler</option>
              <option value="paid">Ödendi</option>
              <option value="pending">Beklemede</option>
              <option value="failed">Başarısız</option>
              <option value="refunded">İade Edildi</option>
            </select>

            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                {filteredOrders.length} sipariş bulundu
              </span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Sipariş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Alıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Hesap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ödeme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{order.orderNumber}</div>
                        <div className="text-xs text-gray-400">ID: {order._id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{order.buyer.name}</div>
                        <div className="text-xs text-gray-400">{order.buyer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{order.account.title}</div>
                        <div className="text-xs text-gray-400">{order.account.game}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">₺{order.totalAmount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Beklemede</option>
                        <option value="processing">İşleniyor</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal Edildi</option>
                        <option value="refunded">İade Edildi</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Toplam {filteredOrders.length} sipariş
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600">
              Önceki
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600">
              Sonraki
            </button>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Yeni Sipariş Oluştur</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alıcı Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alıcı *
                </label>
                <select
                  value={createOrderData.buyerId}
                  onChange={(e) => setCreateOrderData({...createOrderData, buyerId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Alıcı seçin</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hesap Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hesap *
                </label>
                <select
                  value={createOrderData.accountId}
                  onChange={(e) => setCreateOrderData({...createOrderData, accountId: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Hesap seçin</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.title} - {account.game} (₺{account.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tutar */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tutar (₺) *
                </label>
                <input
                  type="number"
                  value={createOrderData.amount}
                  onChange={(e) => setCreateOrderData({...createOrderData, amount: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>



              {/* Ödeme Yöntemi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ödeme Yöntemi
                </label>
                <select
                  value={createOrderData.paymentMethod}
                  onChange={(e) => setCreateOrderData({...createOrderData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="manual">Manuel</option>
                  <option value="credit_card">Kredi Kartı</option>
                  <option value="bank_transfer">Banka Havalesi</option>
                  <option value="crypto">Kripto Para</option>
                  <option value="wallet">Cüzdan</option>
                </select>
              </div>

              {/* Sipariş Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sipariş Durumu
                </label>
                <select
                  value={createOrderData.status}
                  onChange={(e) => setCreateOrderData({...createOrderData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="pending">Beklemede</option>
                  <option value="processing">İşleniyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                  <option value="refunded">İade Edildi</option>
                </select>
              </div>

              {/* Ödeme Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ödeme Durumu
                </label>
                <select
                  value={createOrderData.paymentStatus}
                  onChange={(e) => setCreateOrderData({...createOrderData, paymentStatus: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="pending">Beklemede</option>
                  <option value="paid">Ödendi</option>
                  <option value="failed">Başarısız</option>
                  <option value="refunded">İade Edildi</option>
                </select>
              </div>

              {/* Notlar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notlar
                </label>
                <textarea
                  value={createOrderData.notes}
                  onChange={(e) => setCreateOrderData({...createOrderData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Sipariş ile ilgili notlar..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={createLoading}
              >
                İptal
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={createLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <span>Sipariş Oluştur</span>
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