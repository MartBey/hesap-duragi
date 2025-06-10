'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import {
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTransactions();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchTransactions = () => {
    // Mock transactions for demo
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        amount: 500,
        description: 'Kredi kartı ile bakiye yükleme',
        status: 'completed',
        date: '2024-01-15T10:30:00Z',
        reference: 'DEP-001'
      },
      {
        id: '2',
        type: 'purchase',
        amount: 150,
        description: 'CS2 Prime Hesabı satın alma',
        status: 'completed',
        date: '2024-01-16T14:20:00Z',
        reference: 'PUR-001'
      },
      {
        id: '3',
        type: 'deposit',
        amount: 200,
        description: 'Banka havalesi ile bakiye yükleme',
        status: 'pending',
        date: '2024-01-17T09:15:00Z',
        reference: 'DEP-002'
      }
    ];
    
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  };

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, filterType, filterStatus, dateRange, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpIcon className="h-6 w-6 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownIcon className="h-6 w-6 text-red-500" />;
      case 'purchase':
        return <ShoppingBagIcon className="h-6 w-6 text-blue-500" />;
      case 'refund':
        return <ArrowUpIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Bakiye Yükleme';
      case 'withdrawal':
        return 'Para Çekme';
      case 'purchase':
        return 'Satın Alma';
      case 'refund':
        return 'İade';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      default:
        return status;
    }
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
              <div className="bg-gray-800 rounded-lg h-32 mb-6"></div>
              <div className="bg-gray-800 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
            <div className="text-center">
              <p className="text-red-400">Kullanıcı bilgileri yüklenemedi</p>
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
            <h1 className="text-3xl font-bold text-white">İşlem Geçmişi</h1>
            <p className="text-gray-400 mt-2">Tüm finansal işlemlerinizi görüntüleyin ve filtreleyin</p>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Toplam İşlem</p>
                <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-400">
                  {filteredTransactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredTransactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Açıklama veya referans ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tüm Türler</option>
                <option value="deposit">Bakiye Yükleme</option>
                <option value="withdrawal">Para Çekme</option>
                <option value="purchase">Satın Alma</option>
                <option value="refund">İade</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="completed">Tamamlandı</option>
                <option value="pending">Beklemede</option>
                <option value="failed">Başarısız</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setDateRange('all');
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Temizle
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              İşlemler ({filteredTransactions.length})
            </h3>
            
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-600/50 rounded-lg p-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {getTransactionTypeText(transaction.type)}
                          </h4>
                          <p className="text-sm text-gray-400">{transaction.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                            {transaction.reference && (
                              <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                        <p className={`text-lg font-bold ${
                          transaction.type === 'deposit' || transaction.type === 'refund' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">İşlem bulunamadı</h4>
                <p className="text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 